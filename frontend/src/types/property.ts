export interface PropertyFormData {
  // 步骤1: 基本信息
  title: string;
  property_type: string;
  city: string;
  postal_code: string;
  address: string;
  price: number;
  
  // 步骤2: 房屋详情
  rooms: number;
  area: number;
  yearBuilt: number;
  
  // 步骤3: 描述文本
  description?: string;
  suggested_description?: string;
  
  // 步骤4: 图片
  images: File[];
}

export interface PropertyData {
  id: string;
  title: string;
  address: string;
  price: number;
  rooms: number;
  area: number;
  yearBuilt: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyImage {
  id: string;
  propertyId: string;
  filename: string;
  url: string;
  isPrimary: boolean;
  createdAt: string;
}

export interface PropertyPreview {
  property: PropertyData;
  images: PropertyImage[];
}

export interface UploadProgress {
  [key: string]: number;
}

export interface ExposeData {
  id: string;
  propertyId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  createdAt: string;
  completedAt?: string;
  pdfUrl?: string;
  previewData?: {
    title?: string;
    address?: string;
    price?: number;
    rooms?: number;
    area?: number;
    yearBuilt?: number;
    description?: string;
    images?: Array<{
      url: string;
      isPrimary: boolean;
    }>;
  };
}

export interface ExposeGenerationRequest {
  propertyId: string;
  template?: string;
  options?: {
    includeMap?: boolean;
    includeFloorPlan?: boolean;
    language?: 'zh' | 'en';
    format?: 'A4' | 'A3';
  };
}
