import axios from 'axios';
import { PropertyFormData, PropertyData, PropertyImage } from '@/types/property';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 缓存房源数据
export const cachePropertyData = async (data: Omit<PropertyFormData, 'images'>): Promise<{ id: string }> => {
  const response = await api.post('/app/endpoints/cache/property-data', data);
  return response.data;
};

// 获取缓存的房源数据
export const getCachedPropertyData = async (id: string): Promise<PropertyData> => {
  const response = await api.get(`/app/endpoints/cache/property-data/${id}`);
  return response.data;
};

// 获取缓存的房源图片
export const getCachedPropertyImages = async (id: string): Promise<PropertyImage[]> => {
  const response = await api.get(`/app/endpoints/cache/property-images/${id}`);
  return response.data;
};

// 上传房源图片
export const uploadPropertyImages = async (
  propertyId: string,
  images: File[],
  onProgress?: (progress: number) => void,
  imageType?: string
): Promise<{ images: PropertyImage[] }> => {
  const formData = new FormData();
  images.forEach((image) => {
    formData.append('images', image);
  });
  
  // 添加图片类型参数
  if (imageType) {
    formData.append('image_type', imageType);
  }

  const response = await api.post(`/app/endpoints/cache/property-images/${propertyId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onProgress) {
        const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        onProgress(progress);
      }
    },
  });

  return response.data;
};

// 生成专业expose
export const generateExpose = async (propertyId: string): Promise<{ exposeId: string; status: string }> => {
  const response = await api.post(`/app/endpoints/expose_generation/generate/${propertyId}`);
  return response.data;
};

// 获取expose状态
export const getExposeStatus = async (exposeId: string): Promise<{ status: string; progress?: number }> => {
  const response = await api.get(`/app/endpoints/expose_generation/status/${exposeId}`);
  return response.data;
};

// 下载PDF
export const downloadPDF = async (exposeId: string): Promise<Blob> => {
  const response = await api.get(`/app/endpoints/expose_generation/download/${exposeId}`, {
    responseType: 'blob',
  });
  return response.data;
};

// 获取expose预览数据
export const getExposePreview = async (exposeId: string): Promise<{
  title?: string;
  address: string;
  price?: number;
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  yearBuilt?: number;
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
  agentInfo?: {
    companyLogo?: string;
    responsiblePerson: string;
    address: string;
    website?: string;
    phone: string;
    userType: string;
  };
  images?: Array<{
    url: string;
    isPrimary: boolean;
  }>;
}> => {
  const response = await api.get(`/app/endpoints/expose_generation/preview/${exposeId}`);
  return response.data;
};

// 生成 AI 描述
export const generateAIDescription = async (
  propertyData: Omit<PropertyFormData, 'images'>,
  style: 'formal' | 'marketing' | 'family' = 'formal'
): Promise<{ suggested_description: string; style: string; message: string }> => {
  const response = await api.post('/app/endpoints/properties/generate-description', {
    ...propertyData,
    property_type: propertyData.property_type,
    status: 'for_sale',
    price_type: 'total',
    area_sqm: propertyData.area,
    rooms: propertyData.rooms,
    bedrooms: propertyData.bedrooms,
    bathrooms: propertyData.bathrooms,
    year_built: propertyData.yearBuilt,
    country: 'Germany',
    city: propertyData.city,
    heating_system: propertyData.heating_system,
    energy_source: propertyData.energy_source,
    energy_certificate: propertyData.energy_certificate,
    parking: propertyData.parking,
    renovation_quality: propertyData.renovation_quality,
    floor_type: propertyData.floor_type,
    contact_person: propertyData.contact_person,
    contact_phone: propertyData.contact_phone,
    contact_email: propertyData.contact_email,
    contact_person2: propertyData.contact_person2,
    contact_phone2: propertyData.contact_phone2,
    contact_email2: propertyData.contact_email2,
  }, {
    params: { style }
  });
  return response.data;
};
