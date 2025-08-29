// 布局组件的图片数据接口（简化版，与后端统一）
export interface LayoutImage {
  id: string;
  url: string;
  category: string;
}

// 布局组件基础Props接口
export interface BaseLayoutProps {
  images: LayoutImage[];
  description: string;
  className?: string;
}
