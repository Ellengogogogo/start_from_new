'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Home, 
  MapPin, 
  DollarSign, 
  Bed, 
  Square, 
  Calendar,
  FileText,
  Image as ImageIcon,
  Share2,
  Download,
  Edit,
  Star,
  Heart,
  Phone,
  Mail,
  
  Globe,
  X,
  ArrowRight
} from 'lucide-react';
import { PropertyPreview, PropertyData, PropertyImage } from '@/types/property';
import { getCachedPropertyData, getCachedPropertyImages } from '@/services/api';

export default function PropertyPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;
  
  const [propertyPreview, setPropertyPreview] = useState<PropertyPreview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // 并行获取房源数据和图片
        const [propertyData, images] = await Promise.all([
          getCachedPropertyData(propertyId),
          getCachedPropertyImages(propertyId)
        ]);
        
        setPropertyPreview({
          property: propertyData,
          images: images
        });
      } catch (err) {
        console.error('获取房源数据失败:', err);
        setError('获取房源数据失败，请检查ID是否正确');
      } finally {
        setIsLoading(false);
      }
    };

    if (propertyId) {
      fetchPropertyData();
    }
  }, [propertyId]);

  const formatPrice = (price: number) => {
    if (price >= 10000) {
      return `${(price / 10000).toFixed(1)}亿`;
    } else if (price >= 1000) {
      return `${(price / 1000).toFixed(1)}千万`;
    } else {
      return `${price}万`;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (error || !propertyPreview) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">加载失败</h2>
          <p className="text-gray-600 mb-4">{error || '房源数据不存在'}</p>
          <button
            onClick={() => router.push('/properties/new')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            创建新房源
          </button>
        </div>
      </div>
    );
  }

  const { property, images } = propertyPreview;
  const primaryImage = images.find(img => img.isPrimary) || images[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.push('/properties/new')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              返回创建
            </button>
            
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Heart className="w-5 h-5" />
                收藏
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Share2 className="w-5 h-5" />
                分享
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Edit className="w-5 h-5" />
                编辑
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 房源标题和基本信息 */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{property.title}</h1>
              <div className="flex items-center gap-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{property.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>创建于 {formatDate(property.createdAt)}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {formatPrice(property.price)}
              </div>
              <div className="text-sm text-gray-500">参考价格</div>
            </div>
          </div>

          {/* 房源特征 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Bed className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-lg font-semibold text-gray-900">{property.rooms}间</div>
              <div className="text-sm text-gray-500">房间数量</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Square className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-lg font-semibold text-gray-900">{property.area} m²</div>
              <div className="text-sm text-gray-500">建筑面积</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-lg font-semibold text-gray-900">{property.yearBuilt}</div>
              <div className="text-sm text-gray-500">建成年份</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Star className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-lg font-semibold text-gray-900">A级</div>
              <div className="text-sm text-gray-500">房源等级</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：图片展示 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* 主图片 */}
              <div className="relative">
                <img
                  src={primaryImage?.url || '/placeholder-house.jpg'}
                  alt={property.title}
                  className="w-full h-96 object-cover cursor-pointer"
                  onClick={() => setIsImageModalOpen(true)}
                />
                <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                  {selectedImageIndex + 1} / {images.length}
                </div>
              </div>
              
              {/* 缩略图列表 */}
              {images.length > 1 && (
                <div className="p-4 bg-gray-50">
                  <div className="grid grid-cols-6 gap-2">
                    {images.map((image, index) => (
                      <button
                        key={image.id}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative overflow-hidden rounded-lg border-2 transition-all ${
                          index === selectedImageIndex
                            ? 'border-blue-500 ring-2 ring-blue-200'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={image.url}
                          alt={`${property.title} - 图片 ${index + 1}`}
                          className="w-full h-20 object-cover"
                        />
                        {image.isPrimary && (
                          <div className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-1 py-0.5 rounded">
                            主图
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 右侧：联系信息和描述 */}
          <div className="space-y-6">
            {/* 联系信息 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-blue-600" />
                联系信息
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900">+86 138 0013 8000</div>
                    <div className="text-sm text-gray-500">房产经纪人</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900">agent@example.com</div>
                    <div className="text-sm text-gray-500">邮箱地址</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900">www.example.com</div>
                    <div className="text-sm text-gray-500">官方网站</div>
                  </div>
                </div>
              </div>
              
              <button className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
                立即咨询
              </button>
            </div>

            {/* 房源描述 */}
            {property.description && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  房源描述
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {property.description}
                </p>
              </div>
            )}

            {/* 操作按钮 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">操作</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="w-5 h-5" />
                  下载房源资料
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Share2 className="w-5 h-5" />
                  分享房源
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Edit className="w-5 h-5" />
                  编辑房源
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 调试信息 */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">调试信息</h3>
          <pre className="text-xs text-gray-600 overflow-auto">
            {JSON.stringify({ propertyId, propertyPreview }, null, 2)}
          </pre>
        </div>
      </div>

      {/* 图片模态框 */}
      {isImageModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div className="relative max-w-4xl max-h-full p-4">
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-75 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>
            
            <img
              src={images[selectedImageIndex]?.url}
              alt={`${property.title} - 图片 ${selectedImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
            
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1);
                  }}
                  className="w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-75 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                
                <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                  {selectedImageIndex + 1} / {images.length}
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0);
                  }}
                  className="w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-75 transition-colors"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
