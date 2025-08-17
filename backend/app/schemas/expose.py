"""
Expose schemas
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ExposeBase(BaseModel):
    """Base expose model"""
    title: str = Field(..., min_length=1, max_length=200)
    content: str
    template_used: Optional[str] = None
    is_published: bool = False


class ExposeCreate(ExposeBase):
    """Expose creation model"""
    property_id: int


class ExposeResponse(ExposeBase):
    """Expose response model"""
    id: int
    property_id: int
    generated_at: datetime
    
    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
