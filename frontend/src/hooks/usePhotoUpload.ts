import { useState, useCallback, useEffect, useRef } from 'react';
import { Photos } from '@/types/property';

export type PhotoCategory = keyof Photos;

export interface PhotoFile extends File {
  category: PhotoCategory;
  displayName: string;
}

export interface UsePhotoUploadOptions {
  maxPhotosPerCategory?: number;
  onPhotoChange?: (photos: Photos) => void;
}

export function usePhotoUpload({ 
  maxPhotosPerCategory = 10, 
  onPhotoChange 
}: UsePhotoUploadOptions = {}) {
  // 照片状态
  const [photos, setPhotos] = useState<Photos>({
    wohnzimmer: [],
    kueche: [],
    zimmer: [],
    bad: [],
    balkon: [],
    grundriss: []
  });

  // 照片URL状态
  const [photoUrls, setPhotoUrls] = useState<Record<PhotoCategory, string[]>>({
    wohnzimmer: [],
    kueche: [],
    zimmer: [],
    bad: [],
    balkon: [],
    grundriss: []
  });

  // 拖拽状态
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragOverTab, setDragOverTab] = useState<PhotoCategory>('wohnzimmer');

  // 使用 ref 来存储最新的 onPhotoChange 回调，避免无限循环
  const onPhotoChangeRef = useRef(onPhotoChange);
  onPhotoChangeRef.current = onPhotoChange;

  // 当照片变化时调用回调 - 使用 ref 避免依赖循环
  useEffect(() => {
    if (onPhotoChangeRef.current) {
      onPhotoChangeRef.current(photos);
    }
  }, [photos]); // 移除 onPhotoChange 依赖

  // 清理函数：组件卸载时释放所有URL
  useEffect(() => {
    return () => {
      Object.values(photoUrls).forEach(urls => {
        urls.forEach(url => {
          if (url && url.startsWith('blob:')) {
            URL.revokeObjectURL(url);
          }
        });
      });
    };
  }, [photoUrls]);

  // 获取分类显示名称
  const getTabDisplayName = useCallback((category: PhotoCategory): string => {
    switch (category) {
      case 'wohnzimmer': return 'Wohnzimmer';
      case 'kueche': return 'Küche & Essbereich';
      case 'zimmer': return 'Zimmer';
      case 'bad': return 'Bad';
      case 'balkon': return 'Balkon & Außenbereich';
      case 'grundriss': return 'Grundriss';
      default: return category;
    }
  }, []);

  // 添加照片到指定分类
  const addPhotos = useCallback((category: PhotoCategory, files: File[]) => {
    const currentPhotos = photos[category] || [];
    const availableSlots = maxPhotosPerCategory - currentPhotos.length;
    
    if (availableSlots <= 0) {
      throw new Error(`Sie können maximal ${maxPhotosPerCategory} Fotos für ${getTabDisplayName(category)} hochladen.`);
    }
    
    const filesToAdd = files.slice(0, availableSlots);
    
    // 为每个文件添加分类信息
    const filesWithCategory: PhotoFile[] = filesToAdd.map(file => {
      return Object.assign(file, {
        category,
        displayName: getTabDisplayName(category)
      });
    });
    
    const newPhotos = {
      ...photos,
      [category]: [...currentPhotos, ...filesWithCategory]
    };
    
    setPhotos(newPhotos);
    
    // 更新照片URL状态
    setPhotoUrls(prev => {
      const currentUrls = prev[category] || [];
      const newUrls = [...currentUrls];
      
      filesToAdd.forEach(file => {
        if (newUrls.length < maxPhotosPerCategory) {
          const url = URL.createObjectURL(file);
          newUrls.push(url);
        }
      });
      
      return {
        ...prev,
        [category]: newUrls
      };
    });
    
    return filesWithCategory;
  }, [photos, maxPhotosPerCategory, getTabDisplayName]);

  // 从指定分类移除照片
  const removePhoto = useCallback((category: PhotoCategory, index: number) => {
    setPhotos(prev => {
      const currentPhotos = prev[category] || [];
      if (currentPhotos[index]) {
        const newPhotos = { ...prev };
        newPhotos[category] = currentPhotos.filter((_, i) => i !== index);
        return newPhotos;
      }
      return prev;
    });
    
    // 清理照片URL
    setPhotoUrls(prev => {
      const currentUrls = prev[category] || [];
      if (currentUrls[index]) {
        // 释放URL对象
        URL.revokeObjectURL(currentUrls[index]);
        
        // 从数组中移除
        const newUrls = currentUrls.filter((_, i) => i !== index);
        return {
          ...prev,
          [category]: newUrls
        };
      }
      return prev;
    });
  }, []);

  // 处理文件上传
  const handlePhotoUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>, category: PhotoCategory) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;
    
    try {
      addPhotos(category, files);
    } catch (error) {
      console.error('Photo upload error:', error);
      throw error;
    }
  }, [addPhotos]);

  // 处理拖拽上传
  const handleDrop = useCallback((files: File[], category: PhotoCategory) => {
    try {
      addPhotos(category, files);
    } catch (error) {
      console.error('Photo drop error:', error);
      throw error;
    }
  }, [addPhotos]);

  // 设置拖拽状态
  const setDragState = useCallback((isOver: boolean, category?: PhotoCategory) => {
    setIsDragOver(isOver);
    if (category) {
      setDragOverTab(category);
    }
  }, []);

  // 获取分类照片数量
  const getCategoryPhotoCount = useCallback((category: PhotoCategory): number => {
    return photos[category]?.length || 0;
  }, [photos]);

  // 获取总照片数量
  const getTotalPhotoCount = useCallback((): number => {
    return Object.values(photos).reduce((sum, photos) => sum + (photos?.length || 0), 0);
  }, [photos]);

  // 检查分类是否为空
  const isCategoryEmpty = useCallback((category: PhotoCategory): boolean => {
    return getCategoryPhotoCount(category) === 0;
  }, [getCategoryPhotoCount]);

  // 检查是否有任何照片
  const hasAnyPhotos = useCallback((): boolean => {
    return getTotalPhotoCount() > 0;
  }, [getTotalPhotoCount]);

  // 重置照片状态
  const resetPhotos = useCallback(() => {
    setPhotos({
      wohnzimmer: [],
      kueche: [],
      zimmer: [],
      bad: [],
      balkon: [],
      grundriss: []
    });
    
    // 清理所有URL
    setPhotoUrls(prev => {
      Object.values(prev).forEach(urls => {
        urls.forEach(url => {
          if (url && url.startsWith('blob:')) {
            URL.revokeObjectURL(url);
          }
        });
      });
      
      return {
        wohnzimmer: [],
        kueche: [],
        zimmer: [],
        bad: [],
        balkon: [],
        grundriss: []
      };
    });
  }, []);

  // 更新上传后的图片URL（用于同步服务器返回的URL）
  const updatePhotoUrls = useCallback((category: PhotoCategory, urls: string[]) => {
    setPhotoUrls(prev => ({
      ...prev,
      [category]: urls
    }));
  }, []);

  // 获取所有照片
  const getAllPhotos = useCallback((): PhotoFile[] => {
    return Object.values(photos).flat();
  }, [photos]);

  return {
    // 状态
    photos,
    photoUrls,
    isDragOver,
    dragOverTab,
    
    // 方法
    addPhotos,
    removePhoto,
    handlePhotoUpload,
    handleDrop,
    setDragState,
    resetPhotos,
    updatePhotoUrls,
    
    // 计算属性
    getCategoryPhotoCount,
    getTotalPhotoCount,
    isCategoryEmpty,
    hasAnyPhotos,
    getAllPhotos,
    
    // 工具方法
    getTabDisplayName,
    
    // 常量
    maxPhotosPerCategory,
  };
}
