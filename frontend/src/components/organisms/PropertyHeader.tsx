import React from 'react';
import { Button } from '@/components/atoms/Button';
import { PriceTag } from '@/components/molecules/PriceTag';
import { cn } from '@/lib/utils';

export interface PropertyHeaderProps {
  title: string;
  address: string;
  price: number;
  priceUnit?: string;
  tags?: string[];
  onContactClick?: () => void;
  onShareClick?: () => void;
  onFavoriteClick?: () => void;
  isFavorite?: boolean;
  className?: string;
}

const PropertyHeader: React.FC<PropertyHeaderProps> = ({
  title,
  address,
  price,
  priceUnit = 'Tsd.',
  tags = [],
  onContactClick,
  onShareClick,
  onFavoriteClick,
  isFavorite = false,
  className,
}) => {
  return (
    <div className={cn('bg-white border-b border-gray-200', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          {/* 左侧信息 */}
          <div className="flex-1 space-y-4">
            {/* 标题 */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              {title}
            </h1>

            {/* 地址 */}
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-lg text-gray-600 leading-relaxed">
                {address}
              </p>
            </div>

            {/* 标签 */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 右侧操作区 */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-end">
            {/* 价格 */}
            <div className="flex flex-col items-start sm:items-end lg:items-end">
              <span className="text-sm text-gray-500 mb-1">Referenzpreis</span>
              <PriceTag
                price={price}
                unit={priceUnit}
                size="lg"
                variant="highlight"
              />
            </div>

            {/* 操作按钮 */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
              {/* 联系按钮 */}
              {onContactClick && (
                <Button
                  onClick={onContactClick}
                  size="lg"
                  className="w-full sm:w-auto lg:w-full"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Sofort kontaktieren
                </Button>
              )}

              {/* 分享按钮 */}
              {onShareClick && (
                <Button
                  variant="outline"
                  onClick={onShareClick}
                  size="lg"
                  className="w-full sm:w-auto lg:w-full"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  Teilen
                </Button>
              )}

              {/* 收藏按钮 */}
              {onFavoriteClick && (
                <Button
                  variant="outline"
                  onClick={onFavoriteClick}
                  size="lg"
                  className={cn(
                    'w-full sm:w-auto lg:w-full',
                    isFavorite && 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
                  )}
                >
                  <svg className={cn('w-5 h-5 mr-2', isFavorite && 'fill-current')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {isFavorite ? 'Favorit' : 'Favorit hinzufügen'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { PropertyHeader };
