import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PropertyFormData, AgentInfo, Images } from '@/types/property';
import { 
  usePropertyForm, 
  useImageUpload, 
  useAIGeneration,
  useMultiStepForm,
  FormStep
} from '@/hooks';
import {
  BasicInfoStep,
  PropertyDetailsStep,
  DescriptionStep,
  ImageUploadStep,
  ContactInfoStep,
  PropertyFormNavigation
} from '@/components/organisms';
import { ProgressStep } from '@/components/organisms';

// 表单步骤配置
const FORM_STEPS: FormStep[] = [
  {
    id: 0,
    title: 'Grundinformationen',
    description: 'Titel, Typ, Adresse, Preis',
    icon: '🏠',
    isCompleted: false,
    isValid: false,
    isRequired: true,
  },
  {
    id: 1,
    title: 'Immobiliendetails',
    description: 'Zimmer, Fläche, Ausstattung',
    icon: '📋',
    isCompleted: false,
    isValid: false,
    isRequired: true,
  },
  {
    id: 2,
    title: 'Beschreibung',
    description: 'Immobilien- und Lagebeschreibung',
    icon: '✍️',
    isCompleted: false,
    isValid: true, // 描述是可选的
    isRequired: false,
  },
  {
    id: 3,
    title: 'Bilder',
    description: 'Kategorisierte Immobilienbilder',
    icon: '📸',
    isCompleted: false,
    isValid: false,
    isRequired: true,
  },
  {
    id: 4,
    title: 'Kontakt',
    description: 'Kontaktinformationen',
    icon: '📞',
    isCompleted: false,
    isValid: false,
    isRequired: true,
  },
];

export interface PropertyFormProps {
  initialData?: Partial<PropertyFormData>;
  agentInfo?: AgentInfo | null;
  onSaveDraft?: (data: PropertyFormData) => Promise<void>;
  onSubmit?: (data: PropertyFormData) => Promise<void>;
  onUpdateImageUrlsRef?: (updateFn: (category: keyof Images, urls: string[]) => void) => void;
  isEditMode?: boolean;
}

