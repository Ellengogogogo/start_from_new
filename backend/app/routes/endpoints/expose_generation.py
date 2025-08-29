"""
Expose generation routes for creating professional property presentations
"""

from fastapi import APIRouter, HTTPException, status, BackgroundTasks
from typing import Dict, Any
import uuid
from datetime import datetime
import asyncio
import os

# 临时存储（在实际生产环境中应该使用Redis或数据库）
expose_status = {}
expose_preview_data = {}

# 导入缓存数据（临时方案，实际应该通过数据库或Redis）
from .cache import property_cache, image_cache

router = APIRouter()


@router.post("/generate/{property_id}", status_code=status.HTTP_201_CREATED)
async def generate_expose(
    property_id: str,
    background_tasks: BackgroundTasks
):
    """Generate professional property expose"""
    try:
        # 清除之前的expose状态（保留当前房源数据）
        await clear_previous_expose_data()
        print(f"Cleared previous expose data for new generation")
        
        # 生成expose ID
        expose_id = str(uuid.uuid4())
        
        # 初始化状态
        expose_status[expose_id] = {
            "id": expose_id,
            "propertyId": property_id,
            "status": "pending",
            "progress": 0,
            "createdAt": datetime.now().isoformat(),
            "completedAt": None,
            "pdfUrl": None
        }
        
        # 在后台任务中模拟expose生成过程
        background_tasks.add_task(
            simulate_expose_generation,
            expose_id,
            property_id
        )
        
        return {
            "exposeId": expose_id,
            "status": "pending",
            "message": "Expose generation started"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to start expose generation: {str(e)}"
        )


@router.get("/status/{expose_id}")
async def get_expose_status(expose_id: str):
    """Get expose generation status"""
    try:
        if expose_id not in expose_status:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Expose not found"
            )
        
        return expose_status[expose_id]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get expose status: {str(e)}"
        )


@router.get("/preview/{expose_id}")
async def get_expose_preview(expose_id: str):
    """Get expose preview data"""
    try:
        if expose_id not in expose_preview_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Expose preview not found"
            )
        
        return expose_preview_data[expose_id]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get expose preview: {str(e)}"
        )


@router.delete("/{expose_id}")
async def delete_expose(expose_id: str):
    """Delete expose and its data"""
    try:
        # 删除状态
        if expose_id in expose_status:
            del expose_status[expose_id]
        
        # 删除预览数据
        if expose_id in expose_preview_data:
            del expose_preview_data[expose_id]
        
        return {"message": "Expose deleted successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete expose: {str(e)}"
        )


async def clear_previous_expose_data():
    """Clear previous expose data but keep current property data"""
    try:
        # 只清除之前的expose状态和预览数据，保留房源数据
        expose_status.clear()
        expose_preview_data.clear()
        
        # 不要删除图片文件，因为它们是房源数据的一部分
        # 图片文件应该由专门的清理任务或过期机制来管理
        print("Previous expose data cleared successfully (images preserved)")
    except Exception as e:
        print(f"Error clearing previous expose data: {e}")


