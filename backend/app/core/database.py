"""
Database configuration and models
"""

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, Float, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.config import settings

# Create async engine
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_pre_ping=True,
    pool_recycle=300
)

# Create async session factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Create base class for models
Base = declarative_base()


# Database models
class User(Base):
    """User model"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(200))
    is_active = Column(Boolean, default=True)
    is_agent = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    properties = relationship("Property", back_populates="owner")


class Property(Base):
    """Property model"""
    __tablename__ = "properties"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    property_type = Column(String(50), nullable=False)  # house, apartment, etc.
    status = Column(String(20), default="for_sale")  # for_sale, for_rent, sold
    
    # Location
    address = Column(String(500), nullable=False)
    city = Column(String(100), nullable=False)
    plz = Column(String(20))
    country = Column(String(100), default="Germany")
    
    # Property details
    price = Column(Float)
    price_type = Column(String(20), default="total")  # total, per_sqm
    area_sqm = Column(Float)
    rooms = Column(Integer)
    bedrooms = Column(Integer)
    bathrooms = Column(Integer)
    floors = Column(Integer)
    year_built = Column(Integer)
    
    # Features
    features = Column(Text)  # JSON string of features
    energy_class = Column(String(10))
    
    # Owner info
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    contact_phone = Column(String(50))
    contact_email = Column(String(255))
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    owner = relationship("User", back_populates="properties")
    images = relationship("PropertyImage", back_populates="property")
    exposes = relationship("Expose", back_populates="property")


class PropertyImage(Base):
    """Property image model"""
    __tablename__ = "property_images"
    
    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=False)
    filename = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size = Column(Integer)
    mime_type = Column(String(100))
    width = Column(Integer)
    height = Column(Integer)
    is_primary = Column(Boolean, default=False)
    is_optimized = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    property = relationship("Property", back_populates="images")


class Expose(Base):
    """Generated expose model"""
    __tablename__ = "exposes"
    
    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=False)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    template_used = Column(String(100))
    generated_at = Column(DateTime(timezone=True), server_default=func.now())
    is_published = Column(Boolean, default=False)
    
    # Relationships
    property = relationship("Property", back_populates="exposes")


# Dependency to get database session
async def get_db() -> AsyncSession:
    """Get database session"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
