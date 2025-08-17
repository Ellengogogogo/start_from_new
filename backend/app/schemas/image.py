"""
Image schemas
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ImageBase(BaseModel):
    """Base image model"""
    filename: str
    original_filename: str
    file_path: str
    file_size: Optional[int] = None
    mime_type: Optional[str] = None
    width: Optional[int] = None
    height: Optional[int] = None
    is_primary: bool = False
    is_optimized: bool = False


class ImageCreate(ImageBase):
    """Image creation model"""
    property_id: int


class ImageResponse(ImageBase):
    """Image response model"""
    id: int
    property_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
