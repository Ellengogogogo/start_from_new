import React, { useState } from 'react';
import { BaseLayoutProps } from '@/types/layout';
import { TextBlock } from '@/components/Shared/TextBlock';

export const FiveImages: React.FC<BaseLayoutProps> = ({
  images,
  description,
  className = ''
}) => {
  const [imageStates, setImageStates] = useState({
    image1: { isLoading: true, hasError: false },
    image2: { isLoading: true, hasError: false },
    image3: { isLoading: true, hasError: false },
    image4: { isLoading: true, hasError: false },
    image5: { isLoading: true, hasError: false }
  });

  if (!images || images.length < 5) {
    return null;
  }

  const [image1, image2, image3, image4, image5] = images;

  const handleImageLoad = (imageKey: 'image1' | 'image2' | 'image3' | 'image4' | 'image5') => {
    setImageStates(prev => ({
      ...prev,
      [imageKey]: { ...prev[imageKey], isLoading: false }
    }));
  };

  const handleImageError = (imageKey: 'image1' | 'image2' | 'image3' | 'image4' | 'image5') => {
    setImageStates(prev => ({
      ...prev,
      [imageKey]: { ...prev[imageKey], isLoading: false, hasError: true }
    }));
  };

  const ImageContainer = ({ 
    image, 
    imageKey, 
    className = '',
    size = 'default'
  }: { 
    image: any; 
    imageKey: 'image1' | 'image2' | 'image3' | 'image4' | 'image5'; 
    className?: string;
    size?: 'large' | 'default' | 'small';
  }) => {
    const state = imageStates[imageKey];
    
    const sizeClasses = {
      large: 'h-80 sm:h-96 lg:h-[500px] xl:h-[600px]',
      default: 'h-64 sm:h-72 md:h-80 lg:h-96',
      small: 'h-32 sm:h-36 md:h-40 lg:h-44'
    };
    
    return (
      <div className={`relative ${sizeClasses[size]} rounded-xl overflow-hidden shadow-lg group ${className}`}>
        {/* 加载状态 */}
        {state.isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* 错误状态 */}
        {state.hasError && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="w-12 h-12 mx-auto mb-2 bg-gray-300 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-xs">加载失败</p>
            </div>
          </div>
        )}
        
        {/* 图片 */}
        <img
          src={image.url}
          alt={image.alt}
          className={`w-full h-full object-cover transition-all duration-500 ${
            state.isLoading ? 'opacity-0' : 'opacity-100'
          } group-hover:scale-110 group-hover:shadow-2xl`}
          onLoad={() => handleImageLoad(imageKey)}
          onError={() => handleImageError(imageKey)}
          loading="lazy"
        />
        
        {/* 悬停覆盖层 */}
        {!state.isLoading && !state.hasError && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-end">
            <div className="w-full p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <div className="text-white text-center">
                <h4 className="font-semibold text-sm mb-1">{image.displayName || '房间展示'}</h4>
                {image.category && (
                  <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs">
                    {image.category}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 上方主图 - 重点突出 */}
      <div className="transform hover:-translate-y-1 transition-transform duration-300">
        <ImageContainer 
          image={image1} 
          imageKey="image1"
          size="large"
          className="shadow-2xl"
        />
      </div>
      
      {/* 下方4张小图 - 补充展示 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
        <div className="transform hover:-translate-y-1 transition-transform duration-300">
          <ImageContainer 
            image={image2} 
            imageKey="image2"
            size="small"
          />
        </div>
        <div className="transform hover:-translate-y-1 transition-transform duration-300">
          <ImageContainer 
            image={image3} 
            imageKey="image3"
            size="small"
          />
        </div>
        <div className="transform hover:-translate-y-1 transition-transform duration-300">
          <ImageContainer 
            image={image4} 
            imageKey="image4"
            size="small"
          />
        </div>
        <div className="transform hover:-translate-y-1 transition-transform duration-300">
          <ImageContainer 
            image={image5} 
            imageKey="image5"
            size="small"
          />
        </div>
      </div>
      
      {/* 下方文本块 */}
      <TextBlock
        description={description}
        variant="card"
        className="max-w-4xl mx-auto shadow-lg"
      />
    </div>
  );
};
