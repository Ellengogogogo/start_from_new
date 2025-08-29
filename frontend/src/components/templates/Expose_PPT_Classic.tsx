import React from 'react';
import { DynamicImageLayout, LayoutImage } from '@/components/layouts';
import { CoverPage, AgendaPage, KeyDataPage, DescriptionPage, LocationDescriptionPage, ContactPage } from '@/components/pages';

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
        <CoverPage
          title={data.title}
          address={data.address}
          backgroundImage={data.images?.[0]?.url ? getFullImageUrl(data.images[0].url) : undefined}
          propertyName={data.propertyName}
          pageNumber="1 / 12"
        />

        {/* 第2页 - 议程 */}
        <AgendaPage
          agendaItems={data.agendaItems}
          backgroundImage={data.images?.[1]?.url ? getFullImageUrl(data.images[1].url) : 
                          data.images?.[0]?.url ? getFullImageUrl(data.images[0].url) : undefined}
          propertyName={data.propertyName}
          pageNumber="2 / 12"
        />

        {/* 第3页 - 关键数据 */}
        <KeyDataPage
          keyFacts={data.keyFacts}
          propertyName={data.propertyName}
          pageNumber="3 / 12"
        />

        {/* 第4页 - 房源描述 */}
        <DescriptionPage
          description={data.description}
          propertyName={data.propertyName}
          pageNumber="4 / 12"
        />

        {/* 第5页 - Wohnzimmer */}
        <div className="slide w-full h-screen bg-white p-8 flex flex-col pb-20" 
             style={{ aspectRatio: '16/9', minHeight: '1080px' }}>
          {/* 标题 */}
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6 text-center">Wohnzimmer</h2>
          
          {/* 图片布局占据整个剩余空间 */}
          <div className="flex-1 w-full">
            <DynamicImageLayout
              images={getLayoutImagesByCategory('wohnzimmer')}
              description="Das großzügige Wohnzimmer bietet viel Platz für Entspannung und Geselligkeit."
              category="Wohnzimmer"
              className="w-full h-full"
            />
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
        <div className="slide w-full h-screen bg-white p-8 flex flex-col pb-20" 
             style={{ aspectRatio: '16/9', minHeight: '1080px' }}>
          {/* 标题 */}
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6 text-center">Küche</h2>
          
          {/* 图片布局占据整个剩余空间 */}
          <div className="flex-1 w-full">
            <DynamicImageLayout
              images={getLayoutImagesByCategory('kueche')}
              description="Die vollausgestattete Einbauküche überzeugt durch funktionales Design und hochwertige Ausstattung."
              category="Küche"
              className="w-full h-full"
            />
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
        <div className="slide w-full h-screen bg-white p-8 flex flex-col pb-20" 
             style={{ aspectRatio: '16/9', minHeight: '1080px' }}>
          {/* 标题 */}
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6 text-center">Schlafzimmer & Arbeitszimmer</h2>
          
          {/* 图片布局占据整个剩余空间 */}
          <div className="flex-1 w-full">
            <DynamicImageLayout
              images={getLayoutImagesByCategory('zimmer')}
              description="Das geräumige Hauptschlafzimmer bietet einen Rückzugsort der Ruhe und Entspannung."
              category="Zimmer"
              className="w-full h-full"
            />
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
        <div className="slide w-full h-screen bg-white p-8 flex flex-col pb-20" 
             style={{ aspectRatio: '16/9', minHeight: '1080px' }}>
          {/* 标题 */}
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6 text-center">Bad</h2>
          
          {/* 图片布局占据整个剩余空间 */}
          <div className="flex-1 w-full">
            <DynamicImageLayout
              images={getLayoutImagesByCategory('bad')}
              description="Das elegante Hauptbad überzeugt durch hochwertige Materialien und durchdachtes Design."
              category="Bad"
              className="w-full h-full"
            />
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
        <div className="slide w-full h-screen bg-white p-8 flex flex-col pb-20" 
             style={{ aspectRatio: '16/9', minHeight: '1080px' }}>
          {/* 标题 */}
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6 text-center">Balkon & Draußen</h2>
          
          {/* 图片布局占据整个剩余空间 */}
          <div className="flex-1 w-full">
            <DynamicImageLayout
              images={getLayoutImagesByCategory('balkon')}
              description="Der großzügige Balkon bietet einen wunderbaren Außenbereich zum Entspannen und Genießen."
              category="Balkon"
              className="w-full h-full"
            />
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
        <LocationDescriptionPage
          locationDescription={data.locationDescription}
          locationImage={data.locationImage ? getFullImageUrl(data.locationImage) : undefined}
          propertyName={data.propertyName}
          pageNumber="10 / 12"
        />

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
                {(data.floorPlanDetails).map((detail, index) => (
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
        <ContactPage
          contacts={data.contacts}
          agentInfo={data.agentInfo}
          propertyName={data.propertyName}
          pageNumber="12 / 12"
        />
      </div>
    </div>
  );
};

export { Expose_PPT_Classic };
