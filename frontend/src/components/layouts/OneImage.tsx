import React, { useState } from 'react';
import { BaseLayoutProps } from './types';
import { TextBlock } from '@/components/Shared/TextBlock';

export const OneImage: React.FC<BaseLayoutProps> = ({
  images,
  description,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (!images || images.length === 0) {
    return null;
  }

  const image = images[0];

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 大图全宽显示 */}
      <div className="relative w-full h-96 md:h-[500px] lg:h-[600px] xl:h-[700px] rounded-xl overflow-hidden shadow-2xl">
        {/* 加载状态 */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* 错误状态 */}
        {hasError && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm">图片加载失败</p>
            </div>
          </div>
        )}
        
        {/* 图片 */}
        <img
          src={image.url}
          alt={image.category}
          className={`w-full h-full object-cover transition-all duration-700 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          } hover:scale-110 hover:shadow-2xl`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
        />
        
        {/* 图片信息覆盖层 */}
        {!isLoading && !hasError && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-6">
            <div className="text-white">
              <h3 className="text-lg font-semibold mb-2">{image.category}</h3>
              {image.category && (
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                  {image.category}
                </span>
              )}
            </div>
          </div>
        )}
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
