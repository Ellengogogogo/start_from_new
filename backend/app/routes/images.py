"""
Image management routes
"""

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.core.database import get_db
from app.schemas.image import ImageResponse
from app.services.image_service import ImageService

router = APIRouter()


@router.post("/upload/{property_id}", response_model=ImageResponse, status_code=status.HTTP_201_CREATED)
async def upload_image(
    property_id: int,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    """Upload an image for a property"""
    try:
        image_service = ImageService(db)
        image_obj = await image_service.upload_image(property_id, file)
        return ImageResponse.from_orm(image_obj)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/{property_id}", response_model=List[ImageResponse])
async def get_property_images(
    property_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get all images for a property"""
    try:
        image_service = ImageService(db)
        images = await image_service.get_property_images(property_id)
        return [ImageResponse.from_orm(img) for img in images]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.delete("/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_image(
    image_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Delete an image"""
    try:
        image_service = ImageService(db)
        success = await image_service.delete_image(image_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Image not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
