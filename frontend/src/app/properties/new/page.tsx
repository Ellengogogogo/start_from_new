'use client';

import React, { useState } from 'react';
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
  Eye,
  User
} from 'lucide-react';
import { useMultiStepForm } from '@/hooks/useMultiStepForm';
import { useUploadImages } from '@/hooks/useUploadImages';
import { PropertyFormData, AgentInfo, Photos } from '@/types/property';
import { propertyFormSchema } from '@/lib/validations';
import { cachePropertyData, uploadPropertyImages, generateExpose, generateAIDescription, generateAILocationDescriptionSimple } from '@/services/api';

const steps = [
  { id: 'basic', title: 'Grundinformationen', description: 'Grunddaten der Immobilie', icon: Info },
  { id: 'details', title: 'Immobiliendetails', description: 'Detaillierte Informationen', icon: Home },
  { id: 'description', title: 'Beschreibung', description: 'Immobilienbeschreibung', icon: FileText },
  { id: 'images', title: 'Bilder hochladen', description: 'Fotos und Grundriss', icon: ImageIcon },
  { id: 'contact', title: 'Kontaktdaten', description: 'Kontaktinformationen', icon: User },
];

export default function NewPropertyPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localFormData, setLocalFormData] = useState<Partial<PropertyFormData>>({});
  const [descriptionStyle, setDescriptionStyle] = useState('formal'); // New: Description tone selection
  const [locationDescriptionStyle, setLocationDescriptionStyle] = useState<'formal' | 'marketing' | 'family'>('formal'); // New: Location description tone selection
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false); // New: Description generation status
  const [isGeneratingLocationDescription, setIsGeneratingLocationDescription] = useState(false); // New: Location description generation status
  const [agentInfo, setAgentInfo] = useState<AgentInfo | null>(null); // New: Agent information status
  const [isClient, setIsClient] = useState(false);

  // Check if we're on the client side to avoid hydration mismatch
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Check if there is agent information
  React.useEffect(() => {
    if (isClient) {
      const storedAgentInfo = sessionStorage.getItem('agentInfo');
      if (storedAgentInfo) {
        try {
          const parsedAgentInfo = JSON.parse(storedAgentInfo);
          setAgentInfo(parsedAgentInfo);
          // Clear agent information from sessionStorage to avoid reuse
          sessionStorage.removeItem('agentInfo');
        } catch (error) {
          console.error('Error parsing agent info:', error);
        }
      }
    }
  }, [isClient]);

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
      photos: {
        wohnzimmer: [],
        kueche: [],
        schlafzimmer: [],
        bad: [],
        balkon: [],
        grundriss: []
      },
      images: []
    } as PropertyFormData,
  });

  // Initialize photos object if not exists - 移到useForm之后
  React.useEffect(() => {
    if (!localFormData.photos) {
      const initialPhotos = {
        wohnzimmer: [],
        kueche: [],
        schlafzimmer: [],
        bad: [],
        balkon: [],
        grundriss: []
      };
      
      setLocalFormData(prev => ({
        ...prev,
        photos: initialPhotos
      }));
      
      // 同步到React Hook Form
      setValue('photos', initialPhotos);
    }
  }, [setValue]);

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

  // Monitor form validation state
  React.useEffect(() => {
    console.log('Form validation state changed:', {
      isValid,
      errors: Object.keys(errors),
      currentStep,
      localFormData: Object.keys(localFormData)
    });
  }, [isValid, errors, currentStep, localFormData]);

  const watchedValues = watch();

  // Update local form data
  const updateLocalData = (data: Partial<PropertyFormData>) => {
    const newData = { ...localFormData, ...data };
    setLocalFormData(newData);
    updateFormData(newData);
    
    // Synchronize with React Hook Form
    Object.entries(data).forEach(([key, value]) => {
      setValue(key as keyof PropertyFormData, value);
    });
  };

  // Validate current step
  const validateCurrentStep = async () => {
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
        // Photo validation: 使用React Hook Form的数据进行验证
        const formData = watch();
        console.log('照片验证 - 当前表单数据:', formData.photos);
        console.log('照片验证 - localFormData:', localFormData.photos);
        
        if (formData.photos && Object.values(formData.photos).some(photos => photos && photos.length > 0)) {
          console.log('照片验证通过');
          isValid = true;
        } else {
          console.log('照片验证失败 - 没有照片');
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
  };

  // Next step
  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      updateLocalData(watchedValues);
      nextStep();
    }
  };

  // Previous step
  const handlePrev = () => {
    updateLocalData(watchedValues);
    prevStep();
  };

  // Preview effect
  const handlePreview = () => {
    // Convert current form data to preview format and save to localStorage
    const previewData = {
      title: localFormData.title || '',
      property_type: localFormData.property_type || '',
      city: localFormData.city || '',
      postal_code: localFormData.postal_code || '',
      address: localFormData.address || '',
      price: localFormData.price || 0,
      rooms: localFormData.rooms || 0,
      bedrooms: localFormData.bedrooms || 0,
      bathrooms: localFormData.bathrooms || 0,
      area: localFormData.area || 0,
      yearBuilt: localFormData.yearBuilt || 0,
      heating_system: localFormData.heating_system || '',
      energy_source: localFormData.energy_source || '',
      energy_certificate: localFormData.energy_certificate || '',
      parking: localFormData.parking || '',
      renovation_quality: localFormData.renovation_quality || '',
      floor_type: localFormData.floor_type || '',
      description: localFormData.description || '',
      locationDescription: localFormData.locationDescription || '',
      contact_person: localFormData.contact_person || '',
      contact_phone: localFormData.contact_phone || '',
      contact_email: localFormData.contact_email || '',
      contact_person2: localFormData.contact_person2 || '',
      contact_phone2: localFormData.contact_phone2 || '',
      contact_email2: localFormData.contact_email2 || '',
      images: localFormData.photos || {}
    };
    
    // Save to localStorage
    localStorage.setItem('tempPropertyData', JSON.stringify(previewData));
    
    // Navigate to preview page
    router.push('/properties/preview/preview');
  };

  // Form submission
  const onSubmit = async (data: PropertyFormData) => {
    console.log('Formular wird übermittelt, Daten:', data);
    console.log('Aktuelle Formulardaten:', localFormData);
    
    if (isSubmitting) {
      console.log('Formular wird bereits übermittelt, doppelte Übermittlung wird ignoriert');
      return;
    }
    
    // 确保表单数据完全同步
    const finalFormData = {
      ...data,
      ...localFormData,
      // 确保photos数据正确
      photos: localFormData.photos || {
        wohnzimmer: [],
        kueche: [],
        schlafzimmer: [],
        bad: [],
        balkon: [],
        grundriss: []
      }
    };
    
    console.log('Finale Formulardaten:', finalFormData);
    
    // Validate all required fields before submission
    const isFormValid = await trigger();
    if (!isFormValid) {
      console.error('Formular ist nicht gültig:', errors);
      alert('Bitte füllen Sie alle erforderlichen Felder aus.');
      return;
    }
    
    // 验证照片要求
    if (!finalFormData.photos || Object.values(finalFormData.photos).every(photos => !photos || photos.length === 0)) {
      alert('Bitte laden Sie mindestens ein Foto hoch.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      console.log('Schritt 1: Immobiliendaten werden hochgeladen...');
      // Schritt 1: Immobiliendaten hochladen
      const { id: propertyId } = await cachePropertyData({
        title: finalFormData.title,
        property_type: finalFormData.property_type,
        city: finalFormData.city,
        postal_code: finalFormData.postal_code,
        address: finalFormData.address,
        price: finalFormData.price,
        rooms: finalFormData.rooms,
        bedrooms: finalFormData.bedrooms,
        bathrooms: finalFormData.bathrooms,
        area: finalFormData.area,
        yearBuilt: finalFormData.yearBuilt,
        heating_system: finalFormData.heating_system,
        energy_source: finalFormData.energy_source,
        energy_certificate: finalFormData.energy_certificate,
        parking: finalFormData.parking,
        renovation_quality: finalFormData.renovation_quality,
        floor_type: finalFormData.floor_type,
        description: finalFormData.description || '',
        locationDescription: finalFormData.locationDescription || '',
        contact_person: finalFormData.contact_person,
        contact_phone: finalFormData.contact_phone,
        contact_email: finalFormData.contact_email,
        contact_person2: finalFormData.contact_person2,
        contact_phone2: finalFormData.contact_phone2,
        contact_email2: finalFormData.contact_email2,
        agentInfo: agentInfo || undefined,
        photos: finalFormData.photos,
      });
      console.log('Immobiliendaten erfolgreich hochgeladen, ID:', propertyId);

      // Schritt 2: Bilder hochladen
      if (finalFormData.photos && Object.values(finalFormData.photos).some(photos => photos && photos.length > 0)) {
        console.log('Schritt 2: Fotos werden hochgeladen');
        // Flatten all photos from different categories into a single array
        const allPhotos = Object.values(finalFormData.photos).flat().filter(Boolean);
        console.log('Anzahl der Fotos:', allPhotos.length);
        await uploadPropertyImages(propertyId, allPhotos);
        console.log('Fotos erfolgreich hochgeladen');
      } else {
        console.log('Keine Fotos zum Hochladen vorhanden');
      }

      // Schritt 3: Professionelles Exposé generieren
      console.log('Schritt 3: Professionelles Exposé wird generiert...');
      const { exposeId } = await generateExpose(propertyId);
      console.log('Exposé erfolgreich generiert, ID:', exposeId);

      // Zur Exposé-Seite weiterleiten
      console.log('Weiterleitung zur Exposé-Seite:', `/properties/${propertyId}/expose/${exposeId}`);
      router.push(`/properties/${propertyId}/expose/${exposeId}`);
    } catch (error) {
      console.error('Übermittlung fehlgeschlagen:', error);
      alert(`Übermittlung fehlgeschlagen: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}, bitte versuchen Sie es erneut`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Image handling - REMOVED: No longer needed with new photo system
  // const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = Array.from(event.target.files || []);
  //   updateLocalData({ images: files });
  // };

  // const removeImage = (index: number) => {
  //   const newImages = [...(localFormData.images || [])];
  //   newImages.splice(index, 1);
  //   updateLocalData({ images: newImages });
  // };


  // New: AI description generation
  const handleGenerateAIDescription = async () => {
    if (!localFormData.title || !localFormData.property_type || !localFormData.city || !localFormData.postal_code || !localFormData.address || !localFormData.rooms || !localFormData.area || !localFormData.yearBuilt) {
      alert('Bitte füllen Sie zuerst die Grundinformationen und Immobiliendetails aus, damit die KI eine Beschreibung generieren kann.');
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
        bedrooms: localFormData.bedrooms || 0,
        bathrooms: localFormData.bathrooms || 0,
        area: localFormData.area,
        yearBuilt: localFormData.yearBuilt,
        heating_system: localFormData.heating_system || '',
        energy_source: localFormData.energy_source || '',
        energy_certificate: localFormData.energy_certificate || '',
        parking: localFormData.parking || '',
        renovation_quality: localFormData.renovation_quality || '',
        floor_type: localFormData.floor_type || '',
        contact_person: localFormData.contact_person || '',
        contact_phone: localFormData.contact_phone || '',
        contact_email: localFormData.contact_email || '',
        contact_person2: localFormData.contact_person2 || '',
        contact_phone2: localFormData.contact_phone2 || '',
        contact_email2: localFormData.contact_email2 || '',
        photos: localFormData.photos || {
          wohnzimmer: [],
          kueche: [],
          schlafzimmer: [],
          bad: [],
          balkon: [],
          grundriss: []
        },
      }, descriptionStyle as 'formal' | 'marketing' | 'family');
      
      updateLocalData({ suggested_description: response.suggested_description });
      setValue('description', response.suggested_description);
    } catch (error) {
      console.error('KI-Beschreibung konnte nicht generiert werden:', error);
      alert(`KI-Beschreibung konnte nicht generiert werden: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  // New: Check if description can be generated
  const canGenerateDescription = localFormData.title && 
    localFormData.property_type && 
    localFormData.city && 
    localFormData.postal_code && 
    localFormData.address;

  // New: AI location description generation
  const handleGenerateAILocationDescription = async () => {
    if (!localFormData.city || !localFormData.address) {
      alert('Bitte füllen Sie zuerst Stadt und Adresse aus, damit die KI eine Lagebeschreibung generieren kann.');
      return;
    }

    setIsGeneratingLocationDescription(true);
    try {
      const response = await generateAILocationDescriptionSimple(
        localFormData.city,
        localFormData.address,
        locationDescriptionStyle
      );
      
      updateLocalData({ suggested_location_description: response.location_description });
      setValue('locationDescription', response.location_description);
    } catch (error) {
      console.error('KI-Lagebeschreibung konnte nicht generiert werden:', error);
      alert(`KI-Lagebeschreibung konnte nicht generiert werden: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
    } finally {
      setIsGeneratingLocationDescription(false);
    }
  };

  // New: Check if location description can be generated
  const canGenerateLocationDescription = localFormData.city && localFormData.address;

  // New: Photo upload handling
  const [activePhotoTab, setActivePhotoTab] = useState<keyof Photos>('wohnzimmer');
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragOverTab, setDragOverTab] = useState<keyof Photos>('wohnzimmer');
  const [photoUrls, setPhotoUrls] = useState<Record<keyof Photos, string[]>>({
    wohnzimmer: [],
    kueche: [],
    schlafzimmer: [],
    bad: [],
    balkon: [],
    grundriss: []
  });

  // 清理函数：组件卸载时释放所有URL
  React.useEffect(() => {
    return () => {
      // 清理所有照片URL
      Object.values(photoUrls).forEach(urls => {
        urls.forEach(url => {
          if (url && url.startsWith('blob:')) {
            URL.revokeObjectURL(url);
          }
        });
      });
    };
  }, [photoUrls]);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>, category: keyof Photos) => {
    const files = Array.from(event.target.files || []);
    console.log(`照片上传: ${category}, 文件数量: ${files.length}`, files);
    
    setLocalFormData(prev => {
      const currentPhotos = prev.photos || {};
      const existingPhotos = currentPhotos[category] || [];
      const availableSlots = 10 - existingPhotos.length;
      
      if (availableSlots <= 0) {
        alert(`Sie können maximal 10 Fotos für ${getTabDisplayName(category)} hochladen.`);
        return prev;
      }
      
      const filesToAdd = files.slice(0, availableSlots);
      const newPhotos = {
        ...currentPhotos,
        [category]: [...existingPhotos, ...filesToAdd]
      };
      
      console.log(`更新后的照片数据:`, newPhotos);
      
      // 同步到React Hook Form
      setValue('photos', newPhotos);
      console.log(`已同步到React Hook Form:`, newPhotos);
      
      return {
        ...prev,
        photos: newPhotos
      };
    });
    
    // 更新照片URL状态
    setPhotoUrls(prev => {
      const currentUrls = prev[category] || [];
      const newUrls = [...currentUrls];
      
      // 为每个新文件创建URL
      files.forEach(file => {
        if (newUrls.length < 10) {
          const url = URL.createObjectURL(file);
          newUrls.push(url);
        }
      });
      
      return {
        ...prev,
        [category]: newUrls
      };
    });
  };

  const removePhoto = (category: keyof Photos, index: number) => {
    setLocalFormData(prev => {
      const currentPhotos = prev.photos || {};
      if (currentPhotos[category]) {
        const newPhotos = { ...currentPhotos };
        newPhotos[category] = newPhotos[category]?.filter((_, i) => i !== index) || [];
        
        // 同步到React Hook Form
        setValue('photos', newPhotos);
        
        return { ...prev, photos: newPhotos };
      }
      return prev;
    });
    
    // 清理照片URL
    setPhotoUrls(prev => {
      const currentUrls = prev[category] || [];
      if (currentUrls[index]) {
        // 释放URL对象
        URL.revokeObjectURL(currentUrls[index]);
        
        // 从数组中移除
        const newUrls = currentUrls.filter((_, i) => i !== index);
        return {
          ...prev,
          [category]: newUrls
        };
      }
      return prev;
    });
  };

  const getTotalPhotoCount = (): number => {
    if (!localFormData.photos) return 0;
    return Object.values(localFormData.photos).reduce((sum, photos) => sum + (photos?.length || 0), 0);
  };

  const getTabDisplayName = (id: keyof Photos): string => {
    switch (id) {
      case 'wohnzimmer': return 'Wohnzimmer';
      case 'kueche': return 'Küche';
      case 'schlafzimmer': return 'Schlafzimmer';
      case 'bad': return 'Bad';
      case 'balkon': return 'Balkon & Außenbereich';
      case 'grundriss': return 'Grundriss';
      default: return id;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Neue Immobilie erstellen</h1>
          <p className="mt-2 text-gray-600">Füllen Sie die Immobiliendaten aus und erstellen Sie eine professionelle Präsentation</p>
        </div>

        {/* Overall Progress Indicator */}
        {isClient && (agentInfo || sessionStorage.getItem('userType') === 'private') && (
          <div className="mb-8">
            <div className="flex justify-center">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">
                    ✓
                  </div>
                  <span className="ml-2 text-sm font-medium text-green-600">Benutzertyp</span>
                </div>
                {agentInfo && (
                  <>
                    <div className="w-8 h-1 bg-green-600"></div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">
                        ✓
                      </div>
                      <span className="ml-2 text-sm font-medium text-green-600">Unternehmensdaten</span>
                    </div>
                  </>
                )}
                <div className="w-8 h-1 bg-blue-600"></div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                    2
                  </div>
                  <span className="ml-2 text-sm font-medium text-blue-600">Immobiliendaten</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Agent Info Display */}
        {agentInfo && (
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-4">
              {agentInfo.companyLogo && (
                <img
                  src={agentInfo.companyLogo}
                  alt="Firmenlogo"
                  className="w-12 h-12 rounded-lg object-cover"
                />
              )}
              <div className="flex-1">
                <h3 className="text-sm font-medium text-blue-900">Immobilienmakler Informationen</h3>
                <p className="text-sm text-blue-700">
                  Telefon: {agentInfo.phone}
                </p>
                <p className="text-sm text-blue-700">
                  Adresse: {agentInfo.address}
                  {agentInfo.website && ` | Website: ${agentInfo.website}`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step Indicator */}
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
          
          {/* Connection Line */}
          <div className="relative mt-4">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2"></div>
            <div 
              className="absolute top-1/2 left-0 h-0.5 bg-blue-600 transition-all duration-500 -translate-y-1/2"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
            {/* Step 1: Basic Information */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Immobilientitel *
                  </label>
                  <input
                    {...register('title')}
                    type="text"
                    id="title"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="z.B.: Renovierte 3-Zimmer-Wohnung, Südausrichtung"
                    defaultValue={localFormData.title}
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="property_type" className="block text-sm font-medium text-gray-700 mb-2">
                    Immobilientyp *
                  </label>
                  <select
                    {...register('property_type')}
                    id="property_type"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.property_type ? 'border-red-500' : 'border-gray-300'
                    }`}
                    defaultValue={localFormData.property_type || 'apartment'}
                  >
                    <option value="apartment">Wohnung</option>
                    <option value="house">Einfamilienhaus</option>
                    <option value="villa">Villa</option>
                    <option value="penthouse">Penthouse</option>
                    <option value="duplex">Maisonette</option>
                    <option value="studio">Studio</option>
                  </select>
                  {errors.property_type && (
                    <p className="mt-1 text-sm text-red-600">{errors.property_type.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                      Stadt *
                    </label>
                    <input
                      {...register('city')}
                      type="text"
                      id="city"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="z.B.: Berlin"
                      defaultValue={localFormData.city || 'Berlin'}
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-2">
                      Postleitzahl *
                    </label>
                    <input
                      {...register('postal_code')}
                      type="text"
                      id="postal_code"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.postal_code ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="z.B.: 10115"
                      defaultValue={localFormData.postal_code || ''}
                    />
                    {errors.postal_code && (
                      <p className="mt-1 text-sm text-red-600">{errors.postal_code.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Vollständige Adresse *
                  </label>
                  <input
                    {...register('address')}
                    type="text"
                    id="address"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="z.B.: Unter den Linden 1, 10117 Berlin"
                    defaultValue={localFormData.address}
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Preis (€) *
                  </label>
                  <input
                    {...register('price', { valueAsNumber: true })}
                    type="number"
                    id="price"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="z.B.: 500000"
                    min="0"
                    step="1000"
                    defaultValue={localFormData.price}
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Property Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="rooms" className="block text-sm font-medium text-gray-700 mb-2">
                      Anzahl der Zimmer *
                    </label>
                    <input
                      {...register('rooms', { valueAsNumber: true })}
                      type="number"
                      id="rooms"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.rooms ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="z.B.: 3"
                      min="0"
                      max="50"
                      defaultValue={localFormData.rooms}
                    />
                    {errors.rooms && (
                      <p className="mt-1 text-sm text-red-600">{errors.rooms.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-2">
                      Anzahl der Schlafzimmer *
                    </label>
                    <input
                      {...register('bedrooms', { valueAsNumber: true })}
                      type="number"
                      id="bedrooms"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.bedrooms ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="z.B.: 2"
                      min="0"
                      max="20"
                      defaultValue={localFormData.bedrooms}
                    />
                    {errors.bedrooms && (
                      <p className="mt-1 text-sm text-red-600">{errors.bedrooms.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-2">
                      Anzahl der Badezimmer *
                    </label>
                    <input
                      {...register('bathrooms', { valueAsNumber: true })}
                      type="number"
                      id="bathrooms"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.bathrooms ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="z.B.: 1"
                      min="0"
                      max="10"
                      defaultValue={localFormData.bathrooms}
                    />
                    {errors.bathrooms && (
                      <p className="mt-1 text-sm text-red-600">{errors.bathrooms.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">
                      Wohnfläche (m²) *
                    </label>
                    <input
                      {...register('area', { valueAsNumber: true })}
                      type="number"
                      id="area"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.area ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="z.B.: 120"
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
                      Baujahr *
                    </label>
                    <input
                      {...register('yearBuilt', { valueAsNumber: true })}
                      type="number"
                      id="yearBuilt"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.yearBuilt ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="z.B.: 2010"
                      min="1800"
                      max={new Date().getFullYear()}
                      defaultValue={localFormData.yearBuilt}
                    />
                    {errors.yearBuilt && (
                      <p className="mt-1 text-sm text-red-600">{errors.yearBuilt.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="heating_system" className="block text-sm font-medium text-gray-700 mb-2">
                      Heizsystem *
                    </label>
                    <select
                      {...register('heating_system')}
                      id="heating_system"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.heating_system ? 'border-red-500' : 'border-gray-300'
                      }`}
                      defaultValue={localFormData.heating_system || ''}
                    >
                      <option value="">Heizsystem auswählen</option>
                      <option value="central_heating">Zentralheizung</option>
                      <option value="floor_heating">Fußbodenheizung</option>
                      <option value="radiator_heating">Heizkörper</option>
                      <option value="air_conditioning">Klimaanlage</option>
                      <option value="wood_stove">Kaminofen</option>
                      <option value="heat_pump">Wärmepumpe</option>
                    </select>
                    {errors.heating_system && (
                      <p className="mt-1 text-sm text-red-600">{errors.heating_system.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="energy_source" className="block text-sm font-medium text-gray-700 mb-2">
                      Hauptenergiequelle *
                    </label>
                    <select
                      {...register('energy_source')}
                      id="energy_source"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.energy_source ? 'border-red-500' : 'border-gray-300'
                      }`}
                      defaultValue={localFormData.energy_source || ''}
                    >
                      <option value="">Energiequelle auswählen</option>
                      <option value="natural_gas">Erdgas</option>
                      <option value="electricity">Strom</option>
                      <option value="oil">Heizöl</option>
                      <option value="district_heating">Fernwärme</option>
                      <option value="wood">Holz</option>
                      <option value="solar">Solarenergie</option>
                      <option value="geothermal">Geothermie</option>
                    </select>
                    {errors.energy_source && (
                      <p className="mt-1 text-sm text-red-600">{errors.energy_source.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="energy_certificate" className="block text-sm font-medium text-gray-700 mb-2">
                      Energieausweis *
                    </label>
                    <select
                      {...register('energy_certificate')}
                      id="energy_certificate"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.energy_certificate ? 'border-red-500' : 'border-gray-300'
                      }`}
                      defaultValue={localFormData.energy_certificate || ''}
                    >
                      <option value="">Energieeffizienzklasse auswählen</option>
                      <option value="A+">A+</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                      <option value="E">E</option>
                      <option value="F">F</option>
                      <option value="G">G</option>
                      <option value="H">H</option>
                    </select>
                    {errors.energy_certificate && (
                      <p className="mt-1 text-sm text-red-600">{errors.energy_certificate.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="parking" className="block text-sm font-medium text-gray-700 mb-2">
                      Parkplatz oder Garage *
                    </label>
                    <select
                      {...register('parking')}
                      id="parking"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.parking ? 'border-red-500' : 'border-gray-300'
                      }`}
                      defaultValue={localFormData.parking || ''}
                    >
                      <option value="">Parkmöglichkeit auswählen</option>
                      <option value="garage">Garage</option>
                      <option value="parking_space">Parkplatz</option>
                      <option value="street_parking">Straßenparken</option>
                      <option value="underground_parking">Tiefgarage</option>
                      <option value="none">Kein Parkplatz</option>
                    </select>
                    {errors.parking && (
                      <p className="mt-1 text-sm text-red-600">{errors.parking.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="renovation_quality" className="block text-sm font-medium text-gray-700 mb-2">
                      Renovierungsqualität *
                    </label>
                    <select
                      {...register('renovation_quality')}
                      id="renovation_quality"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.renovation_quality ? 'border-red-500' : 'border-gray-300'
                      }`}
                      defaultValue={localFormData.renovation_quality || ''}
                    >
                      <option value="">Renovierungsqualität auswählen</option>
                      <option value="luxury">Luxuriös</option>
                      <option value="high_quality">Hochwertig</option>
                      <option value="standard">Standard</option>
                      <option value="basic">Grundlegend</option>
                      <option value="needs_renovation">Renovierungsbedürftig</option>
                    </select>
                    {errors.renovation_quality && (
                      <p className="mt-1 text-sm text-red-600">{errors.renovation_quality.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="floor_type" className="block text-sm font-medium text-gray-700 mb-2">
                      Bodenbelag *
                    </label>
                    <select
                      {...register('floor_type')}
                      id="floor_type"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.floor_type ? 'border-red-500' : 'border-gray-300'
                      }`}
                      defaultValue={localFormData.floor_type || ''}
                    >
                      <option value="">Bodenbelag auswählen</option>
                      <option value="hardwood">Parkett</option>
                      <option value="laminate">Laminat</option>
                      <option value="tile">Fliesen</option>
                      <option value="carpet">Teppich</option>
                      <option value="vinyl">Vinyl</option>
                      <option value="concrete">Beton</option>
                      <option value="mixed">Gemischt</option>
                    </select>
                    {errors.floor_type && (
                      <p className="mt-1 text-sm text-red-600">{errors.floor_type.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Description */}
            {currentStep === 2 && (
              <div className="space-y-8">
                {/* Property Description */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Immobilienbeschreibung
                    </label>
                    <div className="flex items-center gap-3">
                      {/* Tone Selection */}
                      <select
                        id="description-style"
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        onChange={(e) => setDescriptionStyle(e.target.value)}
                        value={descriptionStyle}
                      >
                        <option value="formal">Formell</option>
                        <option value="marketing">Marketing</option>
                        <option value="family">Familienfreundlich</option>
                      </select>
                      
                      {/* AI Generation Button */}
                      <button
                        type="button"
                        onClick={handleGenerateAIDescription}
                        disabled={!canGenerateDescription || isGeneratingDescription}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingDescription ? (
                          <>
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            Wird generiert...
                          </>
                        ) : (
                          <>
                            <FileText className="w-4 h-4" />
                            KI-Beschreibung generieren
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* Description Editor */}
                  <textarea
                    {...register('description')}
                    id="description"
                    rows={6}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Beschreiben Sie die Besonderheiten, Vorteile und Umgebung der Immobilie..."
                    defaultValue={localFormData.description}
                  />
                  
                  {/* AI Generated Description (Editable) */}
                  {localFormData.suggested_description && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-blue-800">KI-generierte Beschreibung</h4>
                        <button
                          type="button"
                          onClick={() => {
                            updateLocalData({ description: localFormData.suggested_description });
                            setValue('description', localFormData.suggested_description);
                          }}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Diese Beschreibung verwenden
                        </button>
                      </div>
                      <textarea
                        value={localFormData.suggested_description}
                        onChange={(e) => updateLocalData({ suggested_description: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 text-sm border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        placeholder="KI-generierte Beschreibung..."
                      />
                    </div>
                  )}
                  
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Maximal 2000 Zeichen, aktuell {localFormData.description?.length || 0}/2000
                  </p>
                </div>

                {/* Location Description */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="locationDescription" className="block text-sm font-medium text-gray-700">
                      Lagebeschreibung
                    </label>
                    <div className="flex items-center gap-3">
                      {/* Location Description Tone Selection */}
                      <select
                        id="location-description-style"
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        onChange={(e) => setLocationDescriptionStyle(e.target.value as 'formal' | 'marketing' | 'family')}
                        value={locationDescriptionStyle}
                      >
                        <option value="formal">Formell</option>
                        <option value="marketing">Marketing</option>
                        <option value="family">Familienfreundlich</option>
                      </select>
                      
                      {/* AI Location Description Generation Button */}
                      <button
                        type="button"
                        onClick={handleGenerateAILocationDescription}
                        disabled={!canGenerateLocationDescription || isGeneratingLocationDescription}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingLocationDescription ? (
                          <>
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            Wird generiert...
                          </>
                        ) : (
                          <>
                            <FileText className="w-4 h-4" />
                            KI-Beschreibung generieren
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <textarea
                    {...register('locationDescription')}
                    id="locationDescription"
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                      errors.locationDescription ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Beschreiben Sie die Lagevorteile wie Verkehrsanbindung, Umgebung, Schulen, Krankenhäuser, Einkaufszentren..."
                    defaultValue={localFormData.locationDescription}
                  />
                  
                  {/* AI Generated Location Description (Editable) */}
                  {localFormData.suggested_location_description && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-green-800">KI-generierte Lagebeschreibung</h4>
                        <button
                          type="button"
                          onClick={() => {
                            updateLocalData({ locationDescription: localFormData.suggested_location_description });
                            setValue('locationDescription', localFormData.suggested_location_description);
                          }}
                          className="text-xs text-green-600 hover:text-green-700 font-medium"
                        >
                          Diese Beschreibung verwenden
                        </button>
                      </div>
                      <textarea
                        value={localFormData.suggested_location_description}
                        onChange={(e) => updateLocalData({ suggested_location_description: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 text-sm border border-green-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        placeholder="KI-generierte Lagebeschreibung..."
                      />
                    </div>
                  )}
                  
                  {errors.locationDescription && (
                    <p className="mt-1 text-sm text-red-600">{errors.locationDescription.message}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Maximal 1000 Zeichen, aktuell {localFormData.locationDescription?.length || 0}/1000
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Image Upload */}
            {currentStep === 3 && (
              <div className="space-y-8">
                {/* Categorized Photo Upload Tabs */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Immobilienfotos nach Kategorien *
                  </label>
                  
                  {/* Tab Navigation */}
                  <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                      {[
                        { id: 'wohnzimmer', name: 'Wohnzimmer', icon: '🏠' },
                        { id: 'kueche', name: 'Küche', icon: '🍳' },
                        { id: 'schlafzimmer', name: 'Schlafzimmer', icon: '🛏️' },
                        { id: 'bad', name: 'Bad', icon: '🚿' },
                        { id: 'balkon', name: 'Balkon & Außenbereich', icon: '🌿' },
                        { id: 'grundriss', name: 'Grundriss', icon: '📐' }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActivePhotoTab(tab.id as keyof Photos)}
                          className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activePhotoTab === tab.id
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <span className="mr-2">{tab.icon}</span>
                          {tab.name}
                        </button>
                      ))}
                    </nav>
                  </div>

                  {/* Info Section */}
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <Info className="w-5 h-5 text-blue-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">
                          Foto-Upload Anforderungen
                        </h3>
                        <div className="mt-2 text-sm text-blue-700">
                          <p>• Jede Kategorie kann maximal 10 Fotos enthalten</p>
                          <p>• Mindestens eine Kategorie muss Fotos enthalten</p>
                          <p>• Unterstützte Formate: JPG, PNG, WebP</p>
                          <p>• Drag & Drop oder Klick zum Hochladen möglich</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tab Content */}
                  <div className="mt-6">
                    {(() => {
                      const currentPhotos = localFormData.photos?.[activePhotoTab] || [];
                      
                      return (
                        <div className="space-y-4">
                          {/* Upload Area */}
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={(e) => handlePhotoUpload(e, activePhotoTab)}
                              className="hidden"
                              id={`photo-upload-${activePhotoTab}`}
                            />
                            <label
                              htmlFor={`photo-upload-${activePhotoTab}`}
                              className="cursor-pointer flex flex-col items-center"
                            >
                              <Upload className="w-12 h-12 text-gray-400 mb-4" />
                              <div className="text-lg font-medium text-gray-700 mb-2">
                                {getTabDisplayName(activePhotoTab)} Fotos hochladen
                              </div>
                              <div className="text-sm text-gray-500">
                                JPG, PNG, WebP Formate unterstützt, maximal 10 Fotos
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                Drag & Drop oder Klick zum Auswählen
                              </div>
                            </label>
                          </div>

                          {/* Drag & Drop Zone */}
                          <div
                            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                              isDragOver && dragOverTab === activePhotoTab
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-300'
                            }`}
                            onDragOver={(e) => {
                              e.preventDefault();
                              setIsDragOver(true);
                              setDragOverTab(activePhotoTab);
                            }}
                            onDragLeave={(e) => {
                              e.preventDefault();
                              setIsDragOver(false);
                              setDragOverTab('wohnzimmer');
                            }}
                            onDrop={(e) => {
                              e.preventDefault();
                              setIsDragOver(false);
                              setDragOverTab('wohnzimmer');
                              const files = Array.from(e.dataTransfer.files);
                              
                              // Check if we can add more photos
                              const currentPhotos = localFormData.photos?.[activePhotoTab] || [];
                              const availableSlots = 10 - currentPhotos.length;
                              
                              if (availableSlots <= 0) {
                                alert(`Sie können maximal 10 Fotos für ${getTabDisplayName(activePhotoTab)} hochladen.`);
                                return;
                              }
                              
                              const filesToAdd = files.slice(0, availableSlots);
                              
                              // 直接调用handlePhotoUpload来确保一致性
                              const mockEvent = {
                                target: { files: filesToAdd }
                              } as unknown as React.ChangeEvent<HTMLInputElement>;
                              handlePhotoUpload(mockEvent, activePhotoTab);
                            }}
                          >
                          </div>

                          {/* Photo Count and Upload Button */}
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                              {currentPhotos.length} von 10 Fotos hochgeladen
                            </div>
                            <button
                              type="button"
                              onClick={() => document.getElementById(`photo-upload-${activePhotoTab}`)?.click()}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Weitere Fotos hinzufügen
                            </button>
                          </div>

                          {/* Photos Preview Grid */}
                          {currentPhotos.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-3">
                                {getTabDisplayName(activePhotoTab)} Fotos
                              </h4>
                              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {currentPhotos.map((file, index) => {
                                  // 使用存储的URL或创建新的URL
                                  const photoUrl = photoUrls[activePhotoTab]?.[index] || URL.createObjectURL(file);
                                  
                                  return (
                                    <div key={index} className="relative group">
                                      <img
                                        src={photoUrl}
                                        alt={`${getTabDisplayName(activePhotoTab)} Foto ${index + 1}`}
                                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                        onLoad={() => {
                                          // 如果URL不在存储中，添加到存储中
                                          if (!photoUrls[activePhotoTab]?.[index]) {
                                            setPhotoUrls(prev => ({
                                              ...prev,
                                              [activePhotoTab]: {
                                                ...prev[activePhotoTab],
                                                [index]: photoUrl
                                              }
                                            }));
                                          }
                                        }}
                                      />
                                      <button
                                        type="button"
                                        onClick={() => removePhoto(activePhotoTab, index)}
                                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg">
                                        {file.name.length > 15 ? file.name.substring(0, 15) + '...' : file.name}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Empty State */}
                          {currentPhotos.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                              <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                              <p>Noch keine Fotos für {getTabDisplayName(activePhotoTab)} hochgeladen</p>
                              <p className="text-sm">Laden Sie Fotos hoch, um diese Kategorie zu vervollständigen</p>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Upload Progress */}
                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">Upload-Fortschritt</span>
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

                {/* Photo Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Foto-Übersicht</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    {Object.entries(localFormData.photos || {}).map(([category, photos]) => (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-gray-600">{getTabDisplayName(category as keyof Photos)}:</span>
                        <span className={`font-medium ${photos.length > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                          {photos.length} Fotos
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm font-medium">
                      <span>Gesamt:</span>
                      <span className="text-blue-600">
                        {getTotalPhotoCount()} Fotos
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Contact Information */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="contact_person" className="block text-sm font-medium text-gray-700 mb-2">
                    Kontaktperson *
                  </label>
                  <input
                    {...register('contact_person')}
                    type="text"
                    id="contact_person"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.contact_person ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="z.B.: Herr Müller"
                    defaultValue={localFormData.contact_person || ''}
                  />
                  {errors.contact_person && (
                    <p className="mt-1 text-sm text-red-600">{errors.contact_person.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Telefonnummer *
                  </label>
                  <input
                    {...register('contact_phone')}
                    type="tel"
                    id="contact_phone"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.contact_phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="z.B.: +49 30 12345678"
                    defaultValue={localFormData.contact_phone || ''}
                  />
                  {errors.contact_phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.contact_phone.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 mb-2">
                    E-Mail-Adresse *
                  </label>
                  <input
                    {...register('contact_email')}
                    type="email"
                    id="contact_email"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.contact_email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="z.B.: mueller@example.com"
                    defaultValue={localFormData.contact_email || ''}
                  />
                  {errors.contact_email && (
                    <p className="mt-1 text-sm text-red-600">{errors.contact_email.message}</p>
                  )}
                </div>

                {/* Second Contact Information */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Zweiter Kontakt (optional)</h3>
                  
                  <div>
                    <label htmlFor="contact_person2" className="block text-sm font-medium text-gray-700 mb-2">
                      Kontaktperson
                    </label>
                    <input
                      {...register('contact_person2')}
                      type="text"
                      id="contact_person2"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.contact_person2 ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="z.B.: Frau Schmidt"
                      defaultValue={localFormData.contact_person2 || ''}
                    />
                    {errors.contact_person2 && (
                      <p className="mt-1 text-sm text-red-600">{errors.contact_person2.message}</p>
                    )}
                  </div>

                  <div className="mt-4">
                    <label htmlFor="contact_phone2" className="block text-sm font-medium text-gray-700 mb-2">
                      Telefonnummer
                    </label>
                    <input
                      {...register('contact_phone2')}
                      type="tel"
                      id="contact_phone2"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.contact_phone2 ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="z.B.: +49 30 87654321"
                      defaultValue={localFormData.contact_phone2 || ''}
                    />
                    {errors.contact_phone2 && (
                      <p className="mt-1 text-sm text-red-600">{errors.contact_phone2.message}</p>
                    )}
                  </div>

                  <div className="mt-4">
                    <label htmlFor="contact_email2" className="block text-sm font-medium text-gray-700 mb-2">
                      E-Mail-Adresse
                    </label>
                    <input
                      {...register('contact_email2')}
                      type="email"
                      id="contact_email2"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.contact_email2 ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="z.B.: schmidt@example.com"
                      defaultValue={localFormData.contact_email2 || ''}
                    />
                    {errors.contact_email2 && (
                      <p className="mt-1 text-sm text-red-600">{errors.contact_email2.message}</p>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Info className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">
                        Kontaktinformationen
                      </h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>Diese Kontaktinformationen werden im generierten Exposé angezeigt, damit potenzielle Käufer oder Mieter Sie erreichen können.</p>
                        <p className="mt-1">Der erste Kontakt ist erforderlich, der zweite Kontakt ist optional.</p>
                        <p className="mt-1">Bitte stellen Sie sicher, dass alle Informationen korrekt sind, um Anfragen rechtzeitig zu erhalten.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Form Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Schritt {currentStep + 1} / {totalSteps}</span>
              </div>
              
              <div className="flex items-center gap-4">
                {canGoPrev && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Zurück
                  </button>
                )}
                
                {currentStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Weiter
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      onClick={() => {
                        console.log('Submit Button clicked');
                        console.log('Form data:', localFormData);
                        console.log('Form errors:', errors);
                        console.log('Form isValid:', isValid);
                        console.log('Current step:', currentStep);
                        console.log('Total steps:', steps.length);
                      }}
                      className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Wird gesendet...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Formular senden
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Debug Information */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Debug-Informationen</h3>
          
          {/* Test Buttons */}
          <div className="mb-4 p-3 bg-yellow-100 rounded border border-yellow-300">
            <h4 className="text-sm font-medium text-yellow-800 mb-2">Test-Funktionen</h4>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => console.log('Aktuelle Formulardaten:', localFormData)}
                className="px-3 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Formulardaten ausgeben
              </button>
              <button
                type="button"
                onClick={() => console.log('Aktueller Schritt:', currentStep, 'Gesamte Schritte:', steps.length)}
                className="px-3 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Schrittinformationen ausgeben
              </button>
              <button
                type="button"
                onClick={() => console.log('Formularvalidierung:', errors)}
                className="px-3 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Validierungsstatus ausgeben
              </button>
              <button
                type="button"
                onClick={() => {
                  console.log('Formularvalidierung wird getestet...');
                  trigger().then(isValid => {
                    console.log('Formular ist gültig:', isValid);
                    console.log('Validierungsfehler:', errors);
                  });
                }}
                className="px-3 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Validierung testen
              </button>
              <button
                type="button"
                onClick={() => {
                  console.log('Formular-Submit wird getestet...');
                  const formData = new FormData();
                  formData.append('test', 'true');
                  onSubmit(localFormData as PropertyFormData);
                }}
                className="px-3 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Submit testen
              </button>
              <button
                type="button"
                onClick={() => {
                  console.log('照片数据测试...');
                  const formData = watch();
                  console.log('React Hook Form photos:', formData.photos);
                  console.log('localFormData photos:', localFormData.photos);
                  console.log('验证状态:', trigger());
                }}
                className="px-3 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                照片数据测试
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
                photos: Object.entries(localFormData.photos || {}).reduce((acc, [key, photos]) => {
                  acc[key] = photos?.map((file: File) => ({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    lastModified: file.lastModified
                  })) || [];
                  return acc;
                }, {} as Record<string, { name: string; size: number; type: string; lastModified: number }[]>),
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