import React from 'react';
import { LayoutImage } from './types';
import { OneImageRoom } from '@/components/layouts/OneImageRoom';
import { TwoImagesRoom } from '@/components/layouts/TwoImagesRoom';
import { ThreeImagesRoom } from '@/components/layouts/ThreeImagesRoom';
import { FourImagesRoom } from '@/components/layouts/FourImagesRoom';
import { FiveImagesRoom } from '@/components/layouts/FiveImagesRoom';
import { SixImagesRoom } from '@/components/layouts/SixImagesRoom';

interface DynamicImageLayoutProps {
  images: LayoutImage[];
  description: string;
  category: string;
  propertyName?: string;
  pageNumber?: string;
  className?: string;
}

export const DynamicImageLayout: React.FC<DynamicImageLayoutProps> = ({
  images,
  description,
  category,
  propertyName,
  pageNumber,
  className = ''
}) => {
  // 添加调试信息
  console.log('DynamicImageLayout received:', { images, description, category, propertyName, className });
  
  // 根据图片数量选择合适的布局组件
  const getLayoutComponent = () => {
    const imageCount = images.length;
    console.log('Image count:', imageCount);
    
    if (imageCount === 0) {
      console.log('No images, returning null');
      return null; // 无图片时返回null
    }
    
    // 确保所有图片都有有效的URL
    const validImages = images.filter(img => img && img.url);
    console.log('Valid images:', validImages);
    
    if (validImages.length === 0) {
      console.log('No valid images, returning null');
      return null; // 没有有效图片时返回null
    }
    
    switch (imageCount) {
      case 1:
        console.log('Using OneImageRoom layout with propertyName:', propertyName);
        return (
          <OneImageRoom
            image={validImages[0]}
            title={category}
            description={description}
            propertyName={propertyName}
            pageNumber={pageNumber}
            className={className}
          />
        );
      case 2:
        console.log('Using TwoImagesRoom layout');
        return (
          <TwoImagesRoom
            images={validImages.slice(0, 2)}
            title={category}
            description={description}
            propertyName={propertyName}
            pageNumber={pageNumber}
            className={className}
          />
        );
      case 3:
        console.log('Using ThreeImagesRoom layout');
        return (
          <ThreeImagesRoom
            images={validImages.slice(0, 3)}
            title={category}
            description={description}
            propertyName={propertyName}
            pageNumber={pageNumber}
            className={className}
          />
        );
      case 4:
        console.log('Using FourImagesRoom layout');
        return (
          <FourImagesRoom
            images={validImages.slice(0, 4)}
            title={category}
            description={description}
            propertyName={propertyName}
            pageNumber={pageNumber}
            className={className}
          />
        );
      case 5:
        console.log('Using FiveImagesRoom layout');
        return (
          <FiveImagesRoom
            images={validImages.slice(0, 5)}
            title={category}
            description={description}
            propertyName={propertyName}
            pageNumber={pageNumber}
            className={className}
          />
        );
      case 6:
      default:
        console.log('Using SixImagesRoom layout');
        // 6张或更多图片时使用SixImages布局
        return (
          <SixImagesRoom
            images={validImages.slice(0, 6)}
            title={category}
            description={description}
            propertyName={propertyName}
            pageNumber={pageNumber}
            className={className}
          />
        );
    }
  };

  const layoutComponent = getLayoutComponent();
  
  // 如果没有图片，显示空状态
  if (!layoutComponent) {
    return (
      <div className={`flex items-center justify-center h-64 bg-gray-100 rounded-lg ${className}`}>
        <div className="text-center text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p>Keine {category} Bilder verfügbar</p>
        </div>
      </div>
    );
  }
  
  return layoutComponent;
};
