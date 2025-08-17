import React from 'react';
import { cn } from '@/lib/utils';

export interface PriceTagProps {
  price: number;
  currency?: string;
  unit?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'highlight' | 'subtle';
  showUnit?: boolean;
  className?: string;
}

const PriceTag: React.FC<PriceTagProps> = ({
  price,
  currency = '¥',
  unit = '万',
  size = 'md',
  variant = 'default',
  showUnit = true,
  className,
}) => {
  // 价格格式化
  const formatPrice = (price: number): string => {
    if (price >= 10000) {
      return (price / 10000).toFixed(1);
    }
    return price.toString();
  };

  // 尺寸配置
  const sizeConfig = {
    sm: {
      container: 'px-2 py-1',
      price: 'text-sm',
      unit: 'text-xs',
      currency: 'text-xs',
    },
    md: {
      container: 'px-3 py-2',
      price: 'text-lg',
      unit: 'text-sm',
      currency: 'text-sm',
    },
    lg: {
      container: 'px-4 py-3',
      price: 'text-2xl',
      unit: 'text-base',
      currency: 'text-base',
    },
    xl: {
      container: 'px-6 py-4',
      price: 'text-3xl',
      unit: 'text-lg',
      currency: 'text-lg',
    },
  };

  // 变体配置
  const variantConfig = {
    default: 'bg-white border border-gray-200 text-gray-900',
    highlight: 'bg-blue-600 text-white border border-blue-600',
    subtle: 'bg-gray-100 text-gray-700 border border-gray-200',
  };

  const config = sizeConfig[size];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-lg font-semibold',
        config.container,
        variantConfig[variant],
        className
      )}
    >
      {/* 货币符号 */}
      <span className={cn('text-blue-600', config.currency)}>
        {currency}
      </span>

      {/* 价格 */}
      <span className={cn('font-bold', config.price)}>
        {formatPrice(price)}
      </span>

      {/* 单位 */}
      {showUnit && unit && (
        <span className={cn('text-gray-600', config.unit)}>
          {unit}
        </span>
      )}
    </div>
  );
};

export { PriceTag };
