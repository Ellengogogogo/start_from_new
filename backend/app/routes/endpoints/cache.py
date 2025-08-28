"""
Cache management routes for temporary property data and images
"""

from fastapi import APIRouter, HTTPException, status, UploadFile, File, Form
from typing import List
import uuid
import json
import os
from datetime import datetime

# 临时存储（在实际生产环境中应该使用Redis）
property_cache = {}
image_cache = {}

router = APIRouter()


@router.post("/property-data", status_code=status.HTTP_201_CREATED)
async def cache_property_data(property_data: dict):
    """Cache property data temporarily"""
    try:
        # 生成唯一ID
        property_id = str(uuid.uuid4())
        
        # 存储到缓存
        property_cache[property_id] = {
            **property_data,
            "id": property_id,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }
        
        return {"id": property_id, "message": "Property data cached successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to cache property data: {str(e)}"
        )


@router.get("/property-data/{property_id}")
async def get_cached_property_data(property_id: str):
    """Get cached property data"""
    try:
        if property_id not in property_cache:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Property data not found in cache"
            )
        
        return property_cache[property_id]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve cached property data: {str(e)}"
        )


@router.post("/property-images/{property_id}", status_code=status.HTTP_201_CREATED)
async def cache_property_images(
    property_id: str,
    images: List[UploadFile] = File(...),
    image_categories: List[str] = Form(None)  # 使用Form()包装可选参数，用于标识图片类别（如客厅、厨房、平面图等）
):
    """Cache property images temporarily"""
    try:
        if property_id not in property_cache:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Property data not found in cache"
            )
        
        # 初始化图片缓存
        if property_id not in image_cache:
            image_cache[property_id] = []
        
        # 确保缓存目录存在
        cache_dir = "static/cache"
        os.makedirs(cache_dir, exist_ok=True)
        
        # 处理上传的图片
        uploaded_images = []
        for i, image in enumerate(images):
            # 生成文件名
            file_extension = image.filename.split('.')[-1] if image.filename else 'jpg'
            # 根据分类确定前缀
            filename = f"{property_id}_image_{i}_{uuid.uuid4().hex[:8]}.{file_extension}"
            
            # 保存图片到文件系统
            file_path = os.path.join(cache_dir, filename)
            try:
                # 读取上传的文件内容
                content = await image.read()
                
                # 写入到文件系统
                with open(file_path, "wb") as f:
                    f.write(content)
                
                print(f"Saved image: {file_path}")
                
            except Exception as e:
                print(f"Error saving image {filename}: {str(e)}")
                continue
            
            # 生成图片URL（相对于静态文件根目录）
            image_url = f"/static/cache/{filename}"
            
            # 获取分类（如果存在）
            category = None
            if image_categories and i < len(image_categories):
                category = image_categories[i]

            print(f"Processing image {i}: category={category}")  # 添加调试日志
            
            image_data = {
                "id": str(uuid.uuid4()),
                "propertyId": property_id,
                "filename": filename,
                "url": image_url,
                "category": category,  # 图片分类
                "createdAt": datetime.now().isoformat()
            }
            
            image_cache[property_id].append(image_data)
            uploaded_images.append(image_data)
        
        return {
            "images": uploaded_images,
            "message": f"Successfully cached {len(uploaded_images)} images"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to cache property images: {str(e)}"
        )


@router.get("/property-images/{property_id}")
async def get_cached_property_images(property_id: str):
    """Get cached property images"""
    try:
        if property_id not in image_cache:
            return {"images": []}
        
        return {"images": image_cache[property_id]}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve cached images: {str(e)}"
        )
