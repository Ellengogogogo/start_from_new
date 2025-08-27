"""
Application configuration settings
"""

from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    """Application settings"""
    
    # Application
    APP_NAME: str = "Property Expose Generator"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001"
    ]
    
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://user:password@localhost:5432/property_expose"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # JWT
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # OpenAI
    OPENAI_API_KEY: str = "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"
    OPENAI_MODEL: str = "gpt-4nano"
    
    # File Upload
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    UPLOAD_DIR: str = "static/uploads"
    ALLOWED_IMAGE_TYPES: List[str] = ["image/jpeg", "image/png", "image/webp"]
    
    # AI Image Processing
    IMAGE_QUALITY: int = 85
    MAX_IMAGE_DIMENSION: int = 1920
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Create settings instance
settings = Settings()
