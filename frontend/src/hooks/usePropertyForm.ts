import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PropertyFormData, AgentInfo } from '@/types/property';
import { propertyFormSchema } from '@/lib/validations';

export interface UsePropertyFormOptions {
  initialData?: Partial<PropertyFormData>;
  agentInfo?: AgentInfo | null;
}

export function usePropertyForm({ initialData = {}, agentInfo }: UsePropertyFormOptions) {
  // 表单状态
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localFormData, setLocalFormData] = useState<Partial<PropertyFormData>>(initialData);
  const [descriptionStyle, setDescriptionStyle] = useState<'formal' | 'marketing' | 'family'>('formal');
  const [locationDescriptionStyle, setLocationDescriptionStyle] = useState<'formal' | 'marketing' | 'family'>('formal');
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [isGeneratingLocationDescription, setIsGeneratingLocationDescription] = useState(false);

  // React Hook Form
  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertyFormSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      property_type: 'apartment',
      city: 'Berlin',
      postal_code: '',
      address: '',
      price: 0,
      rooms: 0,
      bedrooms: 0,
      bathrooms: 0,
      area: 0,
      yearBuilt: 0,
      heating_system: '',
      energy_source: '',
      energy_certificate: '',
      parking: '',
      renovation_quality: '',
      floor_type: '',
      description: '',
      locationDescription: '',
      contact_person: '',
      contact_phone: '',
      contact_email: '',
      contact_person2: '',
      contact_phone2: '',
      contact_email2: '',
      images: {
        wohnzimmer: [],
        kueche: [],
        zimmer: [],
        bad: [],
        balkon: [],
        grundriss: []
      },
    } as PropertyFormData,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    trigger,
  } = form;

  // 初始化images对象
  useEffect(() => {
    if (!localFormData.images) {
      const initialImages = {
        wohnzimmer: [],
        kueche: [],
        zimmer: [],
        bad: [],
        balkon: [],
        grundriss: []
      };
      
      setLocalFormData(prev => ({
        ...prev,
        images: initialImages
      }));
      
      setValue('images', initialImages);
    }
  }, [setValue]);

  // 更新本地表单数据
  const updateLocalData = useCallback((data: Partial<PropertyFormData>) => {
    setLocalFormData(prev => {
      const newData = { ...prev, ...data };
      
      // 同步到React Hook Form
      Object.entries(data).forEach(([key, value]) => {
        setValue(key as keyof PropertyFormData, value);
      });
      
      return newData;
    });
  }, [setValue]); // 只依赖 setValue，移除 localFormData 依赖

  // 验证当前步骤
  const validateCurrentStep = useCallback(async (currentStep: number) => {
    let isValid = false;
    
    switch (currentStep) {
      case 0:
        isValid = await trigger(['title', 'property_type', 'city', 'postal_code', 'address', 'price']);
        break;
      case 1:
        isValid = await trigger(['rooms', 'bedrooms', 'bathrooms', 'area', 'yearBuilt', 'heating_system', 'energy_source', 'energy_certificate', 'parking', 'renovation_quality', 'floor_type']);
        break;
      case 2:
        isValid = true; // Description is optional
        break;
      case 3:
        // Image validation
        const formData = watch();
        if (formData.images && Object.values(formData.images).some(images => images && images.length > 0)) {
          isValid = true;
        } else {
          isValid = false;
        }
        break;
      case 4:
        isValid = await trigger(['contact_person', 'contact_phone', 'contact_email']);
        break;
      default:
        isValid = false;
    }
    
    return isValid;
  }, [trigger, watch]);

  // 检查是否可以生成描述
  const canGenerateDescription = !!(localFormData.title && 
    localFormData.property_type && 
    localFormData.city && 
    localFormData.postal_code && 
    localFormData.address);

  // 检查是否可以生成位置描述
  const canGenerateLocationDescription = !!(localFormData.city && localFormData.address);

  // 重置表单
  const resetForm = useCallback(() => {
    setLocalFormData(initialData);
    form.reset(initialData as PropertyFormData);
    setDescriptionStyle('formal');
    setLocationDescriptionStyle('formal');
    setIsGeneratingDescription(false);
    setIsGeneratingLocationDescription(false);
  }, [initialData, form]);

  // 获取表单数据快照
  const getFormSnapshot = useCallback(() => {
    const watchedValues = watch();
    return {
      ...localFormData,
      ...watchedValues
    };
  }, [localFormData, watch]);

  return {
    // 状态
    isSubmitting,
    localFormData,
    descriptionStyle,
    locationDescriptionStyle,
    isGeneratingDescription,
    isGeneratingLocationDescription,
    canGenerateDescription,
    canGenerateLocationDescription,
    
    // 表单方法
    form,
    register,
    handleSubmit,
    errors,
    isValid,
    setValue,
    watch,
    trigger,
    
    // 自定义方法
    updateLocalData,
    validateCurrentStep,
    resetForm,
    getFormSnapshot,
    
    // 设置器
    setIsSubmitting,
    setDescriptionStyle,
    setLocationDescriptionStyle,
    setIsGeneratingDescription,
    setIsGeneratingLocationDescription,
  };
}
