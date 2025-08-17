import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export interface ImageGalleryProps {
  images: Array<{
    id: string;
    url: string;
    alt: string;
    isPrimary?: boolean;
  }>;
  className?: string;
  showLightbox?: boolean;
  gridCols?: 1 | 2 | 3 | 4;
  aspectRatio?: 'square' | 'video' | 'auto';
  maxHeight?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  className,
  showLightbox = true,
  gridCols = 3,
  aspectRatio = 'video',
  maxHeight = '400px',
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // 构建完整的图片URL
  const getFullImageUrl = (url: string): string => {
    // 如果URL已经是完整的HTTP URL，直接返回
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // 如果是相对路径，构建完整URL
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    return `${baseUrl}${url}`;
  };

  if (!images || images.length === 0) {
    return (
      <div className={cn('flex items-center justify-center h-64 bg-gray-100 rounded-lg', className)}>
        <div className="text-center text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p>Keine Bilder verfügbar</p>
        </div>
      </div>
    );
  }

  // 网格列数配置
  const gridConfig = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  // 宽高比配置
  const aspectConfig = {
    square: 'aspect-square',
    video: 'aspect-video',
    auto: 'aspect-auto',
  };

  // 主图显示
  const primaryImage = images.find(img => img.isPrimary) || images[0];
  const otherImages = images.filter(img => img.id !== primaryImage.id);

  return (
    <>
      <div className={cn('space-y-4', className)}>
        {/* 主图 */}
        {primaryImage && (
          <div className="relative group cursor-pointer overflow-hidden rounded-lg">
            <img
              src={getFullImageUrl(primaryImage.url)}
              alt={primaryImage.alt}
              className={cn(
                'w-full object-cover transition-transform duration-300 group-hover:scale-105',
                aspectConfig[aspectRatio],
                maxHeight && `max-h-[${maxHeight}]`
              )}
              onClick={() => showLightbox && setSelectedImage(getFullImageUrl(primaryImage.url))}
            />
            
            {/* 悬停遮罩 */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* 其他图片网格 */}
        {otherImages.length > 0 && (
          <div className={cn('grid gap-3', gridConfig[gridCols])}>
            {otherImages.map((image) => (
              <div
                key={image.id}
                className="relative group cursor-pointer overflow-hidden rounded-lg"
                onClick={() => showLightbox && setSelectedImage(getFullImageUrl(image.url))}
              >
                <img
                  src={getFullImageUrl(image.url)}
                  alt={image.alt}
                  className={cn(
                    'w-full h-full object-cover transition-transform duration-300 group-hover:scale-105',
                    aspectConfig[aspectRatio]
                  )}
                />
                
                {/* 悬停遮罩 */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {showLightbox && selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-7xl max-h-full">
            <img
              src={selectedImage}
              alt="放大查看"
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            
            {/* 关闭按钮 */}
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export { ImageGallery };
