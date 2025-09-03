import React, { useState } from 'react';

export interface SixImagesProps {
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

export const SixImagesRoom: React.FC<SixImagesProps> = ({
  images,
  title,
  description,
  propertyName,
  pageNumber = '1 / 12',
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
      <div className={`relative h-full ${className}`}>
        {/* 加载状态 - 低饱和度 */}
        {state.isLoading && (
          <div className="absolute inset-0 bg-stone-100 animate-pulse flex items-center justify-center z-10">
            <div className="w-8 h-8 border-4 border-stone-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* 错误状态 - 低饱和度 */}
        {state.hasError && (
          <div className="absolute inset-0 bg-slate-100 flex items-center justify-center z-10">
            <div className="text-center text-slate-600">
              <div className="w-8 h-8 mx-auto mb-1 bg-slate-300 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-xs">加载失败</p>
            </div>
          </div>
        )}
        
        {/* 图片 - 全屏覆盖，去卡片化 */}
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
    <section className={`page w-full h-screen flex flex-col justify-center items-center relative overflow-hidden ${className}`} style={{ pageBreakAfter: 'always' }}>
      
      {/* 背景渐变 - 低饱和度 */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-50/40 via-slate-50/30 to-gray-50/40"></div>
      
      {/* 主内容区域 */}
      <div className="relative z-10 h-full flex flex-col">
        
        {/* 标题和描述区域 - 页面上部 */}
        <div className="flex-1 flex flex-col justify-center px-16 py-20">
          
          {/* 内容区域 - 无边界融合设计 */}
          <div className="max-w-4xl">
            
            {/* 动态装饰元素 - 背景几何图形 */}
            <div className="absolute -left-8 top-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute -left-4 top-40 w-20 h-20 bg-stone-500/20 rounded-full blur-lg"></div>
            
            {/* 主标题区域 - 极简设计 */}
            <div className="relative mb-8">
              {/* 房间类型标签 */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-2 h-2 bg-stone-400 rounded-full"></div>
                <div className="text-sm text-stone-500 uppercase tracking-wider font-medium">
                  {image1.category}
                </div>
              </div>
              
              {/* 标题文字 - 极简排版 */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-none mb-6
                             text-stone-800 drop-shadow-sm">
                {title}
              </h1>
              
              {/* 简单装饰线条 */}
              <div className="flex items-center space-x-2 mb-6">
                <div className="h-1 w-16 bg-gradient-to-r from-transparent via-stone-400 to-transparent rounded-full"></div>
                <div className="w-2 h-2 bg-stone-400 rounded-full"></div>
                <div className="h-1 w-10 bg-gradient-to-r from-stone-400 via-stone-300 to-transparent rounded-full"></div>
              </div>
            </div>
            
            {/* 描述信息区域 - 极简设计 */}
            {description && (
              <div className="relative">
                <p className="text-lg md:text-xl text-stone-700 font-medium leading-relaxed max-w-3xl">
                  {description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 图片区域 - 页面下部，简约布局 */}
        <div className="h-1/3 px-16 pb-8">
          <div className="h-full grid grid-cols-6 gap-3">
            {/* 第一张图片 - 稍大一些 */}
            <div className="col-span-2">
              <ImageContainer 
                image={image1} 
                imageKey="image1"
              />
            </div>
            
            {/* 第二张图片 */}
            <div className="col-span-1">
              <ImageContainer 
                image={image2} 
                imageKey="image2"
              />
            </div>
            
            {/* 第三张图片 */}
            <div className="col-span-1">
              <ImageContainer 
                image={image3} 
                imageKey="image3"
              />
            </div>
            
            {/* 第四张图片 */}
            <div className="col-span-1">
              <ImageContainer 
                image={image4} 
                imageKey="image4"
              />
            </div>
            
            {/* 第五张图片 */}
            <div className="col-span-1">
              <ImageContainer 
                image={image5} 
                imageKey="image5"
              />
            </div>
            
            {/* 第六张图片 - 占据底部一行 */}
            <div className="col-span-6 h-1/2 mt-3">
              <ImageContainer 
                image={image6} 
                imageKey="image6"
              />
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};
