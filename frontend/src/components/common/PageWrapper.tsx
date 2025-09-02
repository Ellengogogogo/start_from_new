import React from 'react';
import { pageDividerStyles } from '@/styles/pageDividerStyles';
import { PageFooter } from './PageFooter';

export interface PageWrapperProps {
  children: React.ReactNode;
  pageNumber?: string;
  showDivider?: boolean;
  dividerStyle?: 'gradient' | 'shadow' | 'border' | 'decorative';
  dividerVariant?: 'thin' | 'medium' | 'thick' | 'light' | 'dark' | 'subtle' | 'strong';
  className?: string;
  showFooter?: boolean;
  propertyName?: string;
  showFooterPageNumber?: boolean;
  showFooterPropertyName?: boolean;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  pageNumber,
  showDivider = true,
  dividerStyle = 'gradient',
  dividerVariant = 'medium',
  className = '',
  showFooter = true,
  propertyName,
  showFooterPageNumber = true,
  showFooterPropertyName = true
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

  return (
    <div className={`snap-start h-screen relative ${className}`}>
      {/* 页面内容 */}
      <div className="page-content">
        {children}
      </div>
      
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
      
      {/* 页面 Footer */}
      {showFooter && (
        <PageFooter
          pageNumber={pageNumber}
          propertyName={propertyName}
          showPageNumber={showFooterPageNumber}
          showPropertyName={showFooterPropertyName}
        />
      )}
    </div>
  );
};
