import React from 'react';
import { DynamicImageLayout, LayoutImage } from '@/components/layouts';

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
    energietraeger?: string;
    parkplatz?: string;
    renovierungsqualitaet?: string;
    bodenbelag?: string;
  };
  
  // 描述
  description: string;
  
  // 图片
  images: Array<{
    id: string;
    url: string;
    category: string;
  }>;
  
  // 位置信息
  locationText: string;
  locationImage: string;
  locationDescription?: string; // Neu: Vom Benutzer eingegebene geografische Lagebeschreibung
  
  // 平面图相关信息
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
  
  // 代理信息
  agentInfo?: {
    companyLogo?: string;
    responsiblePerson: string;
    address: string;
    website?: string;
    phone: string;
    userType: string;
  };
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
  
  // 根据category筛选图片
  const getImagesByCategory = (category: string): string[] => {
    return data.images
      .filter(img => img.category === category)
      .map(img => img.url);
  };
  
  // 获取第一张指定类别的图片，如果没有则使用备用图片
  const getFirstImageByCategory = (category: string, fallbackUrl: string): string => {
    const categoryImages = getImagesByCategory(category);
    return categoryImages.length > 0 ? getFullImageUrl(categoryImages[0]) : fallbackUrl;
  };
  
  // 获取指定分类的图片并转换为LayoutImage格式
  const getLayoutImagesByCategory = (category: string): LayoutImage[] => {
    return data.images
      .filter(img => img.category === category)
      .map(img => ({
        id: img.id,
        url: getFullImageUrl(img.url),
        category: img.category
      }));
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
      font-family: "Garamond", "Times New Roman", serif;
    }
    
    /* 全局字体设置 */
    .expose-ppt-container {
      font-family: "Garamond", "Times New Roman", serif;
    }
    
    .expose-ppt-container * {
      font-family: "Garamond", "Times New Roman", serif;
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
      font-family: "Garamond", "Times New Roman", serif;
    }
    
    .footer-left {
      font-weight: 500;
      color: #374151;
      font-family: "Garamond", "Times New Roman", serif;
    }
    
    .footer-right {
      font-weight: 600;
      color: #3b82f6;
      background: rgba(59, 130, 246, 0.1);
      padding: 4px 12px;
      border-radius: 12px;
      font-family: "Garamond", "Times New Roman", serif;
    }
  `;

  return (
    <div className={`expose-ppt-container ${className}`} style={{ fontFamily: '"Garamond", "Times New Roman", serif' }}>
      <style jsx>{printStyles}</style>
      
      {/* 导航栏 */}
      {showNavigation && (
        <div className="no-print sticky top-0 z-40 bg-white border-b border-gray-200 px-6 py-4 shadow-sm" style={{ fontFamily: '"Garamond", "Times New Roman", serif' }}>
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
          <div className="w-full max-w-7xl mx-auto grid grid-cols-2 gap-16 items-center h-full">
            {/* 左侧议程 */}
            <div className="flex flex-col justify-center">
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
                  'Wohnzimmer',
                  'Küche',
                  'Schlafzimmer & Arbeitszimmer',
                  'Bad',
                  'Balkon & Draußen',
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
            
            {/* 右侧图片 - 占满整个右侧区域 */}
            <div className="h-full w-full rounded-lg shadow-lg overflow-hidden">
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
        <div className="slide w-full h-screen p-12 flex items-center pb-20" 
             style={{ aspectRatio: '16/9', minHeight: '1080px', backgroundColor: '#DCDCDC' }}>
          <div className="w-full max-w-6xl mx-auto">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-12 text-center">Eckdaten</h2>
            
            <div className="grid grid-cols-2 gap-16">
              {/* 左列 */}
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="font-bold text-lg text-gray-700">Baujahr</span>
                  <span className="text-lg text-gray-600">{data.keyFacts?.baujahr || '2020'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="font-bold text-lg text-gray-700">Wohnfläche</span>
                  <span className="text-lg text-gray-600">{data.keyFacts?.wohnflaeche || '120 m²'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="font-bold text-lg text-gray-700">Zimmer</span>
                  <span className="text-lg text-gray-600">{data.keyFacts?.zimmer || '5'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="font-bold text-lg text-gray-700">Schlafzimmer</span>
                  <span className="text-lg text-gray-600">{data.keyFacts?.schlafzimmer || '3'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="font-bold text-lg text-gray-700">Badezimmer</span>
                  <span className="text-lg text-gray-600">{data.keyFacts?.badezimmer || '2'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="font-bold text-lg text-gray-700">Heizungssystem</span>
                  <span className="text-lg text-gray-600">{data.keyFacts?.heizungssystem || 'Fußbodenheizung'}</span>
                </div>
              </div>
              
              {/* 右列 */}
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="font-bold text-lg text-gray-700">Energieklasse</span>
                  <span className="text-lg text-gray-600">{data.keyFacts?.energieklasse || 'A'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="font-bold text-lg text-gray-700">Energieträger</span>
                  <span className="text-lg text-gray-600">{data.keyFacts?.energietraeger || 'Erdgas'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="font-bold text-lg text-gray-700">Parkplatz</span>
                  <span className="text-lg text-gray-600">{data.keyFacts?.parkplatz || 'Garage'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="font-bold text-lg text-gray-700">Renovierungsqualität</span>
                  <span className="text-lg text-gray-600">{data.keyFacts?.renovierungsqualitaet || 'Hochwertig'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="font-bold text-lg text-gray-700">Bodenbelag</span>
                  <span className="text-lg text-gray-600">{data.keyFacts?.bodenbelag || 'Parkett'}</span>
                </div>
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
        <div className="slide w-full h-screen p-12 flex items-center pb-20" 
             style={{ aspectRatio: '16/9', minHeight: '1080px', backgroundColor: '#DCDCDC' }}>
          <div className="w-full max-w-5xl mx-auto">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-12 text-center">Object beschreibung</h2>
            
            <div className="bg-white rounded-lg p-8" style={{backgroundColor: '#DCDCDC'}}>
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

        {/* 第5页 - Wohnzimmer */}
        <div className="slide w-full h-screen bg-white p-12 flex items-center pb-20" 
             style={{ aspectRatio: '16/9', minHeight: '1080px' }}>
          <div className="w-full max-w-6xl mx-auto">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-8 text-center">Wohnzimmer</h2>
            
            <div className="grid grid-cols-2 gap-12 items-center">
              {/* 左侧动态图片布局 */}
              <div className="space-y-4">
                <DynamicImageLayout
                  images={getLayoutImagesByCategory('wohnzimmer')}
                  description="Das großzügige Wohnzimmer bietet viel Platz für Entspannung und Geselligkeit."
                  category="Wohnzimmer"
                  className="h-full"
                />
              </div>
              
              {/* 右侧介绍文字 */}
              <div className="space-y-6">
                <h3 className="text-2xl font-serif font-semibold text-gray-800">Gemütliches Wohnambiente</h3>
                <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                  <p>Das großzügige Wohnzimmer bietet viel Platz für Entspannung und Geselligkeit. Die helle Raumgestaltung mit großen Fenstern sorgt für eine angenehme Atmosphäre.</p>
                  <p>Hochwertige Materialien und durchdachte Details schaffen ein elegantes Ambiente, das zum Verweilen einlädt. Der Raum ist ideal für Familienleben und Unterhaltung.</p>
                  <p>Die flexible Einrichtung ermöglicht verschiedene Nutzungsmöglichkeiten und passt sich Ihren individuellen Bedürfnissen an.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="slide-footer">
            <div className="footer-left">
              {data.propertyName || 'Immobilienname'}
            </div>
            <div className="footer-right">
              5 / 12
            </div>
          </div>
        </div>

        {/* 第6页 - Küche */}
        <div className="slide w-full h-screen bg-white p-12 flex items-center pb-20" 
             style={{ aspectRatio: '16/9', minHeight: '1080px' }}>
          <div className="w-full max-w-6xl mx-auto">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-8 text-center">Küche</h2>
            
            <div className="grid grid-cols-2 gap-12 items-center">
              {/* 左侧动态图片布局 */}
              <div className="space-y-4">
                <DynamicImageLayout
                  images={getLayoutImagesByCategory('kueche')}
                  description="Die vollausgestattete Einbauküche überzeugt durch funktionales Design und hochwertige Ausstattung."
                  category="Küche"
                  className="h-full"
                />
              </div>
              
              {/* 右侧介绍文字 */}
              <div className="space-y-6">
                <h3 className="text-2xl font-serif font-semibold text-gray-800">Moderne Einbauküche</h3>
                <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                  <p>Die vollausgestattete Einbauküche überzeugt durch funktionales Design und hochwertige Ausstattung. Alle modernen Geräte sind bereits integriert.</p>
                  <p>Der großzügige Arbeitsbereich bietet optimale Bedingungen für das Kochen und Backen. Die praktische Anordnung der Schränke und Schubladen sorgt für Ordnung.</p>
                  <p>Ein gemütlicher Essbereich lädt zum gemeinsamen Frühstück oder Abendessen ein und schafft eine warme, familiäre Atmosphäre.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="slide-footer">
            <div className="footer-left">
              {data.propertyName || 'Immobilienname'}
            </div>
            <div className="footer-right">
              6 / 12
            </div>
          </div>
        </div>

        {/* 第7页 - Schlafzimmer & Arbeitszimmer */}
        <div className="slide w-full h-screen bg-white p-12 flex items-center pb-20" 
             style={{ aspectRatio: '16/9', minHeight: '1080px' }}>
          <div className="w-full max-w-6xl mx-auto">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-8 text-center">Schlafzimmer & Arbeitszimmer</h2>
            
            <div className="grid grid-cols-2 gap-12 items-center">
              {/* 左侧动态图片布局 */}
              <div className="space-y-4">
                <DynamicImageLayout
                  images={getLayoutImagesByCategory('zimmer')}
                  description="Das geräumige Hauptschlafzimmer bietet einen Rückzugsort der Ruhe und Entspannung."
                  category="Zimmer"
                  className="h-full"
                />
              </div>
              
              {/* 右侧介绍文字 */}
              <div className="space-y-6">
                <h3 className="text-2xl font-serif font-semibold text-gray-800">Ruheoase & Produktivität</h3>
                <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                  <p>Das geräumige Hauptschlafzimmer bietet einen Rückzugsort der Ruhe und Entspannung. Die ruhige Lage und die hochwertige Ausstattung garantieren erholsamen Schlaf.</p>
                  <p>Ein separates Arbeitszimmer ermöglicht konzentriertes Arbeiten von zu Hause aus. Die helle Raumgestaltung und die praktische Einrichtung schaffen optimale Arbeitsbedingungen.</p>
                  <p>Beide Räume sind mit ausreichend Stauraum ausgestattet und bieten viel Flexibilität für individuelle Einrichtungsvorlieben.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="slide-footer">
            <div className="footer-left">
              {data.propertyName || 'Immobilienname'}
            </div>
            <div className="footer-right">
              7 / 12
            </div>
          </div>
        </div>

        {/* 第8页 - Bad */}
        <div className="slide w-full h-screen bg-white p-12 flex items-center pb-20" 
             style={{ aspectRatio: '16/9', minHeight: '1080px' }}>
          <div className="w-full max-w-6xl mx-auto">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-8 text-center">Bad</h2>
            
            <div className="grid grid-cols-2 gap-12 items-center">
              {/* 左侧动态图片布局 */}
              <div className="space-y-4">
                <DynamicImageLayout
                  images={getLayoutImagesByCategory('bad')}
                  description="Das elegante Hauptbad überzeugt durch hochwertige Materialien und durchdachtes Design."
                  category="Bad"
                  className="h-full"
                />
              </div>
              
              {/* 右侧介绍文字 */}
              <div className="space-y-6">
                <h3 className="text-2xl font-serif font-semibold text-gray-800">Luxuriöse Badezimmer</h3>
                <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                  <p>Das elegante Hauptbad überzeugt durch hochwertige Materialien und durchdachtes Design. Moderne Armaturen und eine geräumige Dusche sorgen für Komfort.</p>
                  <p>Ein separates Gäste-WC bietet zusätzliche Privatsphäre und ist praktisch für Besucher. Alle Badezimmer sind mit ausreichend Stauraum ausgestattet.</p>
                  <p>Die hochwertige Ausstattung und die ruhige Atmosphäre schaffen einen Ort der Entspannung und des Wohlbefindens.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="slide-footer">
            <div className="footer-left">
              {data.propertyName || 'Immobilienname'}
            </div>
            <div className="footer-right">
              8 / 12
            </div>
          </div>
        </div>

        {/* 第9页 - Balkon & draußen */}
        <div className="slide w-full h-screen bg-white p-12 flex items-center pb-20" 
             style={{ aspectRatio: '16/9', minHeight: '1080px' }}>
          <div className="w-full max-w-6xl mx-auto">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-8 text-center">Balkon & Draußen</h2>
            
            <div className="grid grid-cols-2 gap-12 items-center">
              {/* 左侧动态图片布局 */}
              <div className="space-y-4">
                <DynamicImageLayout
                  images={getLayoutImagesByCategory('balkon')}
                  description="Der großzügige Balkon bietet einen wunderbaren Außenbereich zum Entspannen und Genießen."
                  category="Balkon"
                  className="h-full"
                />
              </div>
              
              {/* 右侧介绍文字 */}
              <div className="space-y-6">
                <h3 className="text-2xl font-serif font-semibold text-gray-800">Außenleben genießen</h3>
                <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                  <p>Der großzügige Balkon bietet einen wunderbaren Außenbereich zum Entspannen und Genießen. Hier können Sie den Tag bei einem Kaffee beginnen oder den Abend ausklingen lassen.</p>
                  <p>Die ruhige Lage und der schöne Ausblick auf die Umgebung schaffen eine entspannende Atmosphäre. Der Balkon ist ideal für kleine Pflanzen und Outdoor-Möbel.</p>
                  <p>Die Außenanlagen sind gepflegt und bieten zusätzlichen Lebensraum im Freien, der das Wohngefühl der Immobilie perfekt ergänzt.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="slide-footer">
            <div className="footer-left">
              {data.propertyName || 'Immobilienname'}
            </div>
            <div className="footer-right">
              9 / 12
            </div>
          </div>
        </div>

        {/* 第10页 - 位置信息 */}
        <div className="slide w-full h-screen bg-white p-12 flex items-center pb-20" 
             style={{ aspectRatio: '16/9', minHeight: '1080px' }}>
          <div className="w-full max-w-7xl mx-auto grid grid-cols-2 gap-16 items-center">
            {/* 左侧文字 */}
            <div>
              <h2 className="text-4xl font-serif font-bold text-gray-900 mb-8">Lagebeschreibung</h2>
              <div className="space-y-4 text-lg text-gray-700">
                {data.locationDescription ? (
                  // 使用用户输入的地理位置描述
                  <p className="text-justify leading-relaxed">{data.locationDescription}</p>
                ) : (
                  // 默认描述
                  <>
                    <p>• Einkaufszentrum 5 Minuten zu Fuß</p>
                    <p>• Viele Restaurants und Cafés</p>
                    <p>• Hochwertige Schulressourcen</p>
                    <p>• Krankenhauseinrichtungen vollständig</p>
                    <p>• Stadtzentrum verkehrsgünstig gelegen</p>
                    <p>• Parks und Grünflächen in der Nähe</p>
                  </>
                )}
              </div>
            </div>
            
            {/* 右侧地图图片 */}
            <div className="h-full w-full rounded-lg shadow-lg overflow-hidden">
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
          
          {/* Footer */}
          <div className="slide-footer">
            <div className="footer-left">
              {data.propertyName || 'Immobilienname'}
            </div>
            <div className="footer-right">
              10 / 12
            </div>
          </div>
        </div>

        {/* 第11页 - 平面图 */}
        <div className="slide w-full h-screen bg-white p-12 flex items-center pb-20" 
             style={{ aspectRatio: '16/9', minHeight: '1080px' }}>
          <div className="w-full max-w-7xl mx-auto">
            {/* 标题居中 */}
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-8 text-center">Grundriss</h2>
            
            {/* 平面图居中展示 - 更大尺寸 */}
            <div className="flex justify-center mb-8">
              <div className="w-[800px] h-[600px] bg-gray-200 rounded-lg shadow-lg overflow-hidden">
                <img 
                  src={getFirstImageByCategory('grundriss', 'https://source.unsplash.com/800x600/?floor-plan')} 
                  alt="Grundriss"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://source.unsplash.com/800x600/?floor-plan';
                  }}
                />
              </div>
            </div>
            
            {/* 详情列表 - 紧凑布局 */}
            <div className="max-w-5xl mx-auto">
              <ul className="grid grid-cols-2 gap-4 text-base text-gray-700">
                {(data.floorPlanDetails || [
                  '3 Schlafzimmer, Hauptschlafzimmer mit eigenem Bad',
                  '2 Badezimmer, Trocken- und Nassbereich getrennt',
                  'Offene Küche, Essbereich integriert',
                  'Wohnzimmer geräumig, viel Tageslicht',
                  'Balkon verbindet Wohnzimmer und Hauptschlafzimmer',
                  'Abstellraum und Kleiderschrank vorhanden'
                ]).map((detail, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <span className="text-sm">{detail}</span>
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
              11 / 12
            </div>
          </div>
        </div>

        {/* 第12页 - 联系信息 */}
        <div className="slide w-full h-screen bg-white p-12 flex items-center pb-20" 
             style={{ aspectRatio: '16/9', minHeight: '1080px' }}>
          <div className="w-full max-w-5xl mx-auto">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-12 text-center">Kontakt</h2>
            
            {/* 代理信息显示 */}
            {data.agentInfo && (
              <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center space-x-4">
                  {data.agentInfo.companyLogo && (
                    <img
                      src={getFullImageUrl(data.agentInfo.companyLogo)}
                      alt="Company logo"
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Immobilienmakler Informationen</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm text-blue-700">
                      <div>
                        <span className="font-medium">Verantwortliche Person:</span> {data.agentInfo.responsiblePerson}
                      </div>
                      <div>
                        <span className="font-medium">Telefon:</span> {data.agentInfo.phone}
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium">Adresse:</span> {data.agentInfo.address}
                      </div>
                      {data.agentInfo.website && (
                        <div className="col-span-2">
                          <span className="font-medium">Website:</span> {data.agentInfo.website}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
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
              12 / 12
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Expose_PPT_Classic };
