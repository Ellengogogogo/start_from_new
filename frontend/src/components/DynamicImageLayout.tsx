import React from 'react';
import { BaseLayoutProps } from '@/types/layout';
import {
  OneImage,
  TwoImages,
  ThreeImages,
  FourImages,
  FiveImages,
  SixImages
} from './layouts';

interface DynamicImageLayoutProps extends BaseLayoutProps {
  className?: string;
  fallbackLayout?: React.ComponentType<BaseLayoutProps>;
}

export const DynamicImageLayout: React.FC<DynamicImageLayoutProps> = ({
  images,
  description,
  className = '',
  fallbackLayout: FallbackLayout
}) => {
  // 根据图片数量选择对应的布局组件
  const getLayoutComponent = (imageCount: number) => {
    switch (imageCount) {
      case 1:
        return OneImage;
      case 2:
        return TwoImages;
      case 3:
        return ThreeImages;
      case 4:
        return FourImages;
      case 5:
        return FiveImages;
      case 6:
        return SixImages;
      default:
        // 如果图片数量超出范围，使用默认布局或fallback
        return FallbackLayout || OneImage;
    }
  };

  // 获取当前应该使用的布局组件
  const LayoutComponent = getLayoutComponent(images?.length || 0);

  // 如果没有图片，显示空状态
  if (!images || images.length === 0) {
    return (
      <div className={`flex items-center justify-center p-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 ${className}`}>
        <div className="text-center text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">暂无图片</h3>
          <p className="text-sm">请上传房间图片以显示布局</p>
        </div>
      </div>
    );
  }

  // 如果图片数量超出支持范围，显示提示信息
  if (images.length > 6) {
    return (
      <div className={`p-6 bg-yellow-50 border border-yellow-200 rounded-xl ${className}`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              图片数量超出支持范围
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>当前支持1-6张图片的布局，您上传了 {images.length} 张图片。</p>
              <p className="mt-1">建议选择前6张最重要的图片进行展示。</p>
            </div>
          </div>
        </div>
        
        {/* 显示前6张图片的布局 */}
        <div className="mt-4">
          <p className="text-sm text-yellow-700 mb-3">显示前6张图片的布局：</p>
          <LayoutComponent 
            images={images.slice(0, 6)} 
            description={description}
            className=""
          />
        </div>
      </div>
    );
  }

  // 渲染选中的布局组件
  return (
    <LayoutComponent 
      images={images}
      description={description}
      className={className}
    />
  );
};
