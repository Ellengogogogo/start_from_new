import React, { useState } from 'react';

export interface FourImagesProps {
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

export const FourImagesRoom: React.FC<FourImagesProps> = ({
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
    image4: { isLoading: true, hasError: false }
  });

  if (!images || images.length < 4) {
    return null;
  }

  const [image1, image2, image3, image4] = images;

  const handleImageLoad = (imageKey: 'image1' | 'image2' | 'image3' | 'image4') => {
    setImageStates(prev => ({
      ...prev,
      [imageKey]: { ...prev[imageKey], isLoading: false }
    }));
  };

  const handleImageError = (imageKey: 'image1' | 'image2' | 'image3' | 'image4') => {
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
    imageKey: 'image1' | 'image2' | 'image3' | 'image4'; 
    className?: string; 
  }) => {
    const state = imageStates[imageKey];
    
    return (
      <div className={`relative h-full ${className}`}>
        {/* 加载状态 - 低饱和度 */}
        {state.isLoading && (
          <div className="absolute inset-0 bg-stone-100 animate-pulse flex items-center justify-center z-10">
            <div className="w-10 h-10 border-4 border-stone-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* 错误状态 - 低饱和度 */}
        {state.hasError && (
          <div className="absolute inset-0 bg-slate-100 flex items-center justify-center z-10">
            <div className="text-center text-slate-600">
              <div className="w-10 h-10 mx-auto mb-1 bg-slate-300 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    <div className={`four-images w-full h-screen relative overflow-hidden ${className}`}>
      
      {/* 背景渐变 - 低饱和度 */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-50/40 via-slate-50/30 to-gray-50/40"></div>
      
      {/* 主内容区域 - 左右分栏布局 */}
      <div className="relative z-10 h-full grid grid-cols-12 gap-0">
        
        {/* 左侧内容区域 - 占1/3宽度 */}
        <div className="col-span-4 flex flex-col justify-center px-16 py-20">
          
          {/* 内容区域 - 无边界融合设计 */}
          <div className="max-w-3xl">
            
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
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black leading-none mb-6
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
                <p className="text-base md:text-lg text-stone-700 font-medium leading-relaxed">
                  {description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 右侧图片区域 - 占2/3宽度，2x2网格布局，图片更小，间隙更大 */}
        <div className="col-span-8 relative flex items-center justify-center">
          <div className="w-full max-w-5xl grid grid-cols-2 grid-rows-2 gap-6 p-12">
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
            <div className="aspect-[4/3]">
              <ImageContainer 
                image={image3} 
                imageKey="image3"
              />
            </div>
            <div className="aspect-[4/3]">
              <ImageContainer 
                image={image4} 
                imageKey="image4"
              />
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};
