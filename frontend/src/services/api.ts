import axios from 'axios';
import { PropertyFormData, PropertyData, PropertyImage, Images } from '@/types/property';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 缓存房源数据
export const cachePropertyData = async (data: Omit<PropertyFormData, 'images'> & { images: Images }): Promise<{ id: string }> => {
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
  images: Array<File & { category?: keyof Images }>,
  onProgress?: (progress: number) => void
): Promise<{ images: PropertyImage[] }> => {
  const formData = new FormData();
  
  // 添加所有图片到 images 字段
  const categories: string[] = [];

  images.forEach((image, index) => {
    formData.append('images', image);
    
    // 收集分类信息
    const imageWithMeta = image as File & { category?: string };
    categories.push(imageWithMeta.category || '');
  });

  // 一次性添加所有分类
  categories.forEach(category => {
    formData.append('image_categories', category);
  });

  // 添加调试日志
  console.log('FormData contents:', {
    categories,
    imageCount: images.length
  });

  console.log('Uploading images:', {
    propertyId,
    imageCount: images.length,
    formDataEntries: Array.from(formData.entries())
  });

  try {
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

    console.log('Upload response:', response.data);
    return response.data;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Upload error:', errorMessage);
    throw error;
  }
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
  propertyData: Partial<PropertyFormData>,
  style: 'formal' | 'marketing' | 'family' = 'formal'
): Promise<{ suggested_description: string; style: string; message: string }> => {
  const response = await api.post('/app/endpoints/properties/generate-description', {
    ...propertyData,  // 传递所有房源数据
    style            // 添加风格参数
  });
  return response.data;
};

// 生成 AI 地理位置描述 (简化版)
export const generateAILocationDescriptionSimple = async (
  city: string,
  address: string,
  style: 'formal' | 'marketing' | 'family' = 'formal'
): Promise<{ location_description: string; message: string }> => {
  const response = await api.post('/app/endpoints/properties/generate-location-description', {
    city,
    address,
  }, {
    params: { style }
  });
  return response.data;
};
