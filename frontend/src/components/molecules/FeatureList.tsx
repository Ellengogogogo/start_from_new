import React from 'react';
import { cn } from '@/lib/utils';

export interface Feature {
  id: string;
  icon: React.ReactNode;
  title: string;
  description?: string;
  value?: string | number;
}

export interface FeatureListProps {
  features: Feature[];
  layout?: 'grid' | 'list' | 'compact';
  columns?: 1 | 2 | 3 | 4;
  showDescriptions?: boolean;
  showValues?: boolean;
  className?: string;
  itemClassName?: string;
}

const FeatureList: React.FC<FeatureListProps> = ({
  features,
  layout = 'list',
  columns = 2,
  showDescriptions = true,
  showValues = false,
  className,
  itemClassName,
}) => {
  if (!features || features.length === 0) {
    return (
      <div className={cn('text-center text-gray-500 py-8', className)}>
        <p>暂无特性信息</p>
      </div>
    );
  }

  // 布局配置
  const layoutConfig = {
    grid: `grid grid-cols-1 sm:grid-cols-${columns} gap-4`,
    list: 'space-y-3',
    compact: 'space-y-2',
  };

  // 渲染特性项
  const renderFeature = (feature: Feature) => {
    const baseClasses = cn(
      'flex items-start gap-3 p-3 rounded-lg transition-colors duration-200',
      layout === 'compact' ? 'py-2' : 'py-3',
      layout === 'grid' ? 'bg-gray-50 hover:bg-gray-100' : '',
      itemClassName
    );

    return (
      <div key={feature.id} className={baseClasses}>
        {/* 图标 */}
        <div className={cn(
          'flex-shrink-0 text-blue-600',
          layout === 'compact' ? 'w-5 h-5' : 'w-6 h-6'
        )}>
          {feature.icon}
        </div>

        {/* 内容 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className={cn(
              'font-medium text-gray-900',
              layout === 'compact' ? 'text-sm' : 'text-base'
            )}>
              {feature.title}
            </h4>
            
            {showValues && feature.value && (
              <span className="text-sm font-semibold text-blue-600">
                {feature.value}
              </span>
            )}
          </div>
          
          {showDescriptions && feature.description && (
            <p className={cn(
              'text-gray-600 mt-1',
              layout === 'compact' ? 'text-xs' : 'text-sm'
            )}>
              {feature.description}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={cn(layoutConfig[layout], className)}>
      {features.map(renderFeature)}
    </div>
  );
};

export { FeatureList };
