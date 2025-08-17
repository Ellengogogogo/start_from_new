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

from app.routes import properties, images, cache, expose_generation
# from app.core.config import settings
# from app.core.database import engine, Base


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    print("🚀 Starting Property Expose Generator Backend...")
    
    # 暂时注释掉数据库初始化，用于开发测试
    # # Create database tables
    # async with engine.begin() as conn:
    #     await conn.run_sync(Base.metadata.create_all)
    
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
# 主要业务路由
app.include_router(properties.router, prefix="/api/properties", tags=["Properties"])
app.include_router(images.router, prefix="/api/images", tags=["Images"])

# 缓存和expose生成路由（使用 /api 前缀以匹配前端调用）
app.include_router(cache.router, prefix="/api/cache", tags=["Cache"])
app.include_router(expose_generation.router, prefix="/api/expose", tags=["Expose Generation"])


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Property Expose Generator API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }


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
