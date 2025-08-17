"""
Authentication schemas
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class UserBase(BaseModel):
    """Base user model"""
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=100)
    full_name: Optional[str] = Field(None, max_length=200)
    is_agent: bool = False


class UserCreate(UserBase):
    """User creation model"""
    password: str = Field(..., min_length=8, max_length=100)


class UserLogin(BaseModel):
    """User login model"""
    username: str
    password: str


class TokenResponse(BaseModel):
    """Token response model"""
    access_token: str
    token_type: str = "bearer"


class UserResponse(UserBase):
    """User response model"""
    id: int
    is_active: bool
    
    class Config:
        from_attributes = True
