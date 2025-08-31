import React, { useState } from 'react';

export interface TwoImagesRoomProps {
  images: Array<{
    url: string;
    category: string;
    alt?: string;
  }>;
  title: string;
  description?: string;
  propertyName?: string;
  pageNumber?: string;
  className?: string;
}

export const TwoImagesRoom: React.FC<TwoImagesRoomProps> = ({
  images,
  title,
  description,
  propertyName,
  pageNumber,
  className = ''
}) => {
  // 调试信息
  console.log('TwoImagesRoom received propertyName:', propertyName);
  const [imageStates, setImageStates] = useState({
    image1: { isLoading: true, hasError: false },
    image2: { isLoading: true, hasError: false }
  });

  if (!images || images.length < 2) {
    return null;
  }

  const [image1, image2] = images;

  const handleImageLoad = (imageKey: 'image1' | 'image2') => {
    setImageStates(prev => ({
      ...prev,
      [imageKey]: { ...prev[imageKey], isLoading: false }
    }));
  };

  const handleImageError = (imageKey: 'image1' | 'image2') => {
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
    imageKey: 'image1' | 'image2'; 
    className?: string; 
  }) => {
    const state = imageStates[imageKey];
    
    return (
      <div className={`relative h-full ${className}`}>
        {/* 加载状态 - 低饱和度 */}
        {state.isLoading && (
          <div className="absolute inset-0 bg-stone-100 animate-pulse flex items-center justify-center z-10">
            <div className="w-16 h-16 border-4 border-stone-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* 错误状态 - 低饱和度 */}
        {state.hasError && (
          <div className="absolute inset-0 bg-slate-100 flex items-center justify-center z-10">
            <div className="text-center text-slate-600">
              <div className="w-16 h-16 mx-auto mb-2 bg-slate-300 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm">图片加载失败</p>
            </div>
          </div>
        )}
        
        {/* 图片 - 保持比例，去卡片化 */}
        <img
          src={image.url}
          alt={image.alt || image.category}
          className={`w-full h-full object-cover transition-all duration-300 ${
            state.isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={() => handleImageLoad(imageKey)}
          onError={() => handleImageError(imageKey)}
          loading="lazy"
        />
      </div>
    );
  };

  return (
    <div className={`two-images-room w-full h-screen relative overflow-hidden ${className}`}>
      
      {/* 背景渐变 - 低饱和度 */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-50/40 via-slate-50/30 to-gray-50/40"></div>
      
      {/* 图片区域 - 页面上部，两张图片之间有分隔，保持照片完整性 */}
      <div className="relative z-10 w-full h-3/5 flex justify-center items-center px-16 py-8">
        <div className="w-full max-w-6xl grid grid-cols-2 gap-6">
          <div className="aspect-[4/3]">
            <ImageContainer 
              image={image1} 
              imageKey="image1"
            />
          </div>
          <div className="aspect-[4/3]">
            <ImageContainer 
              image={image2} 
              imageKey="image2"
            />
          </div>
        </div>
      </div>

      {/* 内容区域 - 左下角标题和描述，占据更多空间 */}
      <div className="relative z-20 w-full h-2/5 flex flex-col justify-end items-start px-16 pb-32">
        
        {/* 左下角内容区域 - 无边界融合设计 */}
        <div className="max-w-4xl">
          
          {/* 动态装饰元素 - 背景几何图形 */}
          <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute -left-4 bottom-20 w-20 h-20 bg-stone-500/20 rounded-full blur-lg"></div>
          
          {/* 主标题区域 - 大胆的排版设计 */}
          <div className="relative mb-8">
            {/* 房间类型标签 */}
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-2 h-2 bg-stone-400 rounded-full"></div>
              <div className="text-sm text-stone-500 uppercase tracking-wider font-medium">
                {image1.category}
              </div>
            </div>
            
            {/* 标题文字 - 使用透明背景的文字效果 */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black leading-none mb-6
                           text-transparent bg-clip-text bg-gradient-to-r from-stone-800 via-stone-600 to-stone-800
                           drop-shadow-lg filter">
              {title}
            </h1>
            
            {/* 动态装饰线条 */}
            <div className="flex items-center space-x-2 mb-6">
              <div className="h-1 w-16 bg-gradient-to-r from-transparent via-stone-400 to-transparent rounded-full"></div>
              <div className="w-2 h-2 bg-stone-400 rounded-full shadow-lg"></div>
              <div className="h-1 w-10 bg-gradient-to-r from-stone-400 via-stone-300 to-transparent rounded-full"></div>
            </div>
          </div>

        </div>
      </div>

      {/* 现代化页脚 - 去边界设计，与 CoverPage 一致 */}
      <div className="absolute bottom-0 left-0 right-0 z-30">
        {/* 渐变背景 */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-white/20 to-transparent"></div>
        
        {/* 内容 */}
        <div className="relative z-10 h-16 flex items-center justify-between px-8">
          <div className="text-stone-700 font-medium tracking-wide">
            {propertyName || 'Premium Immobilie'}
          </div>
          <div className="flex items-center space-x-3">
            {/* 页码指示器 */}
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-stone-400 rounded-full"></div>
              <div className="w-6 h-0.5 bg-stone-200 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
            </div>
            <span className="text-stone-600 font-medium text-sm">
              {pageNumber}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