async def simulate_expose_generation(expose_id: str, property_id: str):
    """Simulate the expose generation process"""
    try:
        # 确保expose_status中存在这个expose_id的记录
        if expose_id not in expose_status:
            print(f"Warning: expose_id {expose_id} not found in expose_status, creating new entry")
            expose_status[expose_id] = {
                "id": expose_id,
                "propertyId": property_id,
                "status": "pending",
                "progress": 0,
                "createdAt": datetime.now().isoformat(),
                "completedAt": None,
                "pdfUrl": None
            }
        
        # 更新状态为处理中
        expose_status[expose_id]["status"] = "processing"
        expose_status[expose_id]["progress"] = 10
        
        # 模拟处理步骤
        steps = [
            ("分析房源数据", 20),
            ("优化图片质量", 40),
            ("生成描述文本", 60),
            ("应用专业模板", 80),
            ("生成最终文档", 100)
        ]
        
        for step_name, progress in steps:
            # 模拟处理时间
            await asyncio.sleep(2)
            
            # 更新进度
            expose_status[expose_id]["progress"] = progress
            print(f"Expose {expose_id}: {step_name} - {progress}%")
        
        # 完成
        expose_status[expose_id]["status"] = "completed"
        expose_status[expose_id]["progress"] = 100
        expose_status[expose_id]["completedAt"] = datetime.now().isoformat()
        expose_status[expose_id]["pdfUrl"] = f"/api/expose/download/{expose_id}"
        
        # 从缓存中获取真实的房源数据和图片
        property_data = property_cache.get(property_id, {})
        cached_images = image_cache.get(property_id, [])
        regular_images = [img for img in cached_images]
        
        # 生成预览数据（使用真实数据）
        expose_preview_data[expose_id] = {
            "title": property_data.get("title", f"Professionelle Exposé - {property_id[:8]}"),
            "address": property_data.get("address", "Adressinformationen"),
            "price": property_data.get("price", 0),
            "rooms": property_data.get("rooms", 0),
            "bedrooms": property_data.get("bedrooms", 0),
            "bathrooms": property_data.get("bathrooms", 0),
            "area": property_data.get("area", 0),
            "yearBuilt": property_data.get("yearBuilt", 0),
            "heating_system": property_data.get("heating_system", ""),
            "energy_source": property_data.get("energy_source", ""),
            "energy_certificate": property_data.get("energy_certificate", ""),
            "parking": property_data.get("parking", ""),
            "renovation_quality": property_data.get("renovation_quality", ""),
            "floor_type": property_data.get("floor_type", ""),
            "description": property_data.get("description", "Dies ist eine professionelle Exposé in einer erstklassigen Lage mit ausgezeichneter Verkehrsanbindung, vollständigen Einrichtungen und ist eine ideale Wohnwahl."),
            "locationDescription": property_data.get("locationDescription", ""),  # Neu: Geografische Lagebeschreibung
            "contact_person": property_data.get("contact_person", "Kontaktperson"),
            "contact_phone": property_data.get("contact_phone", "Telefonnummer"),
            "contact_email": property_data.get("contact_email", "E-Mail-Adresse"),
            "contact_person2": property_data.get("contact_person2", ""),
            "contact_phone2": property_data.get("contact_phone2", ""),
            "contact_email2": property_data.get("contact_email2", ""),
            "agentInfo": property_data.get("agentInfo", None),  # 添加代理信息
            "images": [
                {
                    "id": image.get("id", f"img_{i}"),
                    "url": image.get("url", ""),
                    "category": image.get("category", "wohnzimmer"),
                    "createdAt": image.get("createdAt", "")
                }
                for i, image in enumerate(regular_images)
            ] if regular_images else [],
            "floorPlanDetails": [
                f"{property_data.get('bedrooms', 0)} Schlafzimmer, Hauptschlafzimmer mit eigenem Bad",
                f"{property_data.get('bathrooms', 0)} Badezimmer, Trocken- und Nassbereich getrennt",
                "Offene Küche, Essbereich integriert",
                "Wohnzimmer geräumig, viel Tageslicht",
                "Balkon verbindet Wohnzimmer und Hauptschlafzimmer",
                "Abstellraum und Kleiderschrank vorhanden"
            ]
        }
        
        print(f"Expose {expose_id} generation completed successfully")
        print(f"Preview data: {expose_preview_data[expose_id]}")
        
    except Exception as e:
        print(f"Error generating expose {expose_id}: {str(e)}")
        # 确保expose_status存在再更新状态
        if expose_id in expose_status:
            expose_status[expose_id]["status"] = "failed"
            expose_status[expose_id]["progress"] = 0
        else:
            print(f"Could not update status for {expose_id} - not found in expose_status")


async def cleanup_expired_images(property_id: str = None):
    """Clean up expired images from cache directory"""
    try:
        cache_dir = "static/cache"
        if not os.path.exists(cache_dir):
            return
        
        # 如果指定了property_id，只清理该房源的图片
        if property_id:
            # 获取该房源的所有图片文件名
            cached_images = image_cache.get(property_id, [])
            cached_filenames = {img.get("filename") for img in cached_images}
            
            # 删除该房源的过期图片文件
            for filename in os.listdir(cache_dir):
                if filename.startswith(f"{property_id}_"):
                    if filename not in cached_filenames:
                        file_path = os.path.join(cache_dir, filename)
                        try:
                            if os.path.isfile(file_path):
                                os.remove(file_path)
                                print(f"Deleted expired image: {filename}")
                        except Exception as e:
                            print(f"Error deleting expired image {filename}: {e}")
        else:
            # 清理所有不在缓存中的图片文件
            all_cached_filenames = set()
            for prop_id, images in image_cache.items():
                for img in images:
                    all_cached_filenames.add(img.get("filename"))
            
            for filename in os.listdir(cache_dir):
                if filename not in all_cached_filenames:
                    file_path = os.path.join(cache_dir, filename)
                    try:
                        if os.path.isfile(file_path):
                            os.remove(file_path)
                            print(f"Deleted orphaned image: {filename}")
                    except Exception as e:
                        print(f"Error deleting orphaned image {filename}: {e}")
        
        print("Image cleanup completed successfully")
    except Exception as e:
        print(f"Error during image cleanup: {e}")


# 添加一个定期清理任务（可选）
async def schedule_image_cleanup():
    """Schedule periodic image cleanup (can be called by a background task)"""
    try:
        # 清理超过24小时的过期图片
        await cleanup_expired_images()
    except Exception as e:
        print(f"Error in scheduled image cleanup: {e}")
