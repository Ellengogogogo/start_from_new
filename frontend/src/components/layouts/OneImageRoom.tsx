import React, { useState } from 'react';

export interface OneImageRoomProps {
  image: {
    url: string;
    category: string;
    alt?: string;
  };
  title: string;
  description?: string;
  propertyName?: string;
  pageNumber?: string;
  className?: string;
}

export const OneImageRoom: React.FC<OneImageRoomProps> = ({
  image,
  title,
  description,
  propertyName,
  pageNumber = '1 / 12',
  className = ''
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  return (
    <div className={`one-image-room w-full h-screen relative overflow-hidden ${className}`}>
      
      {/* 背景大图 - 覆盖整个屏幕 */}
      <div className="absolute inset-0 z-0">
        {/* 加载状态 */}
        {imageLoading && (
          <div className="absolute inset-0 bg-stone-100 animate-pulse flex items-center justify-center z-10">
            <div className="w-20 h-20 border-4 border-stone-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* 错误状态 */}
        {imageError && (
          <div className="absolute inset-0 bg-slate-100 flex items-center justify-center z-10">
            <div className="text-center text-slate-600">
              <div className="w-20 h-20 mx-auto mb-4 bg-slate-300 rounded-xl flex items-center justify-center">
                <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-lg font-medium">房间图片加载失败</p>
            </div>
          </div>
        )}
        
        {/* 背景图片 */}
        <img
          src={image.url}
          alt={image.alt || image.category}
          className={`w-full h-full object-cover transition-all duration-700 ${
            imageLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="eager"
        />
        
        {/* 多层渐变遮罩 - 创造深度和层次感 */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        <div className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-r from-black/70 to-transparent"></div>
      </div>

      {/* 内容区域 - 左下角标题和描述 */}
      <div className="relative z-10 w-full h-full flex flex-col justify-end items-start px-16 py-20">
        
        {/* 左下角内容区域 - 无边界融合设计 */}
        <div className="max-w-4xl">
          
          {/* 动态装饰元素 - 背景几何图形 */}
          <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute -left-4 bottom-20 w-20 h-20 bg-stone-500/20 rounded-full blur-lg"></div>
          
          {/* 主标题区域 - 大胆的排版设计 */}
          <div className="relative mb-8">
            {/* 房间类型标签 */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-2 h-2 bg-stone-400 rounded-full"></div>
              <div className="text-sm text-stone-300 uppercase tracking-wider font-medium">
                {image.category}
              </div>
            </div>
            
            {/* 标题文字 - 使用透明背景的文字效果 */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-none mb-6
                           text-transparent bg-clip-text bg-gradient-to-r from-white via-stone-100 to-white
                           drop-shadow-2xl filter">
              {title}
            </h1>
            
            {/* 动态装饰线条 */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-1 w-20 bg-gradient-to-r from-transparent via-white/80 to-transparent rounded-full"></div>
              <div className="w-2 h-2 bg-white/80 rounded-full shadow-lg"></div>
              <div className="h-1 w-12 bg-gradient-to-r from-white/80 via-stone-400/60 to-transparent rounded-full"></div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};
