import { useState, useCallback, useEffect, useRef } from 'react';
import { Images } from '@/types/property';

export type ImageCategory = keyof Images;

export interface ImageFile extends File {
  category: ImageCategory;
}

export interface UseImageUploadOptions {
  maxImagesPerCategory?: number;
  onImageChange?: (images: Images) => void;
}

export function useImageUpload({ 
  maxImagesPerCategory = 6, 
  onImageChange 
}: UseImageUploadOptions = {}) {
  // 图片状态
  const [images, setImages] = useState<Images>({
    wohnzimmer: [],
    kueche: [],
    zimmer: [],
    bad: [],
    balkon: [],
    grundriss: []
  });

  // 图片URL状态
  const [imageUrls, setImageUrls] = useState<Record<ImageCategory, string[]>>({
    wohnzimmer: [],
    kueche: [],
    zimmer: [],
    bad: [],
    balkon: [],
    grundriss: []
  });

  // 拖拽状态
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragOverTab, setDragOverTab] = useState<ImageCategory>('wohnzimmer');

  // 使用 ref 来存储最新的 onImageChange 回调，避免无限循环
  const onImageChangeRef = useRef(onImageChange);
  onImageChangeRef.current = onImageChange;

  // 当图片变化时调用回调 - 使用 ref 避免依赖循环
  useEffect(() => {
    if (onImageChangeRef.current) {
      onImageChangeRef.current(images);
    }
  }, [images]); // 移除 onImageChange 依赖

  // 清理函数：组件卸载时释放所有URL
  useEffect(() => {
    return () => {
      Object.values(imageUrls).forEach(urls => {
        urls.forEach(url => {
          if (url && url.startsWith('blob:')) {
            URL.revokeObjectURL(url);
          }
        });
      });
    };
  }, [imageUrls]);

  // 获取分类显示名称
  const getTabDisplayName = useCallback((category: ImageCategory): string => {
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

  // 添加图片到指定分类
  const addImages = useCallback((category: ImageCategory, files: File[]) => {
    const currentImages = images[category] || [];
    const availableSlots = maxImagesPerCategory - currentImages.length;
    
    if (availableSlots <= 0) {
      throw new Error(`Sie können maximal ${maxImagesPerCategory} Bilder für ${getTabDisplayName(category)} hochladen.`);
    }
    
    const filesToAdd = files.slice(0, availableSlots);
    
    // 为每个文件添加分类信息
    const filesWithCategory: ImageFile[] = filesToAdd.map(file => {
      return Object.assign(file, {
        category
      });
    });
    
    const newImages = {
      ...images,
      [category]: [...currentImages, ...filesWithCategory]
    };
    
    setImages(newImages);
    
    // 更新图片URL状态
    setImageUrls(prev => {
      const currentUrls = prev[category] || [];
      const newUrls = [...currentUrls];
      
      filesToAdd.forEach(file => {
        if (newUrls.length < maxImagesPerCategory) {
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
  }, [images, maxImagesPerCategory, getTabDisplayName]);

  // 从指定分类移除图片
  const removeImage = useCallback((category: ImageCategory, index: number) => {
    setImages(prev => {
      const currentImages = prev[category] || [];
      if (currentImages[index]) {
        const newImages = { ...prev };
        newImages[category] = currentImages.filter((_, i) => i !== index);
        return newImages;
      }
      return prev;
    });
    
    // 清理图片URL
    setImageUrls(prev => {
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
  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>, category: ImageCategory) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;
    
    try {
      addImages(category, files);
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  }, [addImages]);

  // 处理拖拽上传
  const handleDrop = useCallback((files: File[], category: ImageCategory) => {
    try {
      addImages(category, files);
    } catch (error) {
      console.error('Image drop error:', error);
      throw error;
    }
  }, [addImages]);

  // 设置拖拽状态
  const setDragState = useCallback((isOver: boolean, category?: ImageCategory) => {
    setIsDragOver(isOver);
    if (category) {
      setDragOverTab(category);
    }
  }, []);

  // 获取分类图片数量
  const getCategoryImageCount = useCallback((category: ImageCategory): number => {
    return images[category]?.length || 0;
  }, [images]);

  // 获取总图片数量
  const getTotalImageCount = useCallback((): number => {
    return Object.values(images).reduce((sum, images) => sum + (images?.length || 0), 0);
  }, [images]);

  // 检查分类是否为空
  const isCategoryEmpty = useCallback((category: ImageCategory): boolean => {
    return getCategoryImageCount(category) === 0;
  }, [getCategoryImageCount]);

  // 检查是否有任何图片
  const hasAnyImages = useCallback((): boolean => {
    return getTotalImageCount() > 0;
  }, [getTotalImageCount]);

  // 重置图片状态
  const resetImages = useCallback(() => {
    setImages({
      wohnzimmer: [],
      kueche: [],
      zimmer: [],
      bad: [],
      balkon: [],
      grundriss: []
    });
    
    // 清理所有URL
    setImageUrls(prev => {
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
  const updateImageUrls = useCallback((category: ImageCategory, urls: string[]) => {
    setImageUrls(prev => ({
      ...prev,
      [category]: urls
    }));
  }, []);

  // 获取所有图片
  const getAllImages = useCallback((): ImageFile[] => {
    return Object.values(images).flat();
  }, [images]);

  return {
    // 状态
    images,
    imageUrls,
    isDragOver,
    dragOverTab,
    
    // 方法
    addImages,
    removeImage,
    handleImageUpload,
    handleDrop,
    setDragState,
    resetImages,
    updateImageUrls,
    
    // 计算属性
    getCategoryImageCount,
    getTotalImageCount,
    isCategoryEmpty,
    hasAnyImages,
    getAllImages,
    
    // 工具方法
    getTabDisplayName,
    
    // 常量
    maxImagesPerCategory,
  };
}
