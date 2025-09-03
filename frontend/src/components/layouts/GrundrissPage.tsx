import React, { useState } from 'react';

export interface GrundrissPageProps {
  image: {
    url: string;
    category: string;
    alt?: string;
  };
  title: string;
  roomStats: {
    totalRooms: number;
    bedrooms: number;
    bathrooms: number;
    livingRooms?: number;
    kitchens?: number;
    balconies?: number;
  };
  propertyName?: string;
  pageNumber?: string;
  className?: string;
}

export const GrundrissPage: React.FC<GrundrissPageProps> = ({
  image,
  title,
  roomStats,
  propertyName,
  pageNumber = '1 / 12',
  className = ''
}) => {
  const [imageState, setImageState] = useState({
    isLoading: true,
    hasError: false
  });

  const handleImageLoad = () => {
    setImageState(prev => ({ ...prev, isLoading: false }));
  };

  const handleImageError = () => {
    setImageState(prev => ({ ...prev, isLoading: false, hasError: true }));
  };

  return (
    <div className={`grundriss-page w-full h-screen relative overflow-hidden ${className}`}>
      
      {/* 背景渐变 - 低饱和度 */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-50/40 via-slate-50/30 to-gray-50/40"></div>
      
      {/* 主内容区域 */}
      <div className="relative z-10 h-full flex">
        
        {/* 左侧统计信息区域 - 占1/3宽度 */}
        <div className="w-1/3 flex flex-col justify-center px-16 py-20">
          
          {/* 内容区域 - 无边界融合设计 */}
          <div className="max-w-3xl">
            
            {/* 动态装饰元素 - 背景几何图形 */}
            <div className="absolute -left-8 top-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute -left-4 top-40 w-20 h-20 bg-stone-500/20 rounded-full blur-lg"></div>
            
            {/* 主标题区域 - 极简设计 */}
            <div className="relative mb-12">
              {/* 房间类型标签 */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-2 h-2 bg-stone-400 rounded-full"></div>
                <div className="text-sm text-stone-500 uppercase tracking-wider font-medium">
                  {image.category}
                </div>
              </div>
              
              {/* 标题文字 - 极简排版 */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-none mb-8
                             text-stone-800 drop-shadow-sm">
                {title}
              </h1>
              
              {/* 简单装饰线条 */}
              <div className="flex items-center space-x-2 mb-8">
                <div className="h-1 w-16 bg-gradient-to-r from-transparent via-stone-400 to-transparent rounded-full"></div>
                <div className="w-2 h-2 bg-stone-400 rounded-full"></div>
                <div className="h-1 w-10 bg-gradient-to-r from-stone-400 via-stone-300 to-transparent rounded-full"></div>
              </div>
            </div>
            
            {/* 房间统计信息区域 - 极简列表设计 */}
            <div className="relative">
              {/* 统计标题 */}
              <h2 className="text-lg text-stone-600 font-medium mb-6 tracking-wide">
                Ausstattung
              </h2>
              
              {/* 统计项目列表 - 无边界设计 */}
              <div className="space-y-4">
                {/* 总房间数 */}
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-stone-400 rounded-full"></div>
                  <span className="text-stone-700 font-medium">
                    {roomStats.totalRooms} Räume gesamt
                  </span>
                </div>
                
                {/* 卧室数量 */}
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-stone-400 rounded-full"></div>
                  <span className="text-stone-700 font-medium">
                    {roomStats.bedrooms} Schlafzimmer
                  </span>
                </div>
                
                {/* 洗手间数量 */}
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-stone-400 rounded-full"></div>
                  <span className="text-stone-700 font-medium">
                    {roomStats.bathrooms} Badezimmer
                  </span>
                </div>
                
                {/* 客厅数量（如果有） */}
                {roomStats.livingRooms && roomStats.livingRooms > 0 && (
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-stone-400 rounded-full"></div>
                    <span className="text-stone-700 font-medium">
                      {roomStats.livingRooms} Wohnzimmer
                    </span>
                  </div>
                )}
                
                {/* 厨房数量（如果有） */}
                {roomStats.kitchens && roomStats.kitchens > 0 && (
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-stone-400 rounded-full"></div>
                    <span className="text-stone-700 font-medium">
                      {roomStats.kitchens} Küche
                    </span>
                  </div>
                )}
                
                {/* 阳台数量（如果有） */}
                {roomStats.balconies && roomStats.balconies > 0 && (
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-stone-400 rounded-full"></div>
                    <span className="text-stone-700 font-medium">
                      {roomStats.balconies} Balkon
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 右侧平面图区域 - 占2/3宽度，居中显示 */}
        <div className="w-2/3 flex items-center justify-center px-16 py-20">
          
            {/* 图片容器 - 居中显示，完全去卡片化 */}
           <div className="relative w-full max-w-4xl aspect-square">
             
             {/* 加载状态 - 低饱和度，无圆角 */}
             {imageState.isLoading && (
               <div className="absolute inset-0 bg-stone-100 animate-pulse flex items-center justify-center z-10">
                 <div className="w-16 h-16 border-4 border-stone-400 border-t-transparent rounded-full animate-spin"></div>
               </div>
             )}
             
             {/* 错误状态 - 低饱和度，无圆角 */}
             {imageState.hasError && (
               <div className="absolute inset-0 bg-slate-100 flex items-center justify-center z-10">
                 <div className="text-center text-slate-600">
                   <div className="w-16 h-16 mx-auto mb-2 bg-slate-300 flex items-center justify-center">
                     <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                     </svg>
                   </div>
                   <p className="text-sm">Grundriss konnte nicht geladen werden</p>
                 </div>
               </div>
             )}
             
             {/* 平面图图片 - 完全去卡片化，无圆角无阴影 */}
             <img
               src={image.url}
               alt={image.alt || 'Grundriss'}
               className={`w-full h-full object-contain transition-all duration-300 ${
                 imageState.isLoading ? 'opacity-0' : 'opacity-100'
               }`}
               onLoad={handleImageLoad}
               onError={handleImageError}
               loading="lazy"
             />
           </div>
        </div>
      </div>


    </div>
  );
};
