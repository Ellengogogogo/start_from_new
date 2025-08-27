// 图片数据结构接口
export interface ImageData {
  id: string;
  url: string;
  alt: string;
  category?: string;
  displayName?: string;
  width?: number;
  height?: number;
}

// 文本块数据接口
export interface TextBlockData {
  title?: string;
  description: string;
  className?: string;
}

// 布局组件基础Props接口
export interface BaseLayoutProps {
  images: ImageData[];
  description: string;
  className?: string;
}

// 房间类型枚举
export enum RoomType {
  LIVING_ROOM = 'wohnzimmer',
  KITCHEN = 'kueche',
  BEDROOM = 'schlafzimmer',
  BATHROOM = 'badezimmer',
  DINING_ROOM = 'esszimmer',
  STUDY = 'arbeitszimmer'
}

// 布局类型枚举
export enum LayoutType {
  ONE_IMAGE = 'one-image',
  TWO_IMAGES = 'two-images',
  THREE_IMAGES = 'three-images',
  FOUR_IMAGES = 'four-images',
  FIVE_IMAGES = 'five-images',
  SIX_IMAGES = 'six-images'
}

// 响应式断点配置
export interface ResponsiveConfig {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

// 图片尺寸配置
export interface ImageSizeConfig {
  width: number;
  height: number;
  aspectRatio: string;
}
