import React from 'react';

export interface PageFooterProps {
  pageNumber?: string;
  propertyName?: string;
  showPageNumber?: boolean;
  showPropertyName?: boolean;
  className?: string;
}

export const PageFooter: React.FC<PageFooterProps> = ({
  pageNumber,
  propertyName,
  showPageNumber = true,
  showPropertyName = true,
  className = ''
}) => {
  return (
    <div className={`absolute bottom-0 left-0 right-0 z-30 ${className}`}>
      {/* 渐变背景遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/40 to-transparent"></div>
      
      {/* Footer 内容 */}
      <div className="relative z-10 h-20 flex items-center justify-between px-16">
        {/* 左侧 - 房产名称 */}
        {showPropertyName && (
          <div className="text-stone-700 font-medium text-lg">
            {propertyName || 'Premium Immobilie'}
          </div>
        )}
        
        {/* 右侧 - 页码指示器 */}
        {showPageNumber && pageNumber && (
          <div className="flex items-center space-x-4">
            {/* 页码指示器 - 使用 CoverPage 的优雅样式 */}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-stone-400 rounded-full"></div>
              <div className="w-6 h-1 bg-stone-200 rounded-full"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
            </div>
            <span className="text-stone-600 font-semibold text-sm">
              {pageNumber}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
