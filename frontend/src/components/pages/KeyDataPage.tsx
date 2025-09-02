import React from 'react';

export interface KeyDataPageProps {
  keyFacts?: {
    baujahr?: string;
    wohnflaeche?: string;
    zimmer?: string;
    schlafzimmer?: string;
    badezimmer?: string;
    heizungssystem?: string;
    energieklasse?: string;
    energietraeger?: string;
    parkplatz?: string;
    renovierungsqualitaet?: string;
    bodenbelag?: string;
    // 新增字段
    grundstuecksgroesse?: string;
    balkon_garten?: string;
    energieverbrauch?: string;
    energieausweis_typ?: string;
    energieausweis_gueltig_bis?: string;
    einbaukueche?: string;
  };
  price?: number;
  propertyName?: string;
  pageNumber?: string;
  backgroundColor?: 'white' | 'gradient' | 'gray';
  className?: string;
}

export const KeyDataPage: React.FC<KeyDataPageProps> = ({
  keyFacts,
  price,
  propertyName,
  pageNumber = '3 / 12',
  backgroundColor = 'white',
  className = ''
}) => {
  // 背景样式配置 - 低饱和度
  const backgroundClasses = {
    white: 'bg-white',
    gradient: 'bg-gradient-to-br from-stone-50/40 via-slate-50/30 to-gray-50/40',
    gray: 'bg-stone-50'
  };

  // 默认关键数据
  const defaultKeyFacts = {
    baujahr: '2020',
    wohnflaeche: '120 m²',
    zimmer: '5',
    schlafzimmer: '3',
    badezimmer: '2',
    heizungssystem: 'Fußbodenheizung',
    energieklasse: 'A',
    energietraeger: 'Erdgas',
    parkplatz: 'Garage',
    renovierungsqualitaet: 'Hochwertig',
    bodenbelag: 'Parkett',
    // 新增字段默认值
    grundstuecksgroesse: '500 m²',
    balkon_garten: 'Balkon + Garten',
    energieverbrauch: '120 kWh/m²',
    energieausweis_typ: 'Verbrauchsausweis',
    energieausweis_gueltig_bis: '2025-12-31',
    einbaukueche: 'Ja'
  };

  const displayKeyFacts = { ...defaultKeyFacts, ...keyFacts };

  // 数据项配置 - 三列布局
  const leftColumnData = [
    { label: 'Baujahr', value: displayKeyFacts.baujahr },
    { label: 'Wohnfläche', value: displayKeyFacts.wohnflaeche },
    { label: 'Grundstücksgröße', value: displayKeyFacts.grundstuecksgroesse },
    { label: 'Zimmer', value: displayKeyFacts.zimmer },
    { label: 'Schlafzimmer', value: displayKeyFacts.schlafzimmer },
    { label: 'Badezimmer', value: displayKeyFacts.badezimmer },
    { label: 'Einbauküche', value: displayKeyFacts.einbaukueche }
  ];

  const rightColumnData = [
    { label: 'Balkon/Garten', value: displayKeyFacts.balkon_garten },
    { label: 'Parkplatz', value: displayKeyFacts.parkplatz },
    { label: 'Bodenbelag', value: displayKeyFacts.bodenbelag },
    { label: 'Heizungssystem', value: displayKeyFacts.heizungssystem },
    { label: 'Renovierungsqualität', value: displayKeyFacts.renovierungsqualitaet },
    { label: 'Energieklasse', value: displayKeyFacts.energieklasse },
    { label: 'Energieträger', value: displayKeyFacts.energietraeger },
  ];

  // 第三列：价格和能源信息
  const thirdColumnData = [
    { label: 'Energieverbrauch', value: displayKeyFacts.energieverbrauch },
    { label: 'Energieausweis', value: displayKeyFacts.energieausweis_typ },
    { label: 'Energieausweis gültig bis', value: displayKeyFacts.energieausweis_gueltig_bis },
    { label: 'Preis', value: price ? `€${price.toLocaleString()}` : 'Auf Anfrage' },
    { label: 'Preis pro m²', value: price && displayKeyFacts.wohnflaeche ? 
      `€${Math.round(price / parseFloat(displayKeyFacts.wohnflaeche.replace(' m²', '').replace('N/A', '0')))}` : '-' },
  ];

  return (
    <div className={`key-data-page w-full h-screen relative overflow-hidden ${backgroundClasses[backgroundColor]} ${className}`}>
      
      {/* 主内容区域 - 极简左右对分布局 */}
      <div className="relative z-10 h-full flex flex-col px-16 py-20">
        
        {/* 页面标题区域 - 小标题设计 */}
        <div className="mb-12">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-1.5 h-1.5 bg-stone-400 rounded-full"></div>
            <div className="text-xs text-stone-500 uppercase tracking-wider font-medium">
              Übersicht
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black leading-[0.9] text-stone-800">
            Eckdaten
          </h1>
          
          {/* 简约装饰线 */}
          <div className="flex items-center space-x-2 mt-4">
            <div className="w-2 h-2 bg-stone-300 rounded-full"></div>
            <div className="h-0.5 w-16 bg-stone-300 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
          </div>
        </div>
        
        {/* 数据表格区域 - 三列布局 */}
        <div className="flex-1">
          <div className="grid grid-cols-3 gap-x-12 gap-y-6">
            
            {/* 左列数据 */}
            <div className="space-y-4">
              {leftColumnData.map((item, index) => (
                <div key={index} className="group">
                  <div className="flex items-center justify-between py-2 hover:translate-x-1 transition-transform duration-200">
                    {/* 标签 */}
                    <div className="text-sm text-stone-600 font-medium tracking-wide">
                      {item.label}
                    </div>
                    
                    {/* 数值 */}
                    <div className="text-lg font-bold text-stone-800 group-hover:text-stone-900 transition-colors duration-200">
                      {item.value}
                    </div>
                  </div>
                  
                  {/* 简约分隔线 */}
                  <div className="h-px bg-stone-200 group-hover:bg-stone-300 transition-colors duration-200"></div>
                </div>
              ))}
            </div>
            
            {/* 中列数据 */}
            <div className="space-y-4">
              {rightColumnData.map((item, index) => (
                <div key={index} className="group">
                  <div className="flex items-center justify-between py-2 hover:translate-x-1 transition-transform duration-200">
                    {/* 标签 */}
                    <div className="text-sm text-stone-600 font-medium tracking-wide">
                      {item.label}
                    </div>
                    
                    {/* 数值 */}
                    <div className="text-lg font-bold text-stone-800 group-hover:text-stone-900 transition-colors duration-200">
                      {item.value}
                    </div>
                  </div>
                  
                  {/* 简约分隔线 */}
                  <div className="h-px bg-stone-200 group-hover:bg-stone-300 transition-colors duration-200"></div>
                </div>
              ))}
            </div>

            {/* 第三列：价格和新字段 */}
            <div className="space-y-4">
              {thirdColumnData.map((item, index) => (
                <div key={index} className="group">
                  <div className="flex items-center justify-between py-2 hover:translate-x-1 transition-transform duration-200">
                    {/* 标签 */}
                    <div className="text-sm text-stone-600 font-medium tracking-wide">
                      {item.label}
                    </div>
                    
                    {/* 数值 */}
                    <div className="text-lg font-bold text-stone-800 group-hover:text-stone-900 transition-colors duration-200">
                      {item.value}
                    </div>
                  </div>
                  
                  {/* 简约分隔线 */}
                  <div className="h-px bg-stone-200 group-hover:bg-stone-300 transition-colors duration-200"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 现代页脚 - 透明渐变，无边界设计 */}
      <div className="absolute bottom-0 left-0 right-0 z-30">
        <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-white/20 to-transparent"></div>
        <div className="relative z-10 h-16 flex items-center justify-between px-16">
          <div className="text-stone-700 font-medium">
            {propertyName || 'Premium Immobilie'}
          </div>
          <div className="flex items-center space-x-3">
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
