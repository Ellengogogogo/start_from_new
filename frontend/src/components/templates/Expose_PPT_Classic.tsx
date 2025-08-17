import React from 'react';

export interface ExposePPTData {
  // 基本信息
  propertyName: string;
  title: string;
  address: string;
  
  // 议程
  agendaItems: string[];
  
  // 关键数据
  keyFacts: {
    baujahr?: string;
    wohnflaeche?: string;
    zimmer?: string;
    schlafzimmer?: string;
    badezimmer?: string;
    heizungssystem?: string;
    energieklasse?: string;
  };
  
  // 描述
  description: string;
  
  // 图片
  images: Array<{
    id: string;
    url: string;
    alt: string;
  }>;
  
  // 位置信息
  locationText: string;
  locationImage: string;
  
  // 平面图
  floorPlanImage: string;
  floorPlanDetails: string[];
  
  // 联系信息
  contacts: Array<{
    name: string;
    phone: string;
    email: string;
    avatar: string;
  }>;
  
  // 样式配置
  accentColor?: string;
}

export interface Expose_PPT_ClassicProps {
  data: ExposePPTData;
  className?: string;
  showNavigation?: boolean;
  onPrint?: () => void;
  onShare?: () => void;
  onContact?: () => void;
}

const Expose_PPT_Classic: React.FC<Expose_PPT_ClassicProps> = ({
  data,
  className = '',
  showNavigation = true,
  onPrint,
  onShare,
  onContact,
}) => {
  const accentColor = data.accentColor || '#3B82F6';
  
  // 构建完整的图片URL
  const getFullImageUrl = (url: string): string => {
    // 如果URL已经是完整的HTTP URL，直接返回
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // 如果是相对路径，构建完整URL
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    return `${baseUrl}${url}`;
  };
  
  // 打印样式
  const printStyles = `
    @media print {
      .slide { 
        page-break-after: always; 
        margin: 0; 
        padding: 24px; 
      }
      .slide:last-child { 
        page-break-after: auto; 
      }
      .no-print { display: none !important; }
    }
    
    /* 幻灯片边界样式 */
    .slide {
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      margin-bottom: 2rem;
      position: relative;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    
    /* Footer 样式 */
    .slide-footer {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 60px;
      background: linear-gradient(to top, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.8));
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 24px;
      font-size: 14px;
      color: #6b7280;
    }
    
    .footer-left {
      font-weight: 500;
      color: #374151;
    }
    
    .footer-right {
      font-weight: 600;
      color: #3b82f6;
      background: rgba(59, 130, 246, 0.1);
      padding: 4px 12px;
      border-radius: 12px;
    }
  `;

  return (
    <div className={`expose-ppt-container ${className}`}>
      <style jsx>{printStyles}</style>
      
      {/* 导航栏 */}
      {showNavigation && (
        <div className="no-print sticky top-0 z-40 bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">PowerPoint Stil Exposé</h2>
            <div className="flex gap-3">
              <button
                onClick={onShare}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                 Teilen
               </button>
               <button
                 onClick={onPrint}
                 className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
               >
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z" />
                 </svg>
                 Drucken/PDF exportieren
               </button>
             </div>
           </div>
         </div>
       )}

      {/* 幻灯片容器 */}
      <div className="slides-container">
        
        {/* 第1页 - 封面页 */}
        <div className="slide w-full h-screen bg-cover bg-center bg-no-repeat relative" 
             style={{ 
               backgroundImage: `url(${data.images?.[0]?.url ? getFullImageUrl(data.images[0].url) : 'https://source.unsplash.com/1920x1080/?modern-house'})`,
               aspectRatio: '16/9',
               minHeight: '1080px'
             }}>
          {/* 底部白色覆盖条 */}
          <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-95 p-8">
            <div className="text-center">
              <h1 className="text-5xl font-serif font-bold text-gray-900 mb-4">
                {data.title || 'Professionelle Immobilienpräsentation'}
              </h1>
              <p className="text-xl text-gray-600 font-sans">
                {data.address || 'Adressinformationen'}
              </p>
            </div>
          </div>
          
          {/* Footer */}
          <div className="slide-footer">
            <div className="footer-left">
              {data.propertyName || 'Immobilienname'}
            </div>
            <div className="footer-right">
              1 / 8
            </div>
          </div>
        </div>

        {/* 第2页 - 议程 */}
        <div className="slide w-full h-screen bg-white p-12 flex items-center pb-20" 
             style={{ aspectRatio: '16/9', minHeight: '1080px' }}>
          <div className="w-full max-w-7xl mx-auto grid grid-cols-2 gap-16 items-center">
            {/* 左侧议程 */}
            <div>
              <h2 className="text-4xl font-serif font-bold text-gray-900 mb-8">Agenda</h2>
              <ol className="space-y-4">
                {data.agendaItems?.map((item, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                      {index + 1}
                    </span>
                    <span className="text-xl text-gray-700 font-medium">{item}</span>
                  </li>
                )) || [
                  'Immobilienübersicht',
                  'Eckdaten',
                  'Immobiliendetails',
                  'Bildergalerie',
                  'Lagebeschreibung',
                  'Grundriss',
                  'Kontaktinformationen'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                      {index + 1}
                    </span>
                    <span className="text-xl text-gray-700 font-medium">{item}</span>
                  </li>
                ))}
              </ol>
            </div>
            
            {/* 右侧图片 */}
            <div className="flex justify-center">
              <div className="w-80 h-60 bg-gray-200 rounded-lg shadow-lg overflow-hidden">
                <img 
                  src={data.images?.[1]?.url ? getFullImageUrl(data.images[1].url) : 
                       data.images?.[0]?.url ? getFullImageUrl(data.images[0].url) : 
                       'https://source.unsplash.com/800x600/?house-interior'} 
                  alt="Immobilienbild"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://source.unsplash.com/800x600/?house-interior';
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="slide-footer">
            <div className="footer-left">
              {data.propertyName || 'Immobilienname'}
            </div>
            <div className="footer-right">
              2 / 8
            </div>
          </div>
        </div>

        {/* 第3页 - 关键数据 */}
        <div className="slide w-full h-screen bg-white p-12 flex items-center pb-20" 
             style={{ aspectRatio: '16/9', minHeight: '1080px' }}>
          <div className="w-full max-w-4xl mx-auto">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-12 text-center">Eckdaten</h2>
            
            <div className="grid grid-cols-2 gap-8">
              {/* 左侧字段 */}
              <div className="space-y-6">
                <div className="text-right font-bold text-xl text-gray-700">Baujahr</div>
                <div className="text-right font-bold text-xl text-gray-700">Wohnfläche</div>
                <div className="text-right font-bold text-xl text-gray-700">Zimmer</div>
                <div className="text-right font-bold text-xl text-gray-700">Schlafzimmer</div>
                <div className="text-right font-bold text-xl text-gray-700">Badezimmer</div>
                <div className="text-right font-bold text-xl text-gray-700">Heizungssystem</div>
                <div className="text-right font-bold text-xl text-gray-700">Energieklasse</div>
              </div>
              
              {/* 右侧数值 */}
              <div className="space-y-6">
                <div className="text-left text-xl text-gray-600">{data.keyFacts?.baujahr || '2020'}</div>
                <div className="text-left text-xl text-gray-600">{data.keyFacts?.wohnflaeche || '120 m²'}</div>
                <div className="text-left text-xl text-gray-600">{data.keyFacts?.zimmer || '5'}</div>
                <div className="text-left text-xl text-gray-600">{data.keyFacts?.schlafzimmer || '3'}</div>
                <div className="text-left text-xl text-gray-600">{data.keyFacts?.badezimmer || '2'}</div>
                <div className="text-left text-xl text-gray-600">{data.keyFacts?.heizungssystem || 'Fußbodenheizung'}</div>
                <div className="text-left text-xl text-gray-600">{data.keyFacts?.energieklasse || 'A'}</div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="slide-footer">
            <div className="footer-left">
              {data.propertyName || 'Immobilienname'}
            </div>
            <div className="footer-right">
              3 / 8
            </div>
          </div>
        </div>

        {/* 第4页 - 房源描述 */}
        <div className="slide w-full h-screen bg-white p-12 flex items-center pb-20" 
             style={{ aspectRatio: '16/9', minHeight: '1080px' }}>
          <div className="w-full max-w-5xl mx-auto">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-12 text-center">Beschreibung</h2>
            
            <div className="bg-gray-50 rounded-lg p-8">
              <p className="text-xl text-gray-700 leading-relaxed text-justify">
                {data.description || 'Dies ist eine hochwertige Immobilie in einer erstklassigen Lage mit ausgezeichneter Verkehrsanbindung. Die Wohnung ist durchdacht gestaltet, bietet viel Tageslicht und verfügt über eine vollständige Ausstattung. Die Umgebung ist wunderschön, das Leben ist bequem und es ist eine ideale Wahl zum Wohnen. Die Immobilie ist gut gepflegt, die Renovierungsqualität ist ausgezeichnet und sie kann direkt bezogen werden.'}
                </p>
            </div>
          </div>
          
          {/* Footer */}
          <div className="slide-footer">
            <div className="footer-left">
              {data.propertyName || 'Immobilienname'}
            </div>
            <div className="footer-right">
              4 / 8
            </div>
          </div>
        </div>

        {/* 第5页 - 图片画廊 */}
        <div className="slide w-full h-screen bg-white p-12 flex items-center pb-20" 
             style={{ aspectRatio: '16/9', minHeight: '1080px' }}>
          <div className="w-full max-w-6xl mx-auto">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-12 text-center">Impressionen</h2>
            
            <div className="grid grid-cols-3 gap-6">
              {(data.images?.slice(0, 6) || Array(6).fill(null)).map((image, index) => (
                <div key={index} className="aspect-video bg-gray-200 rounded-lg shadow-lg overflow-hidden">
                  <img 
                    src={image?.url ? getFullImageUrl(image.url) : `https://source.unsplash.com/800x600/?house-${index + 1}`} 
                    alt={image?.alt || `Immobilienbild ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://source.unsplash.com/800x600/?house-${index + 1}`;
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Footer */}
          <div className="slide-footer">
            <div className="footer-left">
              {data.propertyName || 'Immobilienname'}
            </div>
            <div className="footer-right">
              5 / 8
            </div>
          </div>
        </div>

        {/* 第6页 - 位置信息 */}
        <div className="slide w-full h-screen bg-white p-12 flex items-center pb-20" 
             style={{ aspectRatio: '16/9', minHeight: '1080px' }}>
          <div className="w-full max-w-7xl mx-auto grid grid-cols-2 gap-16 items-center">
            {/* 左侧文字 */}
            <div>
              <h2 className="text-4xl font-serif font-bold text-gray-900 mb-8">Lagebeschreibung</h2>
              <div className="space-y-4 text-lg text-gray-700">
                <p>• Einkaufszentrum 5 Minuten zu Fuß</p>
                <p>• Viele Restaurants und Cafés</p>
                <p>• Hochwertige Schulressourcen</p>
                <p>• Krankenhauseinrichtungen vollständig</p>
                <p>• Stadtzentrum verkehrsgünstig gelegen</p>
                <p>• Parks und Grünflächen in der Nähe</p>
              </div>
            </div>
            
            {/* 右侧地图图片 */}
            <div className="flex justify-center">
              <div className="w-96 h-72 bg-gray-200 rounded-lg shadow-lg overflow-hidden">
                <img 
                  src={data.locationImage ? getFullImageUrl(data.locationImage) : 
                       data.images?.[0]?.url ? getFullImageUrl(data.images[0].url) : 
                       'https://source.unsplash.com/800x600/?city-map'} 
                  alt="Lagekarte"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://source.unsplash.com/800x600/?city-map';
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="slide-footer">
            <div className="footer-left">
              {data.propertyName || 'Immobilienname'}
            </div>
            <div className="footer-right">
              6 / 8
            </div>
          </div>
        </div>

        {/* 第7页 - 平面图 */}
        <div className="slide w-full h-screen bg-white p-12 flex items-center pb-20" 
             style={{ aspectRatio: '16/9', minHeight: '1080px' }}>
          <div className="w-full max-w-7xl mx-auto grid grid-cols-2 gap-16 items-center">
            {/* 左侧平面图 */}
            <div className="flex justify-center">
              <div className="w-96 h-72 bg-gray-200 rounded-lg shadow-lg overflow-hidden">
                <img 
                  src={data.floorPlanImage ? getFullImageUrl(data.floorPlanImage) : 
                       data.images?.[1]?.url ? getFullImageUrl(data.images[1].url) : 
                       'https://source.unsplash.com/800x600/?floor-plan'} 
                  alt="Grundriss"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://source.unsplash.com/800x600/?floor-plan';
                  }}
                />
              </div>
            </div>
            
            {/* 右侧详情 */}
            <div>
              <h2 className="text-4xl font-serif font-bold text-gray-900 mb-8">Grundriss Details</h2>
              <ul className="space-y-3 text-lg text-gray-700">
                {(data.floorPlanDetails || [
                  '3 Schlafzimmer, Hauptschlafzimmer mit eigenem Bad',
                  '2 Badezimmer, Trocken- und Nassbereich getrennt',
                  'Offene Küche, Essbereich integriert',
                  'Wohnzimmer geräumig, viel Tageslicht',
                  'Balkon verbindet Wohnzimmer und Hauptschlafzimmer',
                  'Abstellraum und Kleiderschrank vorhanden'
                ]).map((detail, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Footer */}
          <div className="slide-footer">
            <div className="footer-left">
              {data.propertyName || 'Immobilienname'}
            </div>
            <div className="footer-right">
              7 / 8
            </div>
          </div>
        </div>

        {/* 第8页 - 联系信息 */}
        <div className="slide w-full h-screen bg-white p-12 flex items-center pb-20" 
             style={{ aspectRatio: '16/9', minHeight: '1080px' }}>
          <div className="w-full max-w-5xl mx-auto">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-12 text-center">Kontakt</h2>
            
            <div className="grid grid-cols-2 gap-8">
              {(data.contacts || [
                {
                  name: 'Herr Zhang',
                  phone: '+86 138 0013 8000',
                  email: 'zhang@example.com',
                  avatar: '/placeholder-avatar.jpg'
                },
                {
                  name: 'Frau Li',
                  phone: '+86 139 0013 8001',
                  email: 'li@example.com',
                  avatar: '/placeholder-avatar.jpg'
                }
              ]).map((contact, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gray-300 rounded-full overflow-hidden">
                      <img 
                        src={contact.avatar ? getFullImageUrl(contact.avatar) : `https://source.unsplash.com/100x100/?portrait-${index + 1}`} 
                        alt={contact.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://source.unsplash.com/100x100/?portrait-${index + 1}`;
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{contact.name}</h3>
                      <p className="text-gray-600">Immobilienberater</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-700">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {contact.phone}
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {contact.email}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Footer */}
          <div className="slide-footer">
            <div className="footer-left">
              {data.propertyName || 'Immobilienname'}
            </div>
            <div className="footer-right">
              8 / 8
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Expose_PPT_Classic };
