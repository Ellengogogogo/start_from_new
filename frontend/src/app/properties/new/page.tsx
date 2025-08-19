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
import { PropertyFormData, AgentInfo } from '@/types/property';
import { propertyFormSchema } from '@/lib/validations';
import { cachePropertyData, uploadPropertyImages, generateExpose, generateAIDescription } from '@/services/api';

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
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false); // New: Description generation status
  const [agentInfo, setAgentInfo] = useState<AgentInfo | null>(null); // New: Agent information status

  // Check if there is agent information
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedAgentInfo = sessionStorage.getItem('agentInfo');
      if (storedAgentInfo) {
        const parsedAgentInfo = JSON.parse(storedAgentInfo);
        setAgentInfo(parsedAgentInfo);
        // Clear agent information from sessionStorage to avoid reuse
        sessionStorage.removeItem('agentInfo');
      }
    }
  }, []);

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
        // Image validation: Ensure at least one image
        if (localFormData.images && localFormData.images.length > 0) {
          isValid = true;
        } else {
          isValid = false;
        }
        break;
      case 4:
        isValid = await trigger(['contact_person', 'contact_phone', 'contact_email']);
        break;
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
      yearBuilt: localFormData.yearBuilt,
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
      images: localFormData.images || []
    };
    
    // Save to localStorage
    localStorage.setItem('tempPropertyData', JSON.stringify(previewData));
    
    // Navigate to preview page
    router.push('/properties/preview/preview');
  };

  // Form submission
  const onSubmit = async (data: PropertyFormData) => {
    console.log('Formular wird übermittelt, Daten:', data);
    if (isSubmitting) {
      console.log('Formular wird bereits übermittelt, doppelte Übermittlung wird ignoriert');
      return;
    }
    
    setIsSubmitting(true);
    try {
      console.log('Schritt 1: Immobiliendaten werden hochgeladen...');
      // Schritt 1: Immobiliendaten hochladen
      const { id: propertyId } = await cachePropertyData({
        title: data.title,
        property_type: data.property_type,
        city: data.city,
        postal_code: data.postal_code,
        address: data.address,
        price: data.price,
        rooms: data.rooms,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        area: data.area,
        yearBuilt: data.yearBuilt,
        heating_system: data.heating_system,
        energy_source: data.energy_source,
        energy_certificate: data.energy_certificate,
        parking: data.parking,
        renovation_quality: data.renovation_quality,
        floor_type: data.floor_type,
        description: data.description || '',
        locationDescription: data.locationDescription || '',
        contact_person: data.contact_person,
        contact_phone: data.contact_phone,
        contact_email: data.contact_email,
        contact_person2: data.contact_person2,
        contact_phone2: data.contact_phone2,
        contact_email2: data.contact_email2,
        agentInfo: agentInfo || undefined, // Agent-Informationen hinzufügen
      });
      console.log('Immobiliendaten erfolgreich hochgeladen, ID:', propertyId);

      // Schritt 2: Bilder hochladen
      if (data.images.length > 0) {
        console.log('Schritt 2: Bilder werden hochgeladen, Anzahl:', data.images.length);
        await uploadPropertyImages(propertyId, data.images);
        console.log('Bilder erfolgreich hochgeladen');
      } else {
        console.log('Keine Bilder zum Hochladen vorhanden');
      }

      // Schritt 2.5: Grundriss hochladen
      if (localFormData.floorPlan) {
        console.log('Schritt 2.5: Grundriss wird hochgeladen');
        await uploadPropertyImages(propertyId, [localFormData.floorPlan], undefined, 'floorplan');
        console.log('Grundriss erfolgreich hochgeladen');
      } else {
        console.log('Kein Grundriss zum Hochladen vorhanden');
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

  // Image handling
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    updateLocalData({ images: files });
  };

  const removeImage = (index: number) => {
    const newImages = [...(localFormData.images || [])];
    newImages.splice(index, 1);
    updateLocalData({ images: newImages });
  };


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
    localFormData.address && 
    localFormData.rooms && 
    localFormData.area && 
    localFormData.yearBuilt;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Neue Immobilie erstellen</h1>
          <p className="mt-2 text-gray-600">Füllen Sie die Immobiliendaten aus und erstellen Sie eine professionelle Präsentation</p>
        </div>

        {/* Overall Progress Indicator */}
        {(agentInfo || (typeof window !== 'undefined' && sessionStorage.getItem('userType') === 'private')) && (
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
                    3
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
                  Verantwortlich: {agentInfo.responsiblePerson} | Telefon: {agentInfo.phone}
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
                  <label htmlFor="locationDescription" className="block text-sm font-medium text-gray-700 mb-2">
                    Lagebeschreibung
                  </label>
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
                {/* Property Images Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Immobilienbilder *
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
                        Bilder hochladen
                      </div>
                      <div className="text-sm text-gray-500">
                        JPG, PNG, WebP Formate unterstützt, maximal 20 Bilder
                      </div>
                    </label>
                  </div>
                  {errors.images && (
                    <p className="mt-1 text-sm text-red-600">{errors.images.message}</p>
                  )}
                </div>

                {/* Floor Plan Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grundriss
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setLocalFormData(prev => ({ ...prev, floorPlan: file }));
                        }
                      }}
                      className="hidden"
                      id="floorplan-upload"
                    />
                    <label
                      htmlFor="floorplan-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="w-12 h-12 text-gray-400 mb-4" />
                      <div className="text-lg font-medium text-gray-700 mb-2">
                        Grundriss hochladen
                      </div>
                      <div className="text-sm text-gray-500">
                        JPG, PNG, WebP Formate unterstützt, für Exposé-Generierung
                      </div>
                    </label>
                  </div>
                </div>

                {/* Property Images Preview */}
                {localFormData.images && localFormData.images.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Ausgewählte Immobilienbilder ({localFormData.images.length}/20)
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {localFormData.images.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Vorschau Bild ${index + 1}`}
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

                {/* Floor Plan Preview */}
                {localFormData.floorPlan && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Ausgewählter Grundriss
                    </h4>
                    <div className="relative group max-w-md">
                      <img
                        src={URL.createObjectURL(localFormData.floorPlan)}
                        alt="Grundriss Vorschau"
                        className="w-full h-48 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => setLocalFormData(prev => ({ ...prev, floorPlan: undefined }))}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg">
                        {localFormData.floorPlan.name.length > 30 ? localFormData.floorPlan.name.substring(0, 30) + '...' : localFormData.floorPlan.name}
                      </div>
                    </div>
                  </div>
                )}

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
                      type="button"
                      onClick={handlePreview}
                      disabled={!isValid}
                      className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Vorschau
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
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
                images: localFormData.images ? localFormData.images.map((file) => ({
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