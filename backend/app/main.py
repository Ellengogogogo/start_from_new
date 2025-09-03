"""
Property Expose Generator Backend API
Main application entry point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
import os
from contextlib import asynccontextmanager

from app.routes.routers import router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    print("🚀 Starting Property Expose Generator Backend...")
    
    print("✅ Backend started successfully (database disabled for testing)")
    yield
    
    # Shutdown
    print("🛑 Shutting down Property Expose Generator Backend...")


# Create FastAPI app instance
app = FastAPI(
    title="Property Expose Generator API",
    description="Professional property expose generation API with AI-powered features",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Configure CORS - 使用硬编码的允许源
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # 前端地址
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for uploaded images - 使用绝对路径
static_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")
print(f"Static files directory: {static_dir}")
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Include API routers
# 使用新的路由结构
app.include_router(router)

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "property-expose-backend"}


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
