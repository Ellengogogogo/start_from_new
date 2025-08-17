import React from 'react';
import { PropertyHeader } from '@/components/organisms/PropertyHeader';
import { ImageGallery } from '@/components/molecules/ImageGallery';
import { FeatureList } from '@/components/molecules/FeatureList';
import { ContactCard } from '@/components/organisms/ContactCard';
import { MapSection } from '@/components/organisms/MapSection';
import { Divider } from '@/components/atoms/Divider';
import { cn } from '@/lib/utils';

export interface ExposeData {
  // 基本信息
  title: string;
  address: string;
  price: number;
  priceUnit?: string;
  tags?: string[];
  
  // 房源详情
  rooms: number;
  area: number;
  areaUnit?: string;
  yearBuilt?: number;
  floor?: string;
  totalFloors?: number;
  orientation?: string;
  renovation?: string;
  
  // 描述
  description: string;
  
  // 图片
  images: Array<{
    id: string;
    url: string;
    alt: string;
    isPrimary?: boolean;
  }>;
  
  // 特性
  features?: Array<{
    id: string;
    icon: React.ReactNode;
    title: string;
    description?: string;
    value?: string | number;
  }>;
  
  // 联系人
  contact: {
    name: string;
    title?: string;
    avatar?: string;
    phone?: string;
    email?: string;
    wechat?: string;
    company?: string;
    license?: string;
  };
  
  // 位置信息
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Expose_A4_ClassicProps {
  data: ExposeData;
  className?: string;
  showPrintButton?: boolean;
  onPrint?: () => void;
  onShare?: () => void;
  onContact?: () => void;
}

const Expose_A4_Classic: React.FC<Expose_A4_ClassicProps> = ({
  data,
  className,
  showPrintButton = true,
  onPrint,
  onShare,
  onContact,
}) => {
  // 默认特性列表
  const defaultFeatures = [
    {
      id: 'rooms',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
        </svg>
      ),
      title: 'Zimmer',
      value: `${data.rooms} Zimmer`,
    },
    {
      id: 'area',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
      ),
      title: 'Wohnfläche',
      value: `${data.area}${data.areaUnit || 'm²'}`,
    },
    ...(data.yearBuilt ? [{
      id: 'yearBuilt',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Baujahr',
      value: `${data.yearBuilt}`,
    }] : []),
    ...(data.floor ? [{
      id: 'floor',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      title: 'Etage',
      value: data.totalFloors ? `${data.floor}/${data.totalFloors}. Etage` : data.floor,
    }] : []),
    ...(data.orientation ? [{
      id: 'orientation',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      title: 'Ausrichtung',
      value: data.orientation,
    }] : []),
    ...(data.renovation ? [{
      id: 'renovation',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      title: 'Renovierung',
      value: data.renovation,
    }] : []),
  ];

  const features = data.features || defaultFeatures;

  return (
    <div className={cn('min-h-screen bg-gray-50', className)}>
      {/* 打印样式 */}
      <style jsx>{`
        @media print {
          .no-print { display: none !important; }
          .print-break { page-break-before: always; }
          body { margin: 0; }
          .expose-container { 
            max-width: none !important;
            margin: 0 !important;
            padding: 20px !important;
          }
        }
      `}</style>

      {/* 操作按钮 */}
      {showPrintButton && (
        <div className="no-print sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Immobilienpräsentation</h2>
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
                Drucken
              </button>
              <button
                onClick={onContact}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Kontakt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 主要内容 */}
      <div className="expose-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 1. 头部信息 */}
        <PropertyHeader
          title={data.title}
          address={data.address}
          price={data.price}
          priceUnit={data.priceUnit}
          tags={data.tags}
          onContactClick={onContact}
          onShareClick={onShare}
          className="mb-8"
        />

        {/* 2. 图片展示 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Immobilienbilder</h2>
          <ImageGallery
            images={data.images}
            gridCols={3}
            aspectRatio="video"
            maxHeight="500px"
          />
        </div>

        {/* 3. 房源特性 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Immobilienmerkmale</h2>
          <FeatureList
            features={features}
            layout="grid"
            columns={3}
            showDescriptions={false}
            showValues={true}
          />
        </div>

        {/* 4. 房源描述 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Immobilienbeschreibung</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
              {data.description}
            </p>
          </div>
        </div>

        {/* 5. 位置信息 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Standortinformationen</h2>
          <MapSection
            address={data.address}
            coordinates={data.coordinates}
            showMap={true}
            showAddress={true}
            showDirections={true}
          />
        </div>

        {/* 6. 联系信息 */}
        <div className="print-break">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Kontaktinformationen</h2>
          <ContactCard
            contact={data.contact}
            layout="horizontal"
            showActions={true}
            onPhoneClick={(phone) => window.open(`tel:${phone}`)}
            onEmailClick={(email) => window.open(`mailto:${email}`)}
            onWechatClick={(wechat) => {
              // 复制微信号到剪贴板
              navigator.clipboard.writeText(wechat);
              alert(`WeChat-ID ${wechat} wurde in die Zwischenablage kopiert`);
            }}
          />
        </div>

        {/* 页脚 */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-500">
          <p className="text-sm">
            Diese Immobilienpräsentation wurde von einem professionellen Immobilienportal generiert • Datenstand: {new Date().toLocaleDateString('de-DE')}
          </p>
        </div>
      </div>
    </div>
  );
};

export { Expose_A4_Classic };
