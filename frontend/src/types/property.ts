export interface Images {
  wohnzimmer?: File[];
  kueche?: File[];
  zimmer?: File[];
  bad?: File[];
  balkon?: File[];
  grundriss?: File[];
}

// 基础属性接口 - 包含所有共同的属性
export interface BasePropertyFields {
  title: string;
  city: string;
  plz: string;
  address: string;
  price: number;
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
  description?: string;
}

// 可选属性接口 - 包含所有可选的属性
export interface OptionalPropertyFields {
  grundstuecksgroesse?: number; // 地块大小
  einbaukueche?: string; // 内置厨房
  energieverbrauch?: number; // 能源消耗 kWh/m²
  energieausweis_typ?: string; // 能源证书类型
  energieausweis_gueltig_bis?: string; // 能源证书有效期
  floor?: number; // 楼层
  balkon_garten?: string; // 阳台/花园
}

// 联系信息接口
export interface ContactInfo {
  contact_person: string;
  contact_phone: string;
  contact_email: string;
  contact_person2?: string;
  contact_phone2?: string;
  contact_email2?: string;
}

// 表单特有字段
export interface FormSpecificFields {
  property_type: string;
  city: string;
  plz: string;
  description?: string;
  suggested_description?: string;
  locationDescription?: string;
  suggested_location_description?: string;
  agentInfo?: AgentInfo;
}

// 图片接口
export interface PropertyImage {
  id: string;
  url: string;
  category: string;
  createdAt: string;
}

// 重构后的接口定义
export interface PropertyFormData extends BasePropertyFields, OptionalPropertyFields, FormSpecificFields, ContactInfo {}

export interface UploadProgress {
  [key: string]: number;
}

// ExposeData 接口 - 包含所有必要的字段
export interface ExposeData extends BasePropertyFields, OptionalPropertyFields, FormSpecificFields, ContactInfo {
  id: string;
  propertyId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  createdAt: string;
  completedAt?: string;
  pdfUrl?: string;
  // Override images field to use PropertyImage[] instead of Images
  images?: PropertyImage[];
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
