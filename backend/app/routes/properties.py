"""
Property management routes
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import json

from app.core.database import get_db, Property, PropertyImage
from app.schemas.property import PropertyCreate, PropertyUpdate, PropertyResponse
from app.services.property_service import PropertyService

router = APIRouter()


@router.post("/", response_model=PropertyResponse, status_code=status.HTTP_201_CREATED)
async def create_property(
    property_data: PropertyCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new property"""
    try:
        property_service = PropertyService(db)
        property_obj = await property_service.create_property(property_data)
        return PropertyResponse.from_orm(property_obj)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/", response_model=List[PropertyResponse])
async def get_properties(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    """Get all properties with pagination"""
    try:
        property_service = PropertyService(db)
        properties = await property_service.get_properties(skip=skip, limit=limit)
        return [PropertyResponse.from_orm(p) for p in properties]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/{property_id}", response_model=PropertyResponse)
async def get_property(
    property_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific property by ID"""
    try:
        property_service = PropertyService(db)
        property_obj = await property_service.get_property(property_id)
        if not property_obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Property not found"
            )
        return PropertyResponse.from_orm(property_obj)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.put("/{property_id}", response_model=PropertyResponse)
async def update_property(
    property_id: int,
    property_data: PropertyUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update a property"""
    try:
        property_service = PropertyService(db)
        property_obj = await property_service.update_property(property_id, property_data)
        if not property_obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Property not found"
            )
        return PropertyResponse.from_orm(property_obj)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.delete("/{property_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_property(
    property_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Delete a property"""
    try:
        property_service = PropertyService(db)
        success = await property_service.delete_property(property_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Property not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/generate-description", status_code=status.HTTP_200_OK)
async def generate_property_description(
    property_data: PropertyCreate,
    style: str = "formal",
    db: AsyncSession = Depends(get_db)
):
    """Generate AI description for a property"""
    try:
        # Validate style parameter
        valid_styles = ["formal", "marketing", "family"]
        if style not in valid_styles:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid style. Must be one of: {', '.join(valid_styles)}"
            )
        
        property_service = PropertyService(db)
        description = await property_service.generate_ai_description(property_data, style)
        
        return {
            "suggested_description": description,
            "style": style,
            "message": "Description generated successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