export default function PropertyForm({
  initialData = {},
  agentInfo,
  onSaveDraft,
  onSubmit,
  onUpdateImageUrlsRef,
  isEditMode = false,
}: PropertyFormProps) {
  const router = useRouter();

  // 使用自定义hooks
  const {
    currentStep,
    formData,
    nextStep,
    prevStep,
    goToStep,
    updateFormData,
    canGoNext,
    canGoPrev,
  } = useMultiStepForm({
    steps: FORM_STEPS,
    initialData,
  });

  const {
    form,
    register,
    handleSubmit,
    errors,
    isValid,
    setValue,
    watch,
    trigger,
    isSubmitting,
    localFormData,
    descriptionStyle,
    locationDescriptionStyle,
    isGeneratingDescription,
    isGeneratingLocationDescription,
    canGenerateDescription,
    canGenerateLocationDescription,
    updateLocalData,
    validateCurrentStep,
    resetForm,
    getFormSnapshot,
    setIsSubmitting,
    setDescriptionStyle,
    setLocationDescriptionStyle,
    setIsGeneratingDescription,
    setIsGeneratingLocationDescription,
  } = usePropertyForm({
    initialData,
    agentInfo,
  });

  // 使用 useCallback 包装 onImageChange 回调，防止无限循环
  const handleImageChange = useCallback((newImages: Images) => {
    console.log('🔄 图片数据变化:', newImages);
    console.log('📊 图片统计:');
    Object.entries(newImages).forEach(([category, files]) => {
      if (files && files.length > 0) {
        console.log(`  ${category}: ${files.length} 张图片`);
        files.forEach((file: File, index: number) => {
          console.log(`    - ${index}: ${file.name} (${file.size} bytes, ${file.type})`);
        });
      }
    });
    
    updateLocalData({ images: newImages });
    setValue('images', newImages);
  }, [updateLocalData, setValue]);

  // 使用 useCallback 包装 AI 生成回调，防止无限循环
  const handleDescriptionGenerated = useCallback((description: string) => {
    setValue('description', description);
    updateLocalData({ description });
  }, [setValue, updateLocalData]);

  const handleLocationDescriptionGenerated = useCallback((locationDescription: string) => {
    setValue('locationDescription', locationDescription);
    updateLocalData({ locationDescription });
  }, [setValue, updateLocalData]);

  const {
    images,
    imageUrls,
    isDragOver,
    dragOverTab,
    addImages,
    removeImage,
    handleImageUpload,
    handleDrop,
    setDragState,
    resetImages,
    getCategoryImageCount,
    getTotalImageCount,
    isCategoryEmpty,
    hasAnyImages,
    getAllImages,
    getTabDisplayName,
    maxImagesPerCategory,
    updateImageUrls,
  } = useImageUpload({
    onImageChange: handleImageChange,
  });

  // 将 updateImageUrls 函数传递给父组件
  useEffect(() => {
    if (onUpdateImageUrlsRef) {
      onUpdateImageUrlsRef(updateImageUrls);
    }
  }, [onUpdateImageUrlsRef, updateImageUrls]);

  const {
    generateDescription,
    generateLocationDescription,
    generateAllDescriptions,
    resetAIGeneration,
  } = useAIGeneration({
    onDescriptionGenerated: handleDescriptionGenerated,
    onLocationDescriptionGenerated: handleLocationDescriptionGenerated,
    onError: (error) => {
      console.error('AI Generation Error:', error);
      // 这里可以添加错误提示UI
    },
  });

  // 状态管理
  const [progressSteps, setProgressSteps] = useState<ProgressStep[]>([]);
  const [showProgressDetails, setShowProgressDetails] = useState(false);

  // 更新进度步骤状态
  const updateProgressSteps = useCallback(() => {
    const newProgressSteps: ProgressStep[] = FORM_STEPS.map((step, index) => {
      let isCompleted = false;
      let isValid = false;
      let errorCount = 0;
      const warningCount = 0;

      // 根据步骤类型判断完成状态和验证状态
      switch (index) {
        case 0: // 基础信息
          isCompleted = !!(localFormData.title && localFormData.property_type && localFormData.city && localFormData.plz && localFormData.address && localFormData.price);
          isValid = isCompleted;
          errorCount = Object.keys(errors).filter(key => ['title', 'property_type', 'city', 'plz', 'address', 'price'].includes(key)).length;
          break;
        case 1: // 房产详情
          isCompleted = !!(localFormData.rooms && localFormData.bedrooms && localFormData.bathrooms && localFormData.area && localFormData.yearBuilt);
          isValid = isCompleted;
          errorCount = Object.keys(errors).filter(key => ['rooms', 'bedrooms', 'bathrooms', 'area', 'yearBuilt', 'heating_system', 'energy_source', 'energy_certificate', 'parking', 'renovation_quality', 'floor_type'].includes(key)).length;
          break;
        case 2: // 描述
          isCompleted = true; // 描述是可选的
          isValid = true;
          break;
        case 3: // 图片
          isCompleted = hasAnyImages();
          isValid = isCompleted;
          break;
        case 4: // 联系信息
          isCompleted = !!(localFormData.contact_person && localFormData.contact_phone && localFormData.contact_email);
          isValid = isCompleted;
          errorCount = Object.keys(errors).filter(key => ['contact_person', 'contact_phone', 'contact_email'].includes(key)).length;
          break;
      }

      return {
        id: step.id,
        title: step.title,
        isCompleted,
        isValid,
        isRequired: step.isRequired ?? true, // 提供默认值
        errorCount,
        warningCount,
      };
    });

    setProgressSteps(newProgressSteps);
  }, [localFormData, errors, hasAnyImages]);

  // 监听表单数据变化，更新进度
  useEffect(() => {
    updateProgressSteps();
  }, [updateProgressSteps]);

  // 步骤验证
  const validateAndProceed = useCallback(async () => {
    const isValid = await validateCurrentStep(currentStep);
    if (isValid) {
      nextStep();
    }
  }, [validateCurrentStep, currentStep, nextStep]);

  // 步骤回退
  const handlePrevStep = useCallback(() => {
    prevStep();
  }, [prevStep]);

  // 步骤跳转
  const handleStepClick = useCallback((stepIndex: number) => {
    // 只能跳转到已完成的步骤或当前步骤
    if (stepIndex <= currentStep || progressSteps[stepIndex]?.isCompleted) {
      goToStep(stepIndex);
    }
  }, [currentStep, progressSteps, goToStep]);

  // 保存草稿
  const handleSaveDraft = useCallback(async () => {
    if (!onSaveDraft) return;
    
    try {
      setIsSubmitting(true);
      const formSnapshot = getFormSnapshot();
      await onSaveDraft(formSnapshot as PropertyFormData);
      // 这里可以添加成功提示
    } catch (error) {
      console.error('Save draft error:', error);
      // 这里可以添加错误提示
    } finally {
      setIsSubmitting(false);
    }
  }, [onSaveDraft, setIsSubmitting, getFormSnapshot]);

  // 表单提交
  const handleFormSubmit = useCallback(async (data: any) => {
    console.log('🚀 开始表单提交...');
    console.log('📝 表单数据:', data);
    console.log('🖼️ 图片数据:', images);
    console.log('🔗 图片URLs:', imageUrls);
    console.log('✅ 表单验证状态:', isValid);
    console.log('❌ 表单错误:', errors);
    
    if (!onSubmit) {
      console.warn('⚠️ onSubmit 回调未定义');
      return;
    }
    
    // 检查表单验证状态
    if (!isValid) {
      console.error('❌ 表单验证失败');
      console.log('表单错误详情:', errors);
      alert('请检查表单填写是否正确');
      return;
    }
    
    // 验证表单数据完整性
    const requiredFields = ['title', 'property_type', 'city', 'plz', 'address', 'price'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      console.error('❌ 缺少必填字段:', missingFields);
      alert(`请填写以下必填字段: ${missingFields.join(', ')}`);
      return;
    }
    
    // 验证图片数据
    if (!images || Object.keys(images).length === 0) {
      console.warn('⚠️ 没有上传图片');
      if (!confirm('您还没有上传任何图片，确定要继续吗？')) {
        return;
      }
    } else {
      // 检查图片数据完整性
      let totalImages = 0;
      Object.entries(images).forEach(([category, files]) => {
        if (files && files.length > 0) {
          totalImages += files.length;
          console.log(`📁 ${category}: ${files.length} 张图片`);
        }
      });
      
      if (totalImages === 0) {
        console.warn('⚠️ 图片数组为空');
        if (!confirm('没有发现有效的图片数据，确定要继续吗？')) {
          return;
        }
      } else {
        console.log(`✅ 总共 ${totalImages} 张图片`);
      }
    }
    
    try {
      setIsSubmitting(true);
      console.log('⏳ 设置提交状态为 true');
      
      await onSubmit(data as PropertyFormData);
      console.log('✅ 表单提交成功');
    } catch (error) {
      console.error('❌ 表单提交失败:', error);
      alert('表单提交失败，请重试');
    } finally {
      setIsSubmitting(false);
      console.log('⏹️ 设置提交状态为 false');
    }
  }, [onSubmit, setIsSubmitting, images, imageUrls, isValid, errors]);

  // 渲染当前步骤
  const renderCurrentStep = () => {
    const commonProps = {
      register,
      errors,
      defaultValues: localFormData,
    };

    switch (currentStep) {
      case 0:
        return <BasicInfoStep {...commonProps} />;
      case 1:
        return <PropertyDetailsStep {...commonProps} />;
      case 2:
        return (
          <DescriptionStep
            {...commonProps}
            setValue={setValue}
            descriptionStyle={descriptionStyle}
            locationDescriptionStyle={locationDescriptionStyle}
            isGeneratingDescription={isGeneratingDescription}
            isGeneratingLocationDescription={isGeneratingLocationDescription}
            canGenerateDescription={canGenerateDescription}
            canGenerateLocationDescription={canGenerateLocationDescription}
            onDescriptionStyleChange={setDescriptionStyle}
            onLocationDescriptionStyleChange={setLocationDescriptionStyle}
            onGenerateDescription={() => generateDescription(localFormData)}
            onGenerateLocationDescription={() => generateLocationDescription(localFormData.city || '', localFormData.address || '')}
          />
        );
      case 3:
        return (
          <ImageUploadStep
            images={images}
            imageUrls={imageUrls}
            isDragOver={isDragOver}
            dragOverTab={dragOverTab}
            onImageUpload={handleImageUpload}
            onRemoveImage={removeImage}
            onDrop={handleDrop}
            onDragStateChange={setDragState}
            getTabDisplayName={getTabDisplayName}
            getCategoryImageCount={getCategoryImageCount}
            getTotalImageCount={getTotalImageCount}
            maxImagesPerCategory={maxImagesPerCategory}
          />
        );
      case 4:
        return <ContactInfoStep {...commonProps} />;
      default:
        return <div>Unbekannter Schritt</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 表单导航 */}
      <PropertyFormNavigation
        currentStep={currentStep}
        steps={FORM_STEPS}
        onStepClick={handleStepClick}
        onNextStep={validateAndProceed}
        onPrevStep={handlePrevStep}
        canGoToNext={canGoNext}
        canGoToPrev={canGoPrev}
        isSubmitting={isSubmitting}
        totalSteps={FORM_STEPS.length}
      />

      {/* 主内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* 右侧：表单内容 */}
          <div className="lg:col-span-3">
            <form 
              onSubmit={(e) => {
                console.log('📝 表单 onSubmit 事件被触发');
                handleSubmit(handleFormSubmit)(e);
              }} 
              className="space-y-8"
            >
              {/* 当前步骤内容 */}
              <div className="bg-white rounded-lg border border-gray-200 p-8">
                {renderCurrentStep()}
              </div>

              {/* 底部操作按钮 */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  {/* 左侧：后退按钮 */}
                  <div>
                    {canGoPrev && (
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        disabled={isSubmitting}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Zurück
                      </button>
                    )}
                  </div>

                  {/* 右侧：操作按钮 */}
                  <div className="flex items-center space-x-3">

                    {/* 下一步按钮 */}
                    {canGoNext && currentStep < FORM_STEPS.length - 1 && (
                      <button
                        type="button"
                        onClick={validateAndProceed}
                        disabled={isSubmitting}
                        className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Weiter
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}

                    {/* 完成按钮（最后一步） */}
                    {currentStep === FORM_STEPS.length - 1 && (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        onClick={() => {
                          console.log('🔘 Expose erstellen 按钮被点击');
                          console.log('📊 表单验证状态:', isValid);
                          console.log('❌ 表单错误:', errors);
                          
                          // 手动触发表单验证
                          console.log('🔍 手动触发表单验证...');
                          trigger().then((isValid) => {
                            console.log('✅ 表单验证结果:', isValid);
                            if (isValid) {
                              console.log('🎯 表单验证通过，应该可以提交');
                            } else {
                              console.log('❌ 表单验证失败，错误详情:', errors);
                            }
                          });
                        }}
                        className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Wird erstellt...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Exposé erstellen
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
