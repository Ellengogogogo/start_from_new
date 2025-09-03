import React from 'react';

export interface DescriptionPageProps {
  description?: string;
  backgroundImage?: string;
  propertyName?: string;
  pageNumber?: string;
  backgroundColor?: 'white' | 'gradient' | 'gray';
  className?: string;
}

export const DescriptionPage: React.FC<DescriptionPageProps> = ({
  description,
  backgroundImage,
  propertyName,
  pageNumber = '4 / 12',
  backgroundColor = 'gray',
  className = ''
}) => {
  // 背景样式配置 - 低饱和度
  const backgroundClasses = {
    white: 'bg-white',
    gradient: 'bg-gradient-to-br from-stone-50/40 via-slate-50/30 to-gray-50/40',
    gray: 'bg-stone-50'
  };

  // 默认描述文本
  const defaultDescription = 'Dies ist eine hochwertige Immobilie in einer erstklassigen Lage mit ausgezeichneter Verkehrsanbindung. Die Wohnung ist durchdacht gestaltet, bietet viel Tageslicht und verfügt über eine vollständige Ausstattung. Die Umgebung ist wunderschön, das Leben ist bequem und es ist eine ideale Wahl zum Wohnen. Die Immobilie ist gut gepflegt, die Renovierungsqualität ist ausgezeichnet und sie kann direkt bezogen werden.';

  const displayDescription = description || defaultDescription;

  return (
    <section className={`page w-full h-screen flex flex-col justify-center items-center relative overflow-hidden ${backgroundClasses[backgroundColor]} ${className}`} style={{ pageBreakAfter: 'always' }}>
      
      {/* 背景设计元素 - 极简化 */}
      <div className="absolute inset-0 z-0">
        {/* 主背景渐变 - 低饱和度 */}
        <div className="absolute inset-0 bg-gradient-to-br from-stone-50/30 via-white/20 to-slate-50/30"></div>
      </div>

        {/* 主内容 - 杂志双栏布局 */}
        <div className="relative z-10 h-full grid grid-cols-12 gap-0">
          
          {/* 左侧 - 标题和装饰区域 */}
          <div className="col-span-7 flex flex-col justify-center px-16 py-20 relative">
          
          {/* 透明背景照片 */}
          <div className="absolute inset-0 z-0 opacity-10">
            <img
              src={backgroundImage || 'https://source.unsplash.com/800x600/?modern-house-interior'}
              alt="Background"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* 主标题区域 - 低饱和度设计 */}
          <div className="relative z-10 mb-12">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-1.5 h-1.5 bg-stone-400 rounded-full"></div>
              <div className="text-xs text-stone-500 uppercase tracking-wider font-medium">
                Premium Immobilie
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[0.9] mb-6 text-stone-800">
              Objektbeschreibung
            </h1>
            
            {/* 简约装饰线条 */}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-stone-300 rounded-full"></div>
              <div className="h-0.5 w-16 bg-stone-300 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
            </div>
          </div>
          
                      {/* 简约引用 */}
            <div className="relative z-10 text-sm text-stone-600 italic leading-relaxed font-medium">
              Eine durchdachte Präsentation hochwertiger Immobilien
            </div>
        </div>
        
                  {/* 右侧 - 内容区域 */}
          <div className="col-span-5 flex flex-col justify-center px-16 py-20">
          
          {/* 主要描述文本 - 去卡片化，自适应字体 */}
          <div className="relative">
            
            {/* 文本内容 - 直接显示，无包装容器 */}
            <div className="relative z-10">
              
              {/* 描述文字 - 根据字数自适应字体大小 */}
              <div className="prose prose-lg prose-stone max-w-none">
                <p className={`leading-relaxed font-medium text-justify text-stone-700
                              ${displayDescription.length > 300 ? 'text-sm' : 
                                displayDescription.length > 200 ? 'text-base' : 
                                displayDescription.length > 150 ? 'text-lg' : 'text-xl'}`}>
                  {displayDescription}
                </p>
              </div>
              
              {/* 底部特色标签 - 低饱和度设计 */}
              <div className="flex flex-wrap gap-3 mt-8">
                <div className="bg-stone-100 text-stone-700 px-4 py-2 rounded-full text-sm font-medium">
                  Premium Lage
                </div>
                <div className="bg-slate-100 text-slate-700 px-4 py-2 rounded-full text-sm font-medium">
                  Hochwertig
                </div>
                <div className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">
                  Bezugsfertig
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};
