import { useState, useCallback, useEffect } from 'react';
import { ImageData, LayoutType } from '@/types/layout';

interface ImageState {
  isLoading: boolean;
  hasError: boolean;
  isLoaded: boolean;
}

interface UseImageLayoutReturn {
  imageStates: Record<string, ImageState>;
  layoutType: LayoutType;
  isLoading: boolean;
  hasAnyError: boolean;
  handleImageLoad: (imageId: string) => void;
  handleImageError: (imageId: string) => void;
  retryImage: (imageId: string) => void;
  getResponsiveLayout: (screenWidth: number) => string;
}

export const useImageLayout = (images: ImageData[]): UseImageLayoutReturn => {
  // 初始化图片状态
  const [imageStates, setImageStates] = useState<Record<string, ImageState>>(() => {
    const states: Record<string, ImageState> = {};
    images.forEach(image => {
      states[image.id] = {
        isLoading: true,
        hasError: false,
        isLoaded: false
      };
    });
    return states;
  });

  // 根据图片数量确定布局类型
  const getLayoutType = useCallback((imageCount: number): LayoutType => {
    switch (imageCount) {
      case 1:
        return LayoutType.ONE_IMAGE;
      case 2:
        return LayoutType.TWO_IMAGES;
      case 3:
        return LayoutType.THREE_IMAGES;
      case 4:
        return LayoutType.FOUR_IMAGES;
      case 5:
        return LayoutType.FIVE_IMAGES;
      case 6:
        return LayoutType.SIX_IMAGES;
      default:
        return LayoutType.ONE_IMAGE;
    }
  }, []);

  const layoutType = getLayoutType(images.length);

  // 计算整体加载状态
  const isLoading = Object.values(imageStates).some(state => state.isLoading);
  const hasAnyError = Object.values(imageStates).some(state => state.hasError);

  // 处理图片加载成功
  const handleImageLoad = useCallback((imageId: string) => {
    setImageStates(prev => ({
      ...prev,
      [imageId]: {
        isLoading: false,
        hasError: false,
        isLoaded: true
      }
    }));
  }, []);

  // 处理图片加载失败
  const handleImageError = useCallback((imageId: string) => {
    setImageStates(prev => ({
      ...prev,
      [imageId]: {
        isLoading: false,
        hasError: true,
        isLoaded: false
      }
    }));
  }, []);

  // 重试加载图片
  const retryImage = useCallback((imageId: string) => {
    setImageStates(prev => ({
      ...prev,
      [imageId]: {
        isLoading: true,
        hasError: false,
        isLoaded: false
      }
    }));
  }, []);

  // 响应式布局计算
  const getResponsiveLayout = useCallback((screenWidth: number): string => {
    if (screenWidth < 640) {
      return 'mobile'; // sm
    } else if (screenWidth < 768) {
      return 'small-tablet'; // md
    } else if (screenWidth < 1024) {
      return 'tablet'; // lg
    } else if (screenWidth < 1280) {
      return 'desktop'; // xl
    } else {
      return 'large-desktop'; // 2xl
    }
  }, []);

  // 图片尺寸优化配置
  const getImageSizeConfig = useCallback((layoutType: LayoutType, screenSize: string) => {
    const configs = {
      [LayoutType.ONE_IMAGE]: {
        mobile: { width: '100%', height: '384px' },
        tablet: { width: '100%', height: '500px' },
        desktop: { width: '100%', height: '600px' },
        'large-desktop': { width: '100%', height: '700px' }
      },
      [LayoutType.TWO_IMAGES]: {
        mobile: { width: '100%', height: '256px' },
        tablet: { width: '100%', height: '320px' },
        desktop: { width: '100%', height: '384px' }
      },
      [LayoutType.THREE_IMAGES]: {
        mobile: { width: '100%', height: '320px' },
        tablet: { width: '100%', height: '384px' },
        desktop: { width: '100%', height: '500px' }
      },
      [LayoutType.FOUR_IMAGES]: {
        mobile: { width: '100%', height: '192px' },
        tablet: { width: '100%', height: '224px' },
        desktop: { width: '100%', height: '256px' }
      },
      [LayoutType.FIVE_IMAGES]: {
        mobile: { width: '100%', height: '320px' },
        tablet: { width: '100%', height: '384px' },
        desktop: { width: '100%', height: '500px' }
      },
      [LayoutType.SIX_IMAGES]: {
        mobile: { width: '100%', height: '192px' },
        tablet: { width: '100%', height: '224px' },
        desktop: { width: '100%', height: '256px' }
      }
    };

    return configs[layoutType]?.[screenSize] || configs[layoutType]?.desktop;
  }, []);

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      // 这里可以添加窗口大小变化的处理逻辑
      // 比如重新计算布局或触发重新渲染
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 图片预加载优化
  useEffect(() => {
    const preloadImages = async () => {
      const promises = images.map(image => {
        return new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => reject();
          img.src = image.url;
        });
      });

      try {
        await Promise.all(promises);
      } catch (error) {
        console.warn('Some images failed to preload:', error);
      }
    };

    if (images.length > 0) {
      preloadImages();
    }
  }, [images]);

  return {
    imageStates,
    layoutType,
    isLoading,
    hasAnyError,
    handleImageLoad,
    handleImageError,
    retryImage,
    getResponsiveLayout,
    getImageSizeConfig: (screenSize: string) => getImageSizeConfig(layoutType, screenSize)
  };
};
