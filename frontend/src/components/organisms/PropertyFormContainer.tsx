import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PropertyFormData, AgentInfo, Photos } from '@/types/property';
import { 
  usePropertyForm, 
  usePhotoUpload, 
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
  PropertyFormNavigation,
  ProgressIndicator
} from '@/components/organisms';
import { ProgressStep } from '@/components/organisms';

// 表单步骤配置 - 移到组件外部作为常量，避免重新创建
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
    title: 'Fotos',
    description: 'Kategorisierte Immobilienfotos',
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

export interface PropertyFormContainerProps {
  initialData?: Partial<PropertyFormData>;
  agentInfo?: AgentInfo | null;
  onSaveDraft?: (data: PropertyFormData) => Promise<void>;
  onSubmit?: (data: PropertyFormData) => Promise<void>;
  onUpdatePhotoUrlsRef?: (updateFn: (category: keyof Photos, urls: string[]) => void) => void;
  isEditMode?: boolean;
}

export default function PropertyFormContainer({
  initialData = {},
  agentInfo,
  onSaveDraft,
  onSubmit,
  onUpdatePhotoUrlsRef,
  isEditMode = false,
}: PropertyFormContainerProps) {
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

  // 使用 useCallback 包装 onPhotoChange 回调，防止无限循环
  const handlePhotoChange = useCallback((newPhotos: Photos) => {
    updateLocalData({ photos: newPhotos });
    setValue('photos', newPhotos);
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
    photos,
    photoUrls,
    isDragOver,
    dragOverTab,
    addPhotos,
    removePhoto,
    handlePhotoUpload,
    handleDrop,
    setDragState,
    resetPhotos,
    getCategoryPhotoCount,
    getTotalPhotoCount,
    isCategoryEmpty,
    hasAnyPhotos,
    getAllPhotos,
    getTabDisplayName,
    maxPhotosPerCategory,
    updatePhotoUrls,
  } = usePhotoUpload({
    onPhotoChange: handlePhotoChange,
  });

  // 将 updatePhotoUrls 函数传递给父组件
  useEffect(() => {
    if (onUpdatePhotoUrlsRef) {
      onUpdatePhotoUrlsRef(updatePhotoUrls);
    }
  }, [onUpdatePhotoUrlsRef, updatePhotoUrls]);

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
          isCompleted = !!(localFormData.title && localFormData.property_type && localFormData.city && localFormData.postal_code && localFormData.address && localFormData.price);
          isValid = isCompleted;
          errorCount = Object.keys(errors).filter(key => ['title', 'property_type', 'city', 'postal_code', 'address', 'price'].includes(key)).length;
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
        case 3: // 照片
          isCompleted = hasAnyPhotos();
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
  }, [localFormData, errors, hasAnyPhotos]); // 移除 FORM_STEPS，因为它是常量

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
  const handleFormSubmit = useCallback(async (data: PropertyFormData) => {
    if (!onSubmit) return;
    
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      // 提交成功后可以跳转或显示成功信息
    } catch (error) {
      console.error('Form submission error:', error);
      // 这里可以添加错误提示
    } finally {
      setIsSubmitting(false);
    }
  }, [onSubmit, setIsSubmitting]);

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
            photos={photos}
            photoUrls={photoUrls}
            isDragOver={isDragOver}
            dragOverTab={dragOverTab}
            onPhotoUpload={handlePhotoUpload}
            onRemovePhoto={removePhoto}
            onDrop={handleDrop}
            onDragStateChange={setDragState}
            getTabDisplayName={getTabDisplayName}
            getCategoryPhotoCount={getCategoryPhotoCount}
            getTotalPhotoCount={getTotalPhotoCount}
            maxPhotosPerCategory={maxPhotosPerCategory}
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
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
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
                    {/* 保存草稿按钮 */}
                    <button
                      type="button"
                      onClick={handleSaveDraft}
                      disabled={isSubmitting}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                      Als Entwurf speichern
                    </button>

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
