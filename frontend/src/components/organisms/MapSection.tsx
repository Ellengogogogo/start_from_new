import React from 'react';
import { cn } from '@/lib/utils';

export interface MapSectionProps {
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  showMap?: boolean;
  showAddress?: boolean;
  showDirections?: boolean;
  className?: string;
  onMapClick?: () => void;
}

const MapSection: React.FC<MapSectionProps> = ({
  address,
  coordinates,
  zoom = 15,
  showMap = true,
  showAddress = true,
  showDirections = true,
  className,
  onMapClick,
}) => {
  // 生成地图URL（这里使用OpenStreetMap作为示例）
  const getMapUrl = () => {
    if (!coordinates) {
      return `https://www.openstreetmap.org/search?query=${encodeURIComponent(address)}`;
    }
    return `https://www.openstreetmap.org/?mlat=${coordinates.lat}&mlon=${coordinates.lng}&zoom=${zoom}`;
  };

  // 生成导航URL
  const getDirectionsUrl = () => {
    if (!coordinates) {
      return `https://www.google.com/maps/search/${encodeURIComponent(address)}`;
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`;
  };

  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 overflow-hidden', className)}>
      {/* 标题 */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Standortinformationen
        </h3>
      </div>

      <div className="p-6 space-y-4">
        {/* 地图占位符 */}
        {showMap && (
          <div className="relative">
            <div
              className={cn(
                'w-full h-64 bg-gray-100 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:bg-gray-200',
                'flex items-center justify-center'
              )}
              onClick={onMapClick}
            >
              {/* 地图占位符内容 */}
              <div className="text-center text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <p className="text-sm font-medium">Klicken Sie, um die Karte anzuzeigen</p>
                <p className="text-xs text-gray-400 mt-1">Karte wird geladen...</p>
              </div>

              {/* 地图覆盖层 */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 pointer-events-none" />
            </div>

            {/* 地图操作按钮 */}
            <div className="absolute top-3 right-3 flex gap-2">
              <button
                className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(getMapUrl(), '_blank');
                }}
                title="Karte in neuem Fenster öffnen"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* 地址信息 */}
        {showAddress && (
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1">Detaillierte Adresse</h4>
                <p className="text-gray-600 leading-relaxed">{address}</p>
              </div>
            </div>

            {/* 坐标信息 */}
            {coordinates && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-green-600 rounded-full" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">Koordinaten</h4>
                  <p className="text-gray-600 font-mono text-sm">
                    Breitengrad: {coordinates.lat.toFixed(6)}, Längengrad: {coordinates.lng.toFixed(6)}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 导航按钮 */}
        {showDirections && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                onClick={() => window.open(getDirectionsUrl(), '_blank')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Route abrufen
              </button>

              <button
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'Immobilienstandort',
                      text: `Siehe den Standort dieser Immobilie: ${address}`,
                      url: getMapUrl(),
                    });
                  } else {
                    // 复制地址到剪贴板
                    navigator.clipboard.writeText(address);
                    alert('Adresse in die Zwischenablage kopiert');
                  }
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                Standort teilen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { MapSection };
