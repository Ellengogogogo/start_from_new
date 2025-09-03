from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from .endpoints import (
    auth,
    cache,
    expose_generation,
    properties,
    images
)

# Create the main router without prefix for root routes
router = APIRouter()

# Create a sub-router for /api/v1 endpoints
api_router = APIRouter(prefix="/app/endpoints")

@router.get("/")
async def root(request: Request):   
    """Root endpoint that returns API information"""
    return JSONResponse({
        "message": "Property Expose Generator API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
        "api_base": "/app/endpoints"
    })

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(cache.router, prefix="/cache", tags=["cache"])
api_router.include_router(expose_generation.router, prefix="/expose_generation", tags=["expose_generation"])
api_router.include_router(properties.router, prefix="/properties", tags=["properties"])
api_router.include_router(images.router, prefix="/images", tags=["images"])

# Include the API router in the main router
router.include_router(api_router) 