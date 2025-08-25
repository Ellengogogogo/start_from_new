export interface Photos {
  wohnzimmer?: File[];
  kueche?: File[];
  schlafzimmer?: File[];
  bad?: File[];
  balkon?: File[];
  grundriss?: File[];
}

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
  bedrooms: number;
  bathrooms: number;
  heating_system: string;
  energy_source: string;
  energy_certificate: string;
  parking: string;
  renovation_quality: string;
  floor_type: string;
  // 德语prompt需要的额外字段
  features?: string;
  grundstuecksflaeche?: number;
  floor?: number;
  
  // 步骤3: 描述文本
  description?: string;
  suggested_description?: string;
  locationDescription?: string; // 新增：地理位置描述
  suggested_location_description?: string; // 新增：AI生成的地理位置描述
  
  // 步骤4: 图片 - 更新为新的photos系统
  photos: Photos; // 改为必需字段
  images?: File[]; // 改为可选字段以保持兼容性
  floorPlan?: File; // 新增：平面图文件
  
  // 步骤5: 联系人信息
  contact_person: string;
  contact_phone: string;
  contact_email: string;
  contact_person2?: string;
  contact_phone2?: string;
  contact_email2?: string;
  
  // Agent information (optional)
  agentInfo?: AgentInfo;
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
    bedrooms?: number;
    bathrooms?: number;
    heating_system?: string;
    energy_source?: string;
    energy_certificate?: string;
    parking?: string;
    renovation_quality?: string;
    floor_type?: string;
    description?: string;
    contact_person?: string;
    contact_phone?: string;
    contact_email?: string;
    contact_person2?: string;
    contact_phone2?: string;
    contact_email2?: string;
    images?: Array<{
      url: string;
      isPrimary: boolean;
    }>;
    locationDescription?: string; // 新增：地理位置描述
    floorPlanImage?: string; // 新增：平面图图片
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

export interface AgentInfo {
  companyLogo?: string;
  address: string;
  website?: string;
  phone: string;
  userType: 'agent';
}
