import React, { useState } from 'react';

export interface LocationDescriptionPageProps {
  locationDescription?: string;
  locationImage?: string;
  propertyName?: string;
  pageNumber?: string;
  backgroundColor?: 'white' | 'gradient' | 'gray';
  className?: string;
  cityName?: string; // 新增城市名称属性
}

export const LocationDescriptionPage: React.FC<LocationDescriptionPageProps> = ({
  locationDescription,
  locationImage,
  propertyName,
  pageNumber = '10 / 12',
  backgroundColor = 'white',
  className = '',
  cityName = 'Berlin' // 默认城市名称
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

  // 背景样式配置 - 低饱和度
  const backgroundClasses = {
    white: 'bg-white',
    gradient: 'bg-gradient-to-br from-stone-50/40 via-slate-50/30 to-gray-50/40',
    gray: 'bg-stone-50'
  };

  // 默认位置描述
  const defaultLocationItems = [
    'Einkaufszentrum 5 Minuten zu Fuß',
    'Viele Restaurants und Cafés',
    'Hochwertige Schulressourcen',
    'Krankenhauseinrichtungen vollständig',
    'Stadtzentrum verkehrsgünstig gelegen',
    'Parks und Grünflächen in der Nähe'
  ];

  // 默认地图图片
  const defaultLocationImage = 'https://source.unsplash.com/800x600/?city-map';

  return (
    <div className={`location-description-page w-full h-screen relative overflow-hidden ${backgroundClasses[backgroundColor]} ${className}`}>
      
      {/* 主内容 - 极简布局：左侧文字，右侧标题+背景图 */}
      <div className="relative z-10 h-full grid grid-cols-12 gap-0">
        
        {/* 左侧 - 位置描述文字 (60%) */}
        <div className="col-span-7 flex flex-col justify-center px-16 py-20">
          
          {/* 标题区域 - 极简设计 */}
          <div className="mb-12">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-1.5 h-1.5 bg-stone-400 rounded-full"></div>
              <div className="text-xs text-stone-500 uppercase tracking-wider font-medium">
                {cityName}
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[0.9] text-stone-800">
              Lagebeschreibung
            </h1>
            {/* 简单装饰线 */}
            <div className="flex items-center space-x-2 mt-4">
              <div className="w-2 h-2 bg-stone-300 rounded-full"></div>
              <div className="h-0.5 w-16 bg-stone-300 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
            </div>
          </div>
          
          {/* 位置描述内容 - 去卡片化，直接列出 */}
          <div className="flex-1">
            {locationDescription ? (
              // 自定义描述 - 直接显示，无包装容器，字体大小根据字数调整
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-stone-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className={`leading-relaxed text-justify font-medium text-stone-700
                                 ${locationDescription.length > 300 ? 'text-sm' :
                                   locationDescription.length > 200 ? 'text-base' :
                                   locationDescription.length > 150 ? 'text-lg' : 'text-xl'}`}>
                    {locationDescription}
                  </p>
                </div>
              </div>
            ) : (
              // 默认优势列表 - 极简列表，无包装容器，字体大小根据字数调整
              <div className="space-y-4">
                {defaultLocationItems.map((item, index) => (
                  <div key={index} className="group">
                    <div className="flex items-start space-x-4 py-2 hover:translate-x-1 transition-transform duration-200">
                      
                      {/* 文字内容 - 字体大小根据字数调整 */}
                      <p className={`font-medium flex-1 group-hover:text-stone-900 transition-colors duration-200 text-stone-700
                                    ${item.length > 50 ? 'text-sm' :
                                      item.length > 30 ? 'text-base' : 'text-lg'}`}>
                        {item}
                      </p>
                    </div>
                    {/* 简单分隔线 */}
                    <div className="h-px bg-stone-200 group-hover:bg-stone-300 transition-colors duration-200 ml-6"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* 右侧 - 标题+背景图片 (40%) */}
        <div className="col-span-5 relative">
          
          {/* 背景图片 - 透明度处理 */}
          <div className="absolute inset-0 z-0">
            <img
              src={locationImage || defaultLocationImage}
              alt="Standort Hintergrund"
              className="w-full h-full object-cover opacity-25"
            />
            {/* 低饱和度遮罩 */}
            <div className="absolute inset-0 bg-gradient-to-br from-stone-50/50 via-slate-50/30 to-gray-50/50"></div>
          </div>
          
          {/* 右侧标题内容 - 覆盖在背景图上 */}
          <div className="relative z-10 h-full flex flex-col justify-center px-16 py-20">
            
            {/* 右侧标题区域 */}
            <div className="text-right">
              <div className="flex items-center justify-end space-x-2 mb-4">
                <div className="text-xs text-stone-500 uppercase tracking-wider font-medium">
                  Premium
                </div>
                <div className="w-1.5 h-1.5 bg-stone-400 rounded-full"></div>
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black leading-[0.9] text-stone-800 mb-6">
                {cityName}
              </h2>
              
              {/* 位置特征标签 */}
              <div className="flex flex-wrap gap-3 justify-end">
                <div className="bg-stone-100/80 text-stone-700 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                  Zentrale Lage
                </div>
                <div className="bg-slate-100/80 text-slate-700 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                  Verkehrsgünstig
                </div>
                <div className="bg-gray-100/80 text-gray-700 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                  Premium Umgebung
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>



    </div>
  );
};
