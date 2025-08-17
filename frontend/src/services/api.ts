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
  const response = await api.post('/api/cache/property-data', data);
  return response.data;
};

// 获取缓存的房源数据
export const getCachedPropertyData = async (id: string): Promise<PropertyData> => {
  const response = await api.get(`/api/cache/property-data/${id}`);
  return response.data;
};

// 获取缓存的房源图片
export const getCachedPropertyImages = async (id: string): Promise<PropertyImage[]> => {
  const response = await api.get(`/api/cache/property-images/${id}`);
  return response.data;
};

// 上传房源图片
export const uploadPropertyImages = async (
  propertyId: string,
  images: File[],
  onProgress?: (progress: number) => void
): Promise<{ images: PropertyImage[] }> => {
  const formData = new FormData();
  images.forEach((image) => {
    formData.append('images', image);
  });

  const response = await api.post(`/api/cache/property-images/${propertyId}`, formData, {
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
  const response = await api.post(`/api/expose/generate/${propertyId}`);
  return response.data;
};

// 获取expose状态
export const getExposeStatus = async (exposeId: string): Promise<{ status: string; progress?: number }> => {
  const response = await api.get(`/api/expose/status/${exposeId}`);
  return response.data;
};

// 下载PDF
export const downloadPDF = async (exposeId: string): Promise<Blob> => {
  const response = await api.get(`/api/expose/download/${exposeId}`, {
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
  area?: number;
  yearBuilt?: number;
  description?: string;
  images?: Array<{
    url: string;
    isPrimary: boolean;
  }>;
}> => {
  const response = await api.get(`/api/expose/preview/${exposeId}`);
  return response.data;
};

// 生成 AI 描述
export const generateAIDescription = async (
  propertyData: Omit<PropertyFormData, 'images'>,
  style: 'formal' | 'marketing' | 'family' = 'formal'
): Promise<{ suggested_description: string; style: string; message: string }> => {
  const response = await api.post('/api/properties/generate-description', {
    ...propertyData,
    property_type: 'house', // 默认类型，可以根据实际需要调整
    status: 'for_sale',
    price_type: 'total',
    area_sqm: propertyData.area,
    rooms: propertyData.rooms,
    bedrooms: propertyData.rooms,
    bathrooms: 1,
    year_built: propertyData.yearBuilt,
    country: 'Germany'
  }, {
    params: { style }
  });
  return response.data;
};
