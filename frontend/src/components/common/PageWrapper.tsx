import React from 'react';
import { pageDividerStyles } from '@/styles/pageDividerStyles';

export interface PageWrapperProps {
  children: React.ReactNode;
  pageNumber?: string;
  showDivider?: boolean;
  dividerStyle?: 'gradient' | 'shadow' | 'border' | 'decorative';
  dividerVariant?: 'thin' | 'medium' | 'thick' | 'light' | 'dark' | 'subtle' | 'strong';
  className?: string;
  showPageIndicator?: boolean;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  pageNumber,
  showDivider = true,
  dividerStyle = 'gradient',
  dividerVariant = 'medium',
  className = '',
  showPageIndicator = false
}) => {
  // 获取分割线样式类
  const getDividerClasses = () => {
    if (!showDivider) return '';
    
    switch (dividerStyle) {
      case 'gradient':
        return pageDividerStyles.gradient[dividerVariant as keyof typeof pageDividerStyles.gradient] || pageDividerStyles.gradient.medium;
      case 'shadow':
        return pageDividerStyles.shadow[dividerVariant as keyof typeof pageDividerStyles.shadow] || pageDividerStyles.shadow.medium;
      case 'border':
        return pageDividerStyles.border[dividerVariant as keyof typeof pageDividerStyles.border] || pageDividerStyles.border.medium;
      case 'decorative':
        return pageDividerStyles.decorative.dots;
      default:
        return pageDividerStyles.gradient.medium;
    }
  };

  // 渲染装饰性分割线
  const renderDecorativeDivider = () => {
    if (dividerStyle !== 'decorative') return null;
    
    return (
      <div className="page-divider-decorative">
        <div className={pageDividerStyles.decorative.dotsContent}></div>
        <div className={pageDividerStyles.decorative.line}></div>
        <div className={pageDividerStyles.decorative.accent}></div>
      </div>
    );
  };

  // 渲染页面指示器
  const renderPageIndicator = () => {
    if (!showPageIndicator || !pageNumber) return null;
    
    return (
      <div className="absolute right-6 top-1/2 transform -translate-y-1/2 flex flex-col items-center space-y-2 z-10">
        <div className="w-3 h-3 bg-stone-400 rounded-full"></div>
        <div className="text-xs text-stone-500 font-medium">{pageNumber.split(' ')[0]}</div>
      </div>
    );
  };

  return (
    <div className={`snap-start h-screen relative ${className}`}>
      {/* 页面内容 */}
      <div className="page-content">
        {children}
      </div>
      
      {/* 页面指示器 */}
      {renderPageIndicator()}
      
      {/* 页面分割线 */}
      {showDivider && (
        <div className="page-divider">
          {dividerStyle === 'decorative' ? (
            renderDecorativeDivider()
          ) : (
            <div className={`w-full ${getDividerClasses()}`}></div>
          )}
        </div>
      )}
    </div>
  );
};
