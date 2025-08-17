"""
Expose service for generating property exposes
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
import openai
from app.core.config import settings

from app.core.database import Expose, Property
from app.schemas.expose import ExposeCreate


class ExposeService:
    """Expose generation business logic service"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
        if settings.OPENAI_API_KEY:
            openai.api_key = settings.OPENAI_API_KEY
    
    async def generate_expose(self, expose_data: ExposeCreate) -> Expose:
        """Generate a new expose for a property"""
        # Get property details
        property_obj = await self._get_property(expose_data.property_id)
        if not property_obj:
            raise ValueError("Property not found")
        
        # Generate AI description if content is not provided
        if not expose_data.content:
            content = await self._generate_ai_description(property_obj)
        else:
            content = expose_data.content
        
        # Create expose object
        expose_obj = Expose(
            property_id=expose_data.property_id,
            title=expose_data.title or f"Expose for {property_obj.title}",
            content=content,
            template_used=expose_data.template_used or "default"
        )
        
        self.db.add(expose_obj)
        await self.db.commit()
        await self.db.refresh(expose_obj)
        
        return expose_obj
    
    async def get_expose(self, expose_id: int) -> Optional[Expose]:
        """Get a specific expose by ID"""
        query = select(Expose).where(Expose.id == expose_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()
    
    async def get_property_exposes(self, property_id: int) -> List[Expose]:
        """Get all exposes for a property"""
        query = select(Expose).where(Expose.property_id == property_id)
        result = await self.db.execute(query)
        return result.scalars().all()
    
    async def _get_property(self, property_id: int) -> Optional[Property]:
        """Get property by ID"""
        query = select(Property).where(Property.id == property_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()
    
    async def _generate_ai_description(self, property_obj: Property) -> str:
        """Generate AI-powered property description"""
        if not settings.OPENAI_API_KEY:
            # Fallback to template-based description
            return self._generate_template_description(property_obj)
        
        try:
            # Prepare property information for AI
            property_info = f"""
            Property: {property_obj.title}
            Type: {property_obj.property_type}
            Status: {property_obj.status}
            Location: {property_obj.address}, {property_obj.city}, {property_obj.country}
            Price: {property_obj.price} ({property_obj.price_type})
            Area: {property_obj.area_sqm} sqm
            Rooms: {property_obj.rooms}
            Bedrooms: {property_obj.bedrooms}
            Bathrooms: {property_obj.bathrooms}
            Floors: {property_obj.floors}
            Year Built: {property_obj.year_built}
            Energy Class: {property_obj.energy_class}
            Features: {property_obj.features or 'Standard features'}
            """
            
            # Generate AI description
            response = openai.ChatCompletion.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a professional real estate agent. Write an engaging, professional property description in German that highlights the key features and benefits of the property. Make it appealing to potential buyers or renters."
                    },
                    {
                        "role": "user",
                        "content": f"Generate a professional property description for this property:\n{property_info}"
                    }
                ],
                max_tokens=500,
                temperature=0.7
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            print(f"AI generation failed: {e}")
            # Fallback to template-based description
            return self._generate_template_description(property_obj)
    
    def _generate_template_description(self, property_obj: Property) -> str:
        """Generate template-based property description"""
        description = f"""
        {property_obj.title}
        
        Willkommen zu diesem wunderschönen {property_obj.property_type} in {property_obj.city}!
        
        Diese Immobilie bietet Ihnen:
        • {property_obj.rooms} Zimmer, davon {property_obj.bedrooms} Schlafzimmer
        • {property_obj.bathrooms} Badezimmer
        • Wohnfläche: {property_obj.area_sqm} m²
        • Baujahr: {property_obj.year_built}
        • Energieeffizienzklasse: {property_obj.energy_class}
        
        Lage: {property_obj.address}, {property_obj.city}
        
        Preis: {property_obj.price} € ({property_obj.price_type})
        
        Kontaktieren Sie uns für weitere Informationen und eine Besichtigung!
        """
        
        return description.strip()
    
    async def publish_expose(self, expose_id: int) -> bool:
        """Publish an expose"""
        expose_obj = await self.get_expose(expose_id)
        if not expose_obj:
            return False
        
        expose_obj.is_published = True
        await self.db.commit()
        return True
    
    async def unpublish_expose(self, expose_id: int) -> bool:
        """Unpublish an expose"""
        expose_obj = await self.get_expose(expose_id)
        if not expose_obj:
            return False
        
        expose_obj.is_published = False
        await self.db.commit()
        return True
