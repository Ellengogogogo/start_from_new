import React from 'react';
import { LayoutImage } from './types';
import { OneImage } from './OneImage';
import { TwoImages } from './TwoImages';
import { ThreeImages } from './ThreeImages';
import { FourImages } from './FourImages';
import { FiveImages } from './FiveImages';
import { SixImages } from './SixImages';

interface DynamicImageLayoutProps {
  images: LayoutImage[];
  description: string;
  category: string;
  className?: string;
}

export const DynamicImageLayout: React.FC<DynamicImageLayoutProps> = ({
  images,
  description,
  category,
  className = ''
}) => {
  // 根据图片数量选择合适的布局组件
  const getLayoutComponent = () => {
    const imageCount = images.length;
    
    if (imageCount === 0) {
      return null; // 无图片时返回null
    }
    
    const props = { images, description, className };
    
    switch (imageCount) {
      case 1:
        return <OneImage {...props} />;
      case 2:
        return <TwoImages {...props} />;
      case 3:
        return <ThreeImages {...props} />;
      case 4:
        return <FourImages {...props} />;
      case 5:
        return <FiveImages {...props} />;
      case 6:
      default:
        // 6张或更多图片时使用SixImages布局
        return <SixImages {...props} images={images.slice(0, 6)} />;
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
