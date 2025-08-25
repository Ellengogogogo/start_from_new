"""
Property service for business logic
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from sqlalchemy.orm import selectinload
from typing import List, Optional
from openai import AsyncOpenAI
from app.core.config import settings
from app.prompts.prompts import BESCHREIBUNG_PROMPT_DE, LOCATION_PROMPT_DE
import json


from app.core.database import Property
from app.schemas.property import PropertyCreate, PropertyUpdate


class PropertyService:
    """Property business logic service"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create_property(self, property_data: PropertyCreate, owner_id: int = 1) -> Property:
        """Create a new property"""
        # Convert features to JSON string if provided
        features = None
        if property_data.features:
            if isinstance(property_data.features, str):
                features = property_data.features
            else:
                features = json.dumps(property_data.features)
        
        # Create property object
        property_obj = Property(
            **property_data.dict(exclude={'features'}),
            features=features,
            owner_id=owner_id
        )
        
        self.db.add(property_obj)
        await self.db.commit()
        await self.db.refresh(property_obj)
        
        return property_obj
    
    async def generate_ai_description(self, property_data: PropertyCreate, style: str = "formal") -> str:
        """Generate AI description using OpenAI API"""

        try:
            
            # 创建 OpenAI 客户端
            client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
            
            # 构建德语 prompt
            prompt = self._build_german_description_prompt(property_data)
            
            # 调用 OpenAI API
            response = await client.chat.completions.create(
                model="gpt-4nano",
                messages=[
                    {
                        "role": "system",
                        "content": "Du bist ein erfahrener Immobilien-Texter. Erstelle eine professionelle Immobilienbeschreibung auf Deutsch."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens=500,
                temperature=0.7
            )
            
            # 提取生成的描述
            description = response.choices[0].message.content.strip()
            return description
            
        except Exception as e:
            print(f"OpenAI API 调用失败: {e}")
            # 如果 API 调用失败，返回默认描述
            return self._generate_fallback_description(property_data, style)
    
    def _build_german_description_prompt(self, property_data: PropertyCreate) -> str:
        """构建用于 OpenAI API 的德语 prompt"""
        
        # 提取房源信息
        property_type = property_data.property_type or "Wohnung"
        area_sqm = property_data.area_sqm
        rooms = property_data.rooms
        year_built = property_data.year_built
        energy_class = getattr(property_data, 'energy_class', None)
        condition = getattr(property_data, 'condition', 'gepflegt')
        equipment = getattr(property_data, 'equipment', '')
        features = getattr(property_data, 'features', '')
        grundstuecksflaeche = getattr(property_data, 'grundstuecksflaeche', None)
        floor = getattr(property_data, 'floor', None)
        
        # 使用德语 prompt 模板
        prompt = BESCHREIBUNG_PROMPT_DE.format(
            property_type=property_type,
            rooms=rooms or "n/a",
            area_sqm=area_sqm or "n/a",
            grundstuecksflaeche=grundstuecksflaeche or "n/a",
            floor=floor or "n/a",
            year_built=year_built or "n/a",
            condition=condition,
            equipment=equipment or "n/a",
            features=features or "n/a",
            energy_class=energy_class or "n/a"
        )
        
        return prompt
    
    async def generate_location_description(self, property_data: PropertyCreate, style: str = "formal") -> str:
        """Generate AI location description using OpenAI API"""
        
        try:
            # 创建 OpenAI 客户端
            client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
            
            # 构建德语地理位置 prompt
            prompt = self._build_german_location_prompt(property_data, style)
            
            # 调用 OpenAI API
            response = await client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {
                        "role": "system",
                        "content": "Du bist ein erfahrener Immobilien-Texter. Erstelle eine professionelle Lagebeschreibung auf Deutsch."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens=400,
                temperature=0.7
            )
            
            # 提取生成的地理位置描述
            location_description = response.choices[0].message.content.strip()
            return location_description
            
        except Exception as e:
            print(f"OpenAI API 调用失败: {e}")
            # 如果 API 调用失败，返回默认地理位置描述
            return self._generate_fallback_location_description(property_data, style)
    
    def _build_german_location_prompt(self, property_data: PropertyCreate, style: str) -> str:
        """构建用于 OpenAI API 的德语地理位置 prompt"""
        
        city = property_data.city or "Stadt"
        address = property_data.address or "Adresse"
        
        # 根据风格调整 prompt
        style_instruction = ""
        if style == "marketing":
            style_instruction = "Schreibe in einem verkaufsfördernden, enthusiastischen Stil mit positiven Superlativen."
        elif style == "family":
            style_instruction = "Schreibe in einem warmen, familienfreundlichen Stil, der Sicherheit und Wohlbefinden betont."
        else:  # formal
            style_instruction = "Schreibe in einem seriösen, professionellen Stil mit klaren Fakten."
        
        # 使用德语地理位置 prompt 模板
        prompt = LOCATION_PROMPT_DE.format(
            city=city,
            address=address,
            location_keywords="n/a"
        )
        
        # 添加风格指导
        prompt += f"\n\nStil-Anweisung: {style_instruction}"
        
        return prompt
    
    def _generate_fallback_location_description(self, property_data: PropertyCreate, style: str = "formal") -> str:
        """生成备用地理位置描述（当 OpenAI API 不可用时）"""
        city = property_data.city or "Stadt"
        address = property_data.address or "Adresse"
        
        if style == "marketing":
            return f"🏠 Exzellente Lage! Diese Immobilie in {city} an der {address} bietet eine erstklassige Verkehrsanbindung mit perfekter Infrastruktur! In unmittelbarer Nähe befinden sich exklusive Einkaufsmöglichkeiten, renommierte Schulen und erstklassige medizinische Einrichtungen. Die Wohngegend ist absolut ruhig und bietet ein luxuriöses Wohnambiente mit großem Wertsteigerungspotenzial!"
        elif style == "family":
            return f"Die Immobilie befindet sich in der familienfreundlichen {city} an der {address}. Die Lage ist verkehrsgünstig gelegen und bietet eine sichere, ruhige Umgebung für Ihre Familie. In der Nähe befinden sich alle wichtigen Einrichtungen: Einkaufsmöglichkeiten, Schulen, Kindergärten und medizinische Versorgung. Die Wohngegend ist ideal für Familien mit Kindern."
        else:  # formal
            return f"Die Immobilie befindet sich in der {city} an der {address}. Die Lage ist verkehrsgünstig gelegen und bietet eine gute Anbindung an den öffentlichen Nahverkehr. In der Nähe befinden sich Einkaufsmöglichkeiten, Schulen und medizinische Einrichtungen. Die Wohngegend ist ruhig und familienfreundlich."
    
    def _generate_fallback_description(self, property_data: PropertyCreate, style: str) -> str:
        """生成备用描述（当 OpenAI API 不可用时）"""
        property_type = property_data.property_type or "Wohnung"
        address = property_data.address or "Adresse"
        city = property_data.city or "Stadt"
        area_sqm = property_data.area_sqm
        rooms = property_data.rooms
        year_built = property_data.year_built
        
        if style == "marketing":
            return f"🏠 Exzellente Investitionsmöglichkeit! Diese hochwertige {property_type} in {address} bietet eine erstklassige Lage mit hervorragender Verkehrsanbindung. {f'Die Wohnfläche beträgt {area_sqm} m², ' if area_sqm else ''}{f'die Immobilie verfügt über {rooms} Zimmer, ' if rooms else ''}{f'erbaut im Jahr {year_built}, ' if year_built else ''}mit perfekter Infrastruktur und großem Wertsteigerungspotenzial!"
        elif style == "family":
            return f"Gemütliche {property_type} in {address}, die Ihrer Familie eine perfekte Wohnumgebung bietet. {f'Die Wohnfläche beträgt {area_sqm} m², ' if area_sqm else ''}{f'die Immobilie verfügt über {rooms} Zimmer, ' if rooms else ''}{f'erbaut im Jahr {year_built}, ' if year_built else ''}mit schöner Umgebung, ideal für Familien."
        else:  # formal
            return f"Dieses {property_type} in {address} zeichnet sich durch außergewöhnliche Bauqualität und durchdachtes Design aus. {f'Die Wohnfläche beträgt etwa {area_sqm} m², ' if area_sqm else ''}{f'die Immobilie verfügt über {rooms} Zimmer, ' if rooms else ''}{f'erbaut im Jahr {year_built}, ' if year_built else ''}mit exzellenter Lage im Herzen von {city} und perfekter Infrastruktur."
    
    async def get_properties(self, skip: int = 0, limit: int = 100) -> List[Property]:
        """Get properties with pagination"""
        query = select(Property).offset(skip).limit(limit)
        result = await self.db.execute(query)
        return result.scalars().all()
    
    async def get_property(self, property_id: int) -> Optional[Property]:
        """Get a specific property by ID"""
        query = select(Property).where(Property.id == property_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()
    
    async def update_property(self, property_id: int, property_data: PropertyUpdate) -> Optional[Property]:
        """Update a property"""
        # Get existing property
        property_obj = await self.get_property(property_id)
        if not property_obj:
            return None
        
        # Prepare update data
        update_data = property_data.dict(exclude_unset=True)
        
        # Handle features field
        if 'features' in update_data and update_data['features']:
            if isinstance(update_data['features'], str):
                update_data['features'] = update_data['features']
            else:
                update_data['features'] = json.dumps(update_data['features'])
        
        # Update property
        query = update(Property).where(Property.id == property_id).values(**update_data)
        await self.db.execute(query)
        await self.db.commit()
        
        # Return updated property
        return await self.get_property(property_id)
    
    async def delete_property(self, property_id: int) -> bool:
        """Delete a property"""
        property_obj = await self.get_property(property_id)
        if not property_obj:
            return False
        
        query = delete(Property).where(Property.id == property_id)
        await self.db.execute(query)
        await self.db.commit()
        
        return True
    
    async def get_properties_by_owner(self, owner_id: int) -> List[Property]:
        """Get properties by owner ID"""
        query = select(Property).where(Property.owner_id == owner_id)
        result = await self.db.execute(query)
        return result.scalars().all()
    
    async def search_properties(self, search_term: str) -> List[Property]:
        """Search properties by title, description, or address"""
        query = select(Property).where(
            Property.title.ilike(f"%{search_term}%") |
            Property.description.ilike(f"%{search_term}%") |
            Property.address.ilike(f"%{search_term}%") |
            Property.city.ilike(f"%{search_term}%")
        )
        result = await self.db.execute(query)
        return result.scalars().all()
