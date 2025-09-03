import React, { useState } from 'react';

export interface CoverPageProps {
  title: string;
  address: string;
  backgroundImage?: string;
  propertyName?: string;
  pageNumber?: string;
  backgroundColor?: 'white' | 'gradient' | 'gray';
  className?: string;
}

export const CoverPage: React.FC<CoverPageProps> = ({
  title,
  address,
  backgroundImage,
  propertyName,
  pageNumber = '1 / 12',
  backgroundColor = 'gradient',
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

  // 背景样式配置
  const backgroundClasses = {
    white: 'bg-white',
    gradient: 'bg-gradient-to-br from-gray-50 to-gray-100',
    gray: 'bg-gray-100'
  };

  // 默认背景图片
  const defaultBackgroundImage = 'https://source.unsplash.com/1920x1080/?modern-house';

  return (
    <section className={`page w-full h-screen flex flex-col justify-center items-center relative ${backgroundColor === 'gradient' ? '' : backgroundClasses[backgroundColor]} ${className}`} style={{ pageBreakAfter: 'always' }}>
      
      {/* 背景大图 - 覆盖整个屏幕 */}
      <div className="absolute inset-0 z-0">
        {/* 加载状态 */}
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center z-10">
            <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* 错误状态 */}
        {imageError && (
          <div className="absolute inset-0 bg-gray-300 flex items-center justify-center z-10">
            <div className="text-center text-gray-600">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-400 rounded-xl flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-lg font-medium">背景图片加载失败</p>
            </div>
          </div>
        )}
        
        {/* 背景图片 */}
        <img
          src={backgroundImage || defaultBackgroundImage}
          alt="Property Cover"
          className={`w-full h-full object-cover transition-all duration-700 ${
            imageLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="eager"
        />
        
        {/* 多层渐变遮罩 - 创造深度和层次感 */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-transparent to-black/50"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-r from-black/60 to-transparent"></div>
      </div>

      {/* 内容区域 - 直接融合到背景中 */}
      <div className="relative z-10 w-full h-full flex flex-col justify-center items-start px-16 py-20">
        
        {/* 左侧主内容区域 - 无边界融合设计 */}
        <div className="max-w-4xl">
          
          {/* 动态装饰元素 - 背景几何图形 */}
          <div className="absolute -left-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute -left-4 top-20 w-20 h-20 bg-blue-500/20 rounded-full blur-lg"></div>
          
          {/* 主标题区域 - 大胆的排版设计 */}
          <div className="relative mb-12">
            {/* 标题文字 - 使用透明背景的文字效果 */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-none mb-6
                           text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-white
                           drop-shadow-2xl filter">
              <span className="block">{title?.split(' ')[0] || 'Moderne'}</span>
              <span className="block text-4xl md:text-6xl lg:text-7xl font-light italic text-white/90 drop-shadow-lg">
                {title?.split(' ').slice(1).join(' ') || 'Immobilienpräsentation'}
              </span>
            </h1>
            
            {/* 动态装饰线条 */}
            <div className="flex items-center space-x-3 mb-8">
              <div className="h-1 w-24 bg-gradient-to-r from-transparent via-white/80 to-transparent rounded-full"></div>
              <div className="w-3 h-3 bg-white/80 rounded-full shadow-lg"></div>
              <div className="h-1 w-16 bg-gradient-to-r from-white/80 via-blue-400/60 to-transparent rounded-full"></div>
            </div>
          </div>
          
          {/* 地址信息区域 - 现代化设计 */}
          <div className="relative">
            {/* 背景模糊效果 */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-3xl border border-white/20"></div>
            
            {/* 地址内容 */}
            <div className="relative z-10 px-8 py-6 flex items-center">
              {/* 位置图标 */}
              <div className="mr-6 flex-shrink-0">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              
              {/* 地址文字 */}
              <div className="flex-1">
                <p className="text-sm text-white/70 font-medium uppercase tracking-wider mb-1">Standort</p>
                <p className="text-xl md:text-2xl text-white font-semibold tracking-wide">
                  {address || 'Premium Lage in der Innenstadt'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};
