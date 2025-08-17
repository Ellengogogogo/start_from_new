"""
Image service for image management
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from fastapi import UploadFile
import os
import uuid
from typing import List, Optional
from PIL import Image
import io

from app.core.database import PropertyImage
from app.core.config import settings


class ImageService:
    """Image business logic service"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def upload_image(self, property_id: int, file: UploadFile) -> PropertyImage:
        """Upload and process an image for a property"""
        # Validate file type
        if file.content_type not in settings.ALLOWED_IMAGE_TYPES:
            raise ValueError(f"File type {file.content_type} not allowed")
        
        # Generate unique filename
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        
        # Create upload directory if it doesn't exist
        os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
        
        # Save file
        file_path = os.path.join(settings.UPLOAD_DIR, unique_filename)
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Get image dimensions
        try:
            with Image.open(file_path) as img:
                width, height = img.size
        except Exception:
            width, height = None, None
        
        # Create image record
        image_obj = PropertyImage(
            property_id=property_id,
            filename=unique_filename,
            original_filename=file.filename,
            file_path=file_path,
            file_size=len(content),
            mime_type=file.content_type,
            width=width,
            height=height
        )
        
        self.db.add(image_obj)
        await self.db.commit()
        await self.db.refresh(image_obj)
        
        return image_obj
    
    async def get_property_images(self, property_id: int) -> List[PropertyImage]:
        """Get all images for a property"""
        query = select(PropertyImage).where(PropertyImage.property_id == property_id)
        result = await self.db.execute(query)
        return result.scalars().all()
    
    async def delete_image(self, image_id: int) -> bool:
        """Delete an image"""
        # Get image record
        query = select(PropertyImage).where(PropertyImage.id == image_id)
        result = await self.db.execute(query)
        image_obj = result.scalar_one_or_none()
        
        if not image_obj:
            return False
        
        # Delete file from disk
        try:
            if os.path.exists(image_obj.file_path):
                os.remove(image_obj.file_path)
        except Exception as e:
            print(f"Error deleting file: {e}")
        
        # Delete database record
        delete_query = delete(PropertyImage).where(PropertyImage.id == image_id)
        await self.db.execute(delete_query)
        await self.db.commit()
        
        return True
    
    async def optimize_image(self, image_id: int) -> bool:
        """Optimize an image using AI"""
        # Get image record
        query = select(PropertyImage).where(PropertyImage.id == image_id)
        result = await self.db.execute(query)
        image_obj = result.scalar_one_or_none()
        
        if not image_obj:
            return False
        
        try:
            # Open image
            with Image.open(image_obj.file_path) as img:
                # Convert to RGB if necessary
                if img.mode in ('RGBA', 'LA', 'P'):
                    img = img.convert('RGB')
                
                # Resize if too large
                if img.width > settings.MAX_IMAGE_DIMENSION or img.height > settings.MAX_IMAGE_DIMENSION:
                    img.thumbnail((settings.MAX_IMAGE_DIMENSION, settings.MAX_IMAGE_DIMENSION), Image.Resampling.LANCZOS)
                
                # Save optimized image
                optimized_path = image_obj.file_path.replace('.', '_optimized.')
                img.save(optimized_path, 'JPEG', quality=settings.IMAGE_QUALITY, optimize=True)
                
                # Update record
                image_obj.is_optimized = True
                await self.db.commit()
                
                return True
                
        except Exception as e:
            print(f"Error optimizing image: {e}")
            return False
    
    async def set_primary_image(self, property_id: int, image_id: int) -> bool:
        """Set an image as primary for a property"""
        # Reset all images to non-primary
        await self.db.execute(
            "UPDATE property_images SET is_primary = false WHERE property_id = :property_id",
            {"property_id": property_id}
        )
        
        # Set specified image as primary
        await self.db.execute(
            "UPDATE property_images SET is_primary = true WHERE id = :image_id",
            {"image_id": image_id}
        )
        
        await self.db.commit()
        return True
