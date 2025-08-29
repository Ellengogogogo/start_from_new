import React, { useState } from 'react';
import { BaseLayoutProps } from './types';
import { TextBlock } from '@/components/Shared/TextBlock';

export const SixImages: React.FC<BaseLayoutProps> = ({
  images,
  description,
  className = ''
}) => {
  const [imageStates, setImageStates] = useState({
    image1: { isLoading: true, hasError: false },
    image2: { isLoading: true, hasError: false },
    image3: { isLoading: true, hasError: false },
    image4: { isLoading: true, hasError: false },
    image5: { isLoading: true, hasError: false },
    image6: { isLoading: true, hasError: false }
  });

  if (!images || images.length < 6) {
    return null;
  }

  const [image1, image2, image3, image4, image5, image6] = images;

  const handleImageLoad = (imageKey: 'image1' | 'image2' | 'image3' | 'image4' | 'image5' | 'image6') => {
    setImageStates(prev => ({
      ...prev,
      [imageKey]: { ...prev[imageKey], isLoading: false }
    }));
  };

  const handleImageError = (imageKey: 'image1' | 'image2' | 'image3' | 'image4' | 'image5' | 'image6') => {
    setImageStates(prev => ({
      ...prev,
      [imageKey]: { ...prev[imageKey], isLoading: false, hasError: true }
    }));
  };

  const ImageContainer = ({ 
    image, 
    imageKey, 
    className = '' 
  }: { 
    image: any; 
    imageKey: 'image1' | 'image2' | 'image3' | 'image4' | 'image5' | 'image6'; 
    className?: string; 
  }) => {
    const state = imageStates[imageKey];
    
    return (
      <div className={`relative h-48 sm:h-56 md:h-64 lg:h-72 rounded-xl overflow-hidden shadow-lg group ${className}`}>
        {/* 加载状态 */}
        {state.isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* 错误状态 */}
        {state.hasError && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="w-10 h-10 mx-auto mb-2 bg-gray-300 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <h4 className="font-semibold text-sm mb-1">{image.category || '房间展示'}</h4>
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
      {/* 3x2网格布局 - 均匀展示 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="transform hover:-translate-y-1 transition-transform duration-300">
          <ImageContainer 
            image={image1} 
            imageKey="image1"
          />
        </div>
        <div className="transform hover:-translate-y-1 transition-transform duration-300">
          <ImageContainer 
            image={image2} 
            imageKey="image2"
          />
        </div>
        <div className="transform hover:-translate-y-1 transition-transform duration-300">
          <ImageContainer 
            image={image3} 
            imageKey="image3"
          />
        </div>
        <div className="transform hover:-translate-y-1 transition-transform duration-300">
          <ImageContainer 
            image={image4} 
            imageKey="image4"
          />
        </div>
        <div className="transform hover:-translate-y-1 transition-transform duration-300">
          <ImageContainer 
            image={image5} 
            imageKey="image5"
          />
        </div>
        <div className="transform hover:-translate-y-1 transition-transform duration-300">
          <ImageContainer 
            image={image6} 
            imageKey="image6"
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
