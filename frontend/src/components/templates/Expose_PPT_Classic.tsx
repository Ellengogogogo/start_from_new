import React from 'react';
import { CoverPage, AgendaPage, KeyDataPage, DescriptionPage, LocationDescriptionPage, ContactPage } from '@/components/pages';
import { DynamicImageLayout, LayoutImage, GrundrissPage } from '@/components/layouts';

export interface ExposePPTData {
  // 基本信息
  propertyName: string;
  title: string;
  address: string;
  price?: number; // 价格
  
  // 议程
  agendaItems: string[];
  
  // 关键数据
  keyFacts: {
    baujahr?: string;
    wohnflaeche?: string;
    grundstuecksgroesse?: string;
    zimmer?: string;
    schlafzimmer?: string;
    badezimmer?: string;
    einbaukueche?: string;
    heizungssystem?: string;
    energieklasse?: string;
    energietraeger?: string;
    energieverbrauch?: string;
    energieausweis_typ?: string;
    energieausweis_gueltig_bis?: string;
    parkplatz?: string;
    renovierungsqualitaet?: string;
    bodenbelag?: string;
    city?: string;
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
          backgroundImage={data.images?.[0]?.url ? getFullImageUrl(data.images[0].url) : undefined}
          propertyName={data.propertyName}
          pageNumber="2 / 12"
        />

        {/* 第3页 - 位置信息 */}
        <LocationDescriptionPage
          locationDescription={data.locationDescription}
          locationImage={data.locationImage ? getFullImageUrl(data.locationImage) : undefined}
          cityName={data.keyFacts.city}
          propertyName={data.propertyName}
          pageNumber="3 / 12"
        />

        {/* 第4页 - 关键数据 */}
        <KeyDataPage
          keyFacts={data.keyFacts}
          price={data.price}
          propertyName={data.propertyName}
          pageNumber="4 / 12"
        />

        {/* 第5页 - 房源描述 */}
        <DescriptionPage
          description={data.description}
          propertyName={data.propertyName}
          backgroundImage={data.images?.[3]?.url ? getFullImageUrl(data.images[3].url) : undefined}
          pageNumber="5 / 12"
        />

        {/* 第6页 - 房间描述 - 动态布局 */}
        <DynamicImageLayout
          images={getLayoutImagesByCategory('wohnzimmer')}
          propertyName={data.propertyName}
          description="Das großzügige Wohnzimmer bietet viel Platz für Entspannung und Geselligkeit."
          category="wohnzimmer"
          pageNumber="6 / 12"
          className="w-full h-full"
        />

        {/* 第7页 - 房间描述 - 动态布局 */}
          <DynamicImageLayout
            images={getLayoutImagesByCategory('kueche')}
            propertyName={data.propertyName}
            description="Die vollausgestattete Einbauküche überzeugt durch funktionales Design und hochwertige Ausstattung."
            category="kueche"
            pageNumber="7 / 12"
            className="w-full h-full"
          />

        {/* 第7页 - 房间描述 - 动态布局 */}
          <DynamicImageLayout
            images={getLayoutImagesByCategory('zimmer')}
            propertyName={data.propertyName}
            description="Das großzügige Schlafzimmer bietet viel Platz für Entspannung und Geselligkeit."
            category="zimmer"
            pageNumber="8 / 12"
            className="w-full h-full"
          />

        {/* 第8页 - 房间描述 - 动态布局 */}
          <DynamicImageLayout
            images={getLayoutImagesByCategory('bad')}
            propertyName={data.propertyName}
            description="Das großzügige Bad bietet viel Platz für Entspannung und Geselligkeit."
            category="Bad"
            pageNumber="9 / 12"
            className="w-full h-full"
          />

        {/* 第9页 - 房间描述 - 动态布局 */}
          <DynamicImageLayout
            images={getLayoutImagesByCategory('balkon')}
            propertyName={data.propertyName}
            description="Das großzügige Balkon bietet viel Platz für Entspannung und Geselligkeit."
            category="Balkon"
            pageNumber="10 / 12"
            className="w-full h-full"
          />

        {/* 第9页 - 平面图 - 使用新的 GrundrissPage 组件 */}
          <GrundrissPage
            image={{
              url: getFirstImageByCategory('grundriss', 'https://source.unsplash.com/800x600/?floor-plan'),
              category: 'Grundriss',
              alt: 'Grundriss'
            }}
            title="Grundriss"
            roomStats={{
              totalRooms: parseInt(data.keyFacts.zimmer || '0') || 0,
              bedrooms: parseInt(data.keyFacts.schlafzimmer || '0') || 0,
              bathrooms: parseInt(data.keyFacts.badezimmer || '0') || 0,
              livingRooms: 1,
              kitchens: 1,
              balconies: 0
            }}
            propertyName={data.propertyName}
            pageNumber="11 / 12"
            className="w-full h-full"
          />

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
