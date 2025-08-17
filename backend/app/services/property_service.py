"""
Property service for business logic
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from sqlalchemy.orm import selectinload
from typing import List, Optional
from openai import AsyncOpenAI
from app.core.config import settings
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
            # 检查是否有 OpenAI API key
            if not hasattr(settings, 'OPENAI_API_KEY') or not settings.OPENAI_API_KEY:
                # 如果没有 API key，返回默认描述
                return self._generate_fallback_description(property_data, style)
            
            # 创建 OpenAI 客户端
            client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
            
            # 构建 prompt
            prompt = self._build_description_prompt(property_data, style)
            
            # 调用 OpenAI API
            response = await client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {
                        "role": "system",
                        "content": "你是一个专业的房地产文案撰写专家，擅长根据房源信息撰写吸引人的房源描述。"
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
    
    def _build_description_prompt(self, property_data: PropertyCreate, style: str) -> str:
        """构建用于 OpenAI API 的 prompt"""
        
        # 提取房源信息
        property_type = property_data.property_type or "房屋"
        area_sqm = property_data.area_sqm
        rooms = property_data.rooms
        # bedrooms = property_data.bedrooms
        # bathrooms = property_data.bathrooms
        year_built = property_data.year_built
        address = property_data.address
        city = property_data.city or "城市"
        # energy_class = property_data.energy_class
        description = property_data.description
        
        # 根据风格设置不同的 prompt
        style_instructions = {
            "formal": "请使用正式、专业的语言，突出房源的品质和投资价值。",
            "marketing": "请使用营销感强的语言，突出卖点和投资机会，可以使用emoji表情。",
            "family": "请使用温馨、家庭友好的语言，强调居住舒适性和生活便利性。"
        }
        
        prompt = f"""
                请根据以下房源信息，撰写一段{style}风格的房源描述：

                房源类型：{property_type}
                地址：{address}
                城市：{city}
                {f"建筑面积：{area_sqm}平方米" if area_sqm else ""}
                {f"房间数量：{rooms}间" if rooms else ""}
                {f"建成年份：{year_built}年" if year_built else ""}

                要求：
                1. {style_instructions.get(style, style_instructions["formal"])}
                2. 描述要包括：结合{description}，房源整体介绍、特色亮点、地理位置优势、周边配套设施
                3. 根据城市信息，描述该城市的特点和环境
                3. 语言要自然流畅，符合中文表达习惯
                4. 长度控制在200-300字左右
                5. 突出该房源的核心卖点和优势

                请直接返回描述文本，不要包含任何其他内容。
                """
        return prompt
    
    def _generate_fallback_description(self, property_data: PropertyCreate, style: str) -> str:
        """生成备用描述（当 OpenAI API 不可用时）"""
        property_type = property_data.property_type or "房屋"
        address = property_data.address
        city = property_data.city or "城市"
        area_sqm = property_data.area_sqm
        rooms = property_data.rooms
        year_built = property_data.year_built
        
        if style == "marketing":
            return f"🏠 绝佳投资机会！位于{address}的精品{property_type}，地理位置优越，交通便利。{f'建筑面积{area_sqm}平方米，' if area_sqm else ''}{f'共{rooms}个房间，' if rooms else ''}{f'建于{year_built}年，' if year_built else ''}周边配套设施完善，升值潜力巨大！"
        elif style == "family":
            return f"温馨的{property_type}，位于{address}，为您的家庭提供完美的居住环境。{f'建筑面积{area_sqm}平方米，' if area_sqm else ''}{f'共{rooms}个房间，' if rooms else ''}{f'建于{year_built}年，' if year_built else ''}周边环境优美，适合家庭生活。"
        else:  # formal
            return f"这座位于{address}的{property_type}展现了卓越的建筑品质和精心设计。{f'建筑面积约{area_sqm}平方米，' if area_sqm else ''}{f'共{rooms}个房间，' if rooms else ''}{f'建于{year_built}年，' if year_built else ''}地理位置优越，位于{city}的核心区域，周边配套设施完善。"
    
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
