'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  ArrowLeft, 
  ArrowRight, 
  Home, 
  Info, 
  FileText, 
  Image as ImageIcon,
  Upload,
  X,
  CheckCircle,
  Eye
} from 'lucide-react';
import { useMultiStepForm } from '@/hooks/useMultiStepForm';
import { useUploadImages } from '@/hooks/useUploadImages';
import { PropertyFormData } from '@/types/property';
import { propertyFormSchema } from '@/lib/validations';
import { cachePropertyData, uploadPropertyImages, generateExpose, generateAIDescription } from '@/services/api';

const steps = [
  { id: 'basic', title: '基本信息', description: '填写房源的基本信息', icon: Info },
  { id: 'details', title: '房屋详情', description: '填写房屋的详细信息', icon: Home },
  { id: 'description', title: '描述文本', description: '添加房源描述', icon: FileText },
  { id: 'images', title: '图片上传', description: '上传房源图片', icon: ImageIcon },
];

export default function NewPropertyPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localFormData, setLocalFormData] = useState<Partial<PropertyFormData>>({});
  const [descriptionStyle, setDescriptionStyle] = useState('formal'); // 新增：描述语气选择
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false); // 新增：描述生成状态

  const {
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    goToStep,
    updateFormData,
    canGoPrev,
  } = useMultiStepForm<PropertyFormData>({
    steps,
    initialData: localFormData,
    onStepChange: (step, data) => {
      setLocalFormData(data);
    },
  });

  const {
    isUploading,
    uploadProgress,
  } = useUploadImages();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    trigger,
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertyFormSchema),
    mode: 'onChange',
    defaultValues: localFormData as PropertyFormData,
  });

  const watchedValues = watch();

  // 更新本地表单数据
  const updateLocalData = (data: Partial<PropertyFormData>) => {
    const newData = { ...localFormData, ...data };
    setLocalFormData(newData);
    updateFormData(newData);
    
    // 同步到React Hook Form
    Object.entries(data).forEach(([key, value]) => {
      setValue(key as keyof PropertyFormData, value);
    });
  };

  // 验证当前步骤
  const validateCurrentStep = async () => {
    let isValid = false;
    
    switch (currentStep) {
      case 0:
        isValid = await trigger(['title', 'property_type', 'city', 'postal_code', 'address', 'price']);
        break;
      case 1:
        isValid = await trigger(['rooms', 'area', 'yearBuilt']);
        break;
      case 2:
        isValid = true; // 描述是可选的
        break;
      case 3:
        // 图片验证：确保至少有一张图片
        if (localFormData.images && localFormData.images.length > 0) {
          isValid = true;
        } else {
          isValid = false;
        }
        break;
    }
    
    return isValid;
  };

  // 下一步
  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      updateLocalData(watchedValues);
      nextStep();
    }
  };

  // 上一步
  const handlePrev = () => {
    updateLocalData(watchedValues);
    prevStep();
  };

  // 预览效果
  const handlePreview = () => {
    // 将当前表单数据转换为预览格式并保存到localStorage
    const previewData = {
      title: localFormData.title || '',
      property_type: localFormData.property_type || '',
      city: localFormData.city || '',
      postal_code: localFormData.postal_code || '',
      address: localFormData.address || '',
      price: localFormData.price || 0,
      rooms: localFormData.rooms || 0,
      area: localFormData.area || 0,
      yearBuilt: localFormData.yearBuilt,
      description: localFormData.description || '',
      images: localFormData.images || []
    };
    
    // 保存到localStorage
    localStorage.setItem('tempPropertyData', JSON.stringify(previewData));
    
    // 跳转到预览页面
    router.push('/properties/preview/preview');
  };

  // 提交表单
  const onSubmit = async (data: PropertyFormData) => {
    console.log('开始提交表单，数据:', data);
    if (isSubmitting) {
      console.log('表单正在提交中，忽略重复提交');
      return;
    }
    
    setIsSubmitting(true);
    try {
      console.log('步骤1: 开始上传房源数据...');
      // 步骤1: 上传房源数据
      const { id: propertyId } = await cachePropertyData({
        title: data.title,
        property_type: data.property_type,
        city: data.city,
        postal_code: data.postal_code,
        address: data.address,
        price: data.price,
        rooms: data.rooms,
        area: data.area,
        yearBuilt: data.yearBuilt,
        description: data.description || '',
      });
      console.log('房源数据上传成功，ID:', propertyId);

      // 步骤2: 上传图片
      if (data.images.length > 0) {
        console.log('步骤2: 开始上传图片，数量:', data.images.length);
        await uploadPropertyImages(propertyId, data.images);
        console.log('图片上传成功');
      } else {
        console.log('没有图片需要上传');
      }

      // 步骤3: 生成专业expose
      console.log('步骤3: 开始生成专业expose...');
      const { exposeId } = await generateExpose(propertyId);
      console.log('Expose生成成功，ID:', exposeId);

      // 跳转到expose生成页面
      console.log('跳转到expose页面:', `/properties/${propertyId}/expose/${exposeId}`);
      router.push(`/properties/${propertyId}/expose/${exposeId}`);
    } catch (error) {
      console.error('提交失败:', error);
      alert(`提交失败: ${error instanceof Error ? error.message : '未知错误'}，请重试`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 图片处理
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    updateLocalData({ images: files });
  };

  const removeImage = (index: number) => {
    const newImages = [...(localFormData.images || [])];
    newImages.splice(index, 1);
    updateLocalData({ images: newImages });
  };

  // 自动生成描述
  const generateDescription = () => {
    const { title, address, rooms, area, yearBuilt } = localFormData;
    if (title && address && rooms && area && yearBuilt) {
      const description = `这是一套位于${address}的${title}，拥有${rooms}个房间，建筑面积${area}平方米，建于${yearBuilt}年。房屋位置优越，交通便利，配套设施完善，是理想的居住选择。`;
      updateLocalData({ description });
      setValue('description', description);
    }
  };

  // 新增：AI 生成描述
  const handleGenerateAIDescription = async () => {
    if (!localFormData.title || !localFormData.property_type || !localFormData.city || !localFormData.postal_code || !localFormData.address || !localFormData.rooms || !localFormData.area || !localFormData.yearBuilt) {
      alert('请先完成基本信息和房屋详情的填写，以便 AI 生成描述。');
      return;
    }

    setIsGeneratingDescription(true);
    try {
      const response = await generateAIDescription({
        title: localFormData.title,
        property_type: localFormData.property_type,
        city: localFormData.city,
        postal_code: localFormData.postal_code,
        address: localFormData.address,
        price: localFormData.price || 0,
        rooms: localFormData.rooms,
        area: localFormData.area,
        yearBuilt: localFormData.yearBuilt
      }, descriptionStyle as 'formal' | 'marketing' | 'family');
      
      updateLocalData({ suggested_description: response.suggested_description });
      setValue('description', response.suggested_description);
    } catch (error) {
      console.error('AI 描述生成失败:', error);
      alert(`AI 描述生成失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  // 新增：判断是否可以生成描述
  const canGenerateDescription = localFormData.title && 
    localFormData.property_type && 
    localFormData.city && 
    localFormData.postal_code && 
    localFormData.address && 
    localFormData.rooms && 
    localFormData.area && 
    localFormData.yearBuilt;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">创建新房源</h1>
          <p className="mt-2 text-gray-600">填写房源信息，创建专业的房源展示</p>
        </div>

        {/* 步骤指示器 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              const isClickable = index <= currentStep;

              return (
                <div key={step.id} className="flex flex-col items-center">
                  <button
                    onClick={() => isClickable && goToStep(index)}
                    disabled={!isClickable}
                    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                      isActive
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : isCompleted
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-gray-300 bg-white text-gray-400'
                    } ${isClickable ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed'}`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </button>
                  <div className="mt-2 text-center">
                    <div className={`text-sm font-medium ${
                      isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{step.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* 连接线 */}
          <div className="relative mt-4">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2"></div>
            <div 
              className="absolute top-1/2 left-0 h-0.5 bg-blue-600 transition-all duration-500 -translate-y-1/2"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* 表单内容 */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* 步骤1: 基本信息 */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    房源标题 *
                  </label>
                  <input
                    {...register('title')}
                    type="text"
                    id="title"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="例如：精装修三室两厅，南北通透"
                    defaultValue={localFormData.title}
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="property_type" className="block text-sm font-medium text-gray-700 mb-2">
                    房源类型 *
                  </label>
                  <select
                    {...register('property_type')}
                    id="property_type"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.property_type ? 'border-red-500' : 'border-gray-300'
                    }`}
                    defaultValue={localFormData.property_type || 'apartment'}
                  >
                    <option value="apartment">公寓</option>
                    <option value="house">独栋房屋</option>
                    <option value="villa">别墅</option>
                    <option value="penthouse">顶层公寓</option>
                    <option value="duplex">复式</option>
                    <option value="studio">开间</option>
                  </select>
                  {errors.property_type && (
                    <p className="mt-1 text-sm text-red-600">{errors.property_type.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                      城市 *
                    </label>
                    <input
                      {...register('city')}
                      type="text"
                      id="city"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="例如：北京"
                      defaultValue={localFormData.city || '北京'}
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-2">
                      邮政编码 *
                    </label>
                    <input
                      {...register('postal_code')}
                      type="text"
                      id="postal_code"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.postal_code ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="例如：100000"
                      defaultValue={localFormData.postal_code || ''}
                    />
                    {errors.postal_code && (
                      <p className="mt-1 text-sm text-red-600">{errors.postal_code.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    详细地址 *
                  </label>
                  <input
                    {...register('address')}
                    type="text"
                    id="address"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="例如：北京市朝阳区建国门外大街1号"
                    defaultValue={localFormData.address}
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    价格 (万元) *
                  </label>
                  <input
                    {...register('price', { valueAsNumber: true })}
                    type="number"
                    id="price"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="例如：500"
                    min="0"
                    step="0.01"
                    defaultValue={localFormData.price}
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* 步骤2: 房屋详情 */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="rooms" className="block text-sm font-medium text-gray-700 mb-2">
                      房间数量 *
                    </label>
                    <input
                      {...register('rooms', { valueAsNumber: true })}
                      type="number"
                      id="rooms"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.rooms ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="例如：3"
                      min="0"
                      max="50"
                      defaultValue={localFormData.rooms}
                    />
                    {errors.rooms && (
                      <p className="mt-1 text-sm text-red-600">{errors.rooms.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">
                      建筑面积 (m²) *
                    </label>
                    <input
                      {...register('area', { valueAsNumber: true })}
                      type="number"
                      id="area"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.area ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="例如：120"
                      min="1"
                      max="10000"
                      step="0.01"
                      defaultValue={localFormData.area}
                    />
                    {errors.area && (
                      <p className="mt-1 text-sm text-red-600">{errors.area.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="yearBuilt" className="block text-sm font-medium text-gray-700 mb-2">
                      建成年份 *
                    </label>
                    <input
                      {...register('yearBuilt', { valueAsNumber: true })}
                      type="number"
                      id="yearBuilt"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.yearBuilt ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="例如：2010"
                      min="1800"
                      max={new Date().getFullYear()}
                      defaultValue={localFormData.yearBuilt}
                    />
                    {errors.yearBuilt && (
                      <p className="mt-1 text-sm text-red-600">{errors.yearBuilt.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 步骤3: 描述文本 */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      房源描述
                    </label>
                    <div className="flex items-center gap-3">
                      {/* 语气选择 */}
                      <select
                        id="description-style"
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        onChange={(e) => setDescriptionStyle(e.target.value)}
                        value={descriptionStyle}
                      >
                        <option value="formal">正式</option>
                        <option value="marketing">市场化</option>
                        <option value="family">温馨家庭</option>
                      </select>
                      
                      {/* AI 生成按钮 */}
                      <button
                        type="button"
                        onClick={handleGenerateAIDescription}
                        disabled={!canGenerateDescription || isGeneratingDescription}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingDescription ? (
                          <>
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            生成中...
                          </>
                        ) : (
                          <>
                            <FileText className="w-4 h-4" />
                            AI 生成描述
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* 描述编辑框 */}
                  <textarea
                    {...register('description')}
                    id="description"
                    rows={6}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="描述房源的特点、优势、周边配套等信息..."
                    defaultValue={localFormData.description}
                  />
                  
                  {/* AI 生成的描述（可编辑） */}
                  {localFormData.suggested_description && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-blue-800">AI 生成的描述</h4>
                        <button
                          type="button"
                          onClick={() => {
                            updateLocalData({ description: localFormData.suggested_description });
                            setValue('description', localFormData.suggested_description);
                          }}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          使用此描述
                        </button>
                      </div>
                      <textarea
                        value={localFormData.suggested_description}
                        onChange={(e) => updateLocalData({ suggested_description: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 text-sm border border-blue-200 rounded-md focus-ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        placeholder="AI 生成的描述..."
                      />
                    </div>
                  )}
                  
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    最多2000个字符，当前 {localFormData.description?.length || 0}/2000
                  </p>
                </div>
              </div>
            )}

            {/* 步骤4: 图片上传 */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    房源图片 *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      {...register('images')}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="w-12 h-12 text-gray-400 mb-4" />
                      <div className="text-lg font-medium text-gray-700 mb-2">
                        点击上传图片
                      </div>
                      <div className="text-sm text-gray-500">
                        支持 JPG、PNG、WebP 格式，最多20张
                      </div>
                    </label>
                  </div>
                  {errors.images && (
                    <p className="mt-1 text-sm text-red-600">{errors.images.message}</p>
                  )}
                </div>

                {/* 图片预览 */}
                {localFormData.images && localFormData.images.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      已选择的图片 ({localFormData.images.length}/20)
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {localFormData.images.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`预览图片 ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg">
                            {file.name.length > 20 ? file.name.substring(0, 20) + '...' : file.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 上传进度 */}
                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">上传进度</span>
                      <span className="text-blue-600 font-medium">
                        {Object.values(uploadProgress)[0] || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Object.values(uploadProgress)[0] || 0}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 表单操作按钮 */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>步骤 {currentStep + 1} / {totalSteps}</span>
              </div>
              
              <div className="flex items-center gap-4">
                {canGoPrev && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    上一步
                  </button>
                )}
                
                {currentStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    下一步
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handlePreview}
                      disabled={!isValid}
                      className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      预览效果
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          提交中...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          提交表单
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* 调试信息 */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">调试信息</h3>
          
          {/* 测试按钮 */}
          <div className="mb-4 p-3 bg-yellow-100 rounded border border-yellow-300">
            <h4 className="text-sm font-medium text-yellow-800 mb-2">测试功能</h4>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => console.log('当前表单数据:', localFormData)}
                className="px-3 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                打印表单数据
              </button>
              <button
                type="button"
                onClick={() => console.log('当前步骤:', currentStep, '总步骤:', steps.length)}
                className="px-3 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                打印步骤信息
              </button>
              <button
                type="button"
                onClick={() => console.log('表单验证状态:', errors)}
                className="px-3 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                打印验证状态
              </button>
            </div>
          </div>
          
          <pre className="text-xs text-gray-600 overflow-auto">
            {JSON.stringify({
              currentStep,
              totalSteps: steps.length,
              isLastStep: currentStep === steps.length - 1,
              canGoNext: currentStep < steps.length - 1,
              formData: {
                ...localFormData,
                images: localFormData.images ? localFormData.images.map((file, index) => ({
                  name: file.name,
                  size: file.size,
                  type: file.type,
                  lastModified: file.lastModified
                })) : []
              },
              errors: Object.keys(errors).reduce((acc, key) => {
                const error = errors[key as keyof typeof errors];
                if (error) {
                  acc[key] = {
                    message: typeof error.message === 'string' ? error.message : undefined,
                    type: typeof error.type === 'string' ? error.type : undefined
                  };
                }
                return acc;
              }, {} as Record<string, { message?: string; type?: string }>),
              isSubmitting,
              isValid
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}