import React, { useState } from 'react';

export interface AgendaPageProps {
  agendaItems?: string[];
  backgroundImage?: string;
  propertyName?: string;
  pageNumber?: string;
  backgroundColor?: 'white' | 'gradient' | 'gray';
  className?: string;
}

export const AgendaPage: React.FC<AgendaPageProps> = ({
  agendaItems,
  backgroundImage,
  propertyName,
  pageNumber = '2 / 12',
  backgroundColor = 'white',
  className = ''
}) => {
  // 背景样式配置
  const backgroundClasses = {
    white: 'bg-white',
    gradient: 'bg-gradient-to-br from-gray-50 to-gray-100',
    gray: 'bg-gray-100'
  };

  // 默认议程项目
  const defaultAgendaItems = [
    'Immobilienübersicht',
    'Eckdaten',
    'Objektbeschreibung',
    'Lagebeschreibung',
    'Wohnzimmer',
    'Küche',
    'Schlafzimmer & Arbeitszimmer',
    'Bad',
    'Balkon & Draußen',
    'Grundriss',
    'Kontaktinformationen'
  ];

  // 默认背景图片
  const defaultBackgroundImage = 'https://source.unsplash.com/800x600/?house-interior';

  const displayAgendaItems = agendaItems || defaultAgendaItems;
  
  // 确定要显示的图片URL
  const imageUrl = backgroundImage || defaultBackgroundImage;
  
  // 调试信息
  console.log('AgendaPage props:', { backgroundImage, imageUrl });

  return (
    <section className={`page w-full h-screen flex flex-col justify-center items-center relative overflow-hidden ${backgroundClasses[backgroundColor]} ${className}`} style={{ pageBreakAfter: 'always' }}>
      
      {/* 右侧背景图片 - 占满整个右侧 */}
      <div className="absolute right-0 top-0 w-1/2 h-full z-0">
        <img
          src={imageUrl}
          alt="Property Interior"
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== defaultBackgroundImage) {
              console.log('Image failed to load, falling back to default:', target.src);
              target.src = defaultBackgroundImage;
            }
          }}
        />
        
        {/* 右侧渐变遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-l from-white/20 via-transparent to-transparent"></div>
      </div>

      {/* 左侧内容区域 */}
      <div className="relative z-10 w-1/2 h-full flex flex-col px-16 py-20">
        
                 {/* 标题区域 - 极简设计 */}
         <div className="mb-12">
           <div className="mb-4">
             <div className="flex items-center space-x-2 mb-2">
               <div className="w-1.5 h-1.5 bg-stone-400 rounded-full"></div>
               <div className="text-xs text-stone-500 uppercase tracking-wider font-medium">
                 Übersicht
               </div>
             </div>
             
             <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[0.9] text-stone-800">
               Agenda
             </h1>
           </div>
           
           {/* 简约装饰线 */}
           <div className="flex items-center space-x-2">
             <div className="w-2 h-2 bg-stone-300 rounded-full"></div>
             <div className="h-0.5 w-12 bg-stone-300 rounded-full"></div>
             <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
           </div>
         </div>
         
         {/* 议程列表 - 超简洁设计 */}
         <div className="flex-1">
           <div className="space-y-3">
             {displayAgendaItems.map((item, index) => (
               <div key={index} className="group">
                 <div className="flex items-center space-x-4 hover:translate-x-1 transition-transform duration-200">
                   {/* 序号 - 超简洁设计 */}
                   <div className="w-6 h-6 bg-stone-100 rounded-full flex items-center justify-center
                                   group-hover:bg-stone-200 transition-colors duration-200">
                     <span className="text-xs font-bold text-stone-600 group-hover:text-stone-800">
                       {index + 1}
                     </span>
                   </div>
                   
                   {/* 议程项目文字 - 直接显示 */}
                   <div className="flex-1">
                     <h3 className="text-sm font-semibold text-stone-800 leading-tight 
                                    group-hover:text-stone-900 transition-colors duration-200">
                       {item}
                     </h3>
                   </div>
                   
                   {/* 极简箭头 */}
                   <div className="w-3 h-3 text-stone-400 group-hover:text-stone-600 
                                   group-hover:translate-x-0.5 transition-all duration-200">
                     <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                     </svg>
                   </div>
                 </div>
               </div>
             ))}
           </div>
         </div>
      </div>

    </section>
  );
};