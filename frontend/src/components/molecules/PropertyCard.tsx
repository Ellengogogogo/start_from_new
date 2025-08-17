import React from 'react';
import { Badge } from '@/components/atoms/Badge';
import { cn } from '@/lib/utils';

export interface PropertyCardProps {
  title: string;
  address: string;
  price: number;
  priceUnit?: string;
  rooms: number;
  area: number;
  areaUnit?: string;
  yearBuilt?: number;
  imageUrl: string;
  imageAlt?: string;
  tags?: string[];
  className?: string;
  onClick?: () => void;
  featured?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  title,
  address,
  price,
  priceUnit = '万',
  rooms,
  area,
  areaUnit = 'm²',
  yearBuilt,
  imageUrl,
  imageAlt,
  tags = [],
  className,
  onClick,
  featured = false,
}) => {
  // 格式化价格显示
  const formatPrice = (price: number) => {
    if (price >= 10000) {
      return `${(price / 10000).toFixed(1)}万`;
    }
    return `${price}${priceUnit}`;
  };

  return (
    <div
      className={cn(
        'group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md hover:border-gray-300 cursor-pointer',
        featured && 'ring-2 ring-blue-500 ring-offset-2',
        className
      )}
      onClick={onClick}
    >
      {/* 图片区域 */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={imageUrl}
          alt={imageAlt || title}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
        />
        
        {/* 特色标签 */}
        {featured && (
          <div className="absolute top-3 left-3">
            <Badge variant="brand" size="sm">
              特色房源
            </Badge>
          </div>
        )}
        
        {/* 价格标签 */}
        <div className="absolute bottom-3 right-3">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
            <div className="text-lg font-bold text-gray-900">
              {formatPrice(price)}
            </div>
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="p-4 space-y-3">
        {/* 标题 */}
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>

        {/* 地址 */}
        <p className="text-sm text-gray-600 flex items-start gap-2">
          <svg className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="line-clamp-2">{address}</span>
        </p>

        {/* 基本信息 */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
            </svg>
            <span>{rooms}室</span>
          </div>
          
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            <span>{area}{areaUnit}</span>
          </div>
          
          {yearBuilt && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{yearBuilt}年</span>
            </div>
          )}
        </div>

        {/* 标签 */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Badge key={index} variant="neutral" size="sm">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export { PropertyCard };
