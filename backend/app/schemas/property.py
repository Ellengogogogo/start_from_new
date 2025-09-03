"""
Property data models and schemas
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class AgentInfo(BaseModel):
    companyLogo: Optional[str] = None
    responsiblePerson: str = Field(..., max_length=100)
    address: str = Field(..., max_length=200)
    website: Optional[str] = Field(None, max_length=255)
    phone: str = Field(..., max_length=20)
    userType: str = "agent"

class PropertyBase(BaseModel):
    """Base property model"""
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    suggested_description: Optional[str] = None  # AI generated description
    property_type: str = Field(..., pattern="^(house|apartment|villa|penthouse|duplex|studio)$")
    status: str = Field(default="for_sale", pattern="^(for_sale|for_rent|sold|rented)$")
    
    # Location
    address: str = Field(..., min_length=1, max_length=500)
    city: str = Field(..., min_length=1, max_length=100)
    plz: Optional[str] = Field(None, max_length=20)
    country: str = Field(default="Germany", max_length=100)
    
    # Property details
    price: Optional[float] = Field(None, ge=0)
    price_type: str = Field(default="total", pattern="^(total|per_sqm)$")
    area_sqm: Optional[float] = Field(None, ge=0)
    rooms: Optional[int] = Field(None, ge=0)
    bedrooms: Optional[int] = Field(None, ge=0)
    bathrooms: Optional[int] = Field(None, ge=0)
    floors: Optional[int] = Field(None, ge=0)
    year_built: Optional[int] = Field(None, ge=1800, le=2030)
    
    # Additional property details
    heating_system: Optional[str] = Field(None, max_length=100)
    energy_source: Optional[str] = Field(None, max_length=100)
    energy_certificate: Optional[str] = Field(None, max_length=10)
    energieverbrauch: Optional[float] = Field(None, ge=0)
    energieausweis_typ: Optional[str] = Field(None, max_length=100)
    energieausweis_gueltig_bis: Optional[str] = Field(None, max_length=100)
    parking: Optional[str] = Field(None, max_length=100)
    renovation_quality: Optional[str] = Field(None, max_length=100)
    floor_type: Optional[str] = Field(None, max_length=100)
    
    # Additional fields for German prompts
    condition: Optional[str] = Field(None, max_length=100)  # e.g., "frisch renoviert", "gepflegt"
    equipment: Optional[str] = Field(None, max_length=500)  # e.g., "Einbauküche", "Balkon", "Terrasse"
    grundstuecksgroesse: Optional[float] = Field(None, ge=0)  # Land area in m²
    floor: Optional[int] = Field(None, ge=0)  # Floor number
    
    # Features
    features: Optional[str] = None  # JSON string
    energy_class: Optional[str] = Field(None, pattern="^[A-G]$")
    
    # Contact info
    contact_person: Optional[str] = Field(None, max_length=100)
    contact_phone: Optional[str] = Field(None, max_length=50)
    contact_email: Optional[str] = Field(None, max_length=255)
    contact_person2: Optional[str] = Field(None, max_length=100)
    contact_phone2: Optional[str] = Field(None, max_length=50)
    contact_email2: Optional[str] = Field(None, max_length=255)

    # Agent information (optional)
    agentInfo: Optional[AgentInfo] = None


class PropertyCreate(PropertyBase):
    """Property creation model"""
    pass


class PropertyUpdate(BaseModel):
    """Property update model"""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    suggested_description: Optional[str] = None
    property_type: Optional[str] = Field(None, pattern="^(house|apartment|villa|penthouse|duplex|studio)$")
    status: Optional[str] = Field(None, pattern="^(for_sale|for_rent|sold|rented)$")
    
    # Location
    address: Optional[str] = Field(None, min_length=1, max_length=500)
    city: Optional[str] = Field(None, min_length=1, max_length=100)
    plz: Optional[str] = Field(None, max_length=20)
    country: Optional[str] = Field(None, max_length=100)
    
    # Property details
    price: Optional[float] = Field(None, ge=0)
    price_type: Optional[str] = Field(None, pattern="^(total|per_sqm)$")
    area_sqm: Optional[float] = Field(None, ge=0)
    rooms: Optional[int] = Field(None, ge=0)
    bedrooms: Optional[int] = Field(None, ge=0)
    bathrooms: Optional[int] = Field(None, ge=0)
    floors: Optional[int] = Field(None, ge=0)
    year_built: Optional[int] = Field(None, ge=1800, le=2030)
    
    # Additional property details
    heating_system: Optional[str] = Field(None, max_length=100)
    energy_source: Optional[str] = Field(None, max_length=100)
    energy_certificate: Optional[str] = Field(None, max_length=10)
    energieverbrauch: Optional[float] = Field(None, ge=0)
    energieausweis_typ: Optional[str] = Field(None, max_length=100)
    energieausweis_gueltig_bis: Optional[str] = Field(None, max_length=100)
    parking: Optional[str] = Field(None, max_length=100)
    renovation_quality: Optional[str] = Field(None, max_length=100)
    floor_type: Optional[str] = Field(None, max_length=100)
    
    # Additional fields for German prompts
    condition: Optional[str] = Field(None, max_length=100)  # e.g., "frisch renoviert", "gepflegt"
    equipment: Optional[str] = Field(None, max_length=500)  # e.g., "Einbauküche", "Balkon", "Terrasse"
    grundstuecksflaeche: Optional[float] = Field(None, ge=0)  # Land area in m²
    floor: Optional[int] = Field(None, ge=0)  # Floor number
    
    # Features
    features: Optional[str] = Field(None, max_length=500)
    energy_class: Optional[str] = Field(None, pattern="^[A-G]$")
    
    # Contact info
    contact_person: Optional[str] = Field(None, max_length=100)
    contact_phone: Optional[str] = Field(None, max_length=50)
    contact_email: Optional[str] = Field(None, max_length=255)
    contact_person2: Optional[str] = Field(None, max_length=100)
    contact_phone2: Optional[str] = Field(None, max_length=50)
    contact_email2: Optional[str] = Field(None, max_length=255)


class PropertyResponse(PropertyBase):
    """Property response model"""
    id: int
    owner_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class LocationDescriptionRequest(BaseModel):
    """Minimal schema for location description generation"""
    city: str = Field(..., min_length=1, max_length=100)
    address: str = Field(..., min_length=1, max_length=500)
