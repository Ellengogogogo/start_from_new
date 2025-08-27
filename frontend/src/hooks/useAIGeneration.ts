import { useState, useCallback } from 'react';
import { PropertyFormData } from '@/types/property';
import { generateAIDescription, generateAILocationDescriptionSimple } from '@/services/api';

export type DescriptionStyle = 'formal' | 'marketing' | 'family';

export interface UseAIGenerationOptions {
  onDescriptionGenerated?: (description: string) => void;
  onLocationDescriptionGenerated?: (description: string) => void;
  onError?: (error: Error) => void;
}

export function useAIGeneration(options: UseAIGenerationOptions = {}) {
  // AI生成状态
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [isGeneratingLocationDescription, setIsGeneratingLocationDescription] = useState(false);
  const [descriptionStyle, setDescriptionStyle] = useState<DescriptionStyle>('formal');
  const [locationDescriptionStyle, setLocationDescriptionStyle] = useState<DescriptionStyle>('formal');

  // 检查是否可以生成描述
  const canGenerateDescription = useCallback((formData: Partial<PropertyFormData>): boolean => {
    return !!(
      formData.title && 
      formData.property_type && 
      formData.city && 
      formData.postal_code && 
      formData.address
    );
  }, []);

  // 检查是否可以生成位置描述
  const canGenerateLocationDescription = useCallback((formData: Partial<PropertyFormData>): boolean => {
    return !!(formData.city && formData.address);
  }, []);

  // 生成房产描述
  const generateDescription = useCallback(async (
    formData: Partial<PropertyFormData>,
    style: DescriptionStyle = descriptionStyle
  ) => {
    if (!canGenerateDescription(formData)) {
      throw new Error('Bitte füllen Sie zuerst die Grundinformationen aus, damit die KI eine Beschreibung generieren kann.');
    }

    setIsGeneratingDescription(true);
    try {
      const response = await generateAIDescription({
        title: formData.title!,
        property_type: formData.property_type!,
        city: formData.city!,
        postal_code: formData.postal_code!,
        address: formData.address!,
        price: formData.price || 0,
        rooms: formData.rooms || 0,
        bedrooms: formData.bedrooms || 0,
        bathrooms: formData.bathrooms || 0,
        area: formData.area || 0,
        yearBuilt: formData.yearBuilt || 0,
        heating_system: formData.heating_system || '',
        energy_source: formData.energy_source || '',
        energy_certificate: formData.energy_certificate || '',
        parking: formData.parking || '',
        renovation_quality: formData.renovation_quality || '',
        floor_type: formData.floor_type || '',
        contact_person: formData.contact_person || '',
        contact_phone: formData.contact_phone || '',
        contact_email: formData.contact_email || '',
        contact_person2: formData.contact_person2 || '',
        contact_phone2: formData.contact_phone2 || '',
        contact_email2: formData.contact_email2 || '',
        photos: {
          wohnzimmer: [],
          kueche: [],
          zimmer: [],
          bad: [],
          balkon: [],
          grundriss: []
        },
      }, style);
      
      const description = response.suggested_description;
      options.onDescriptionGenerated?.(description);
      return description;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
      const aiError = new Error(`KI-Beschreibung konnte nicht generiert werden: ${errorMessage}`);
      options.onError?.(aiError);
      throw aiError;
    } finally {
      setIsGeneratingDescription(false);
    }
  }, [descriptionStyle, canGenerateDescription, options]);

  // 生成位置描述
  const generateLocationDescription = useCallback(async (
    city: string,
    address: string,
    style: DescriptionStyle = locationDescriptionStyle
  ) => {
    if (!canGenerateLocationDescription({ city, address })) {
      throw new Error('Bitte füllen Sie zuerst Stadt und Adresse aus, damit die KI eine Lagebeschreibung generieren kann.');
    }

    setIsGeneratingLocationDescription(true);
    try {
      const response = await generateAILocationDescriptionSimple(city, address, style);
      const locationDescription = response.location_description;
      options.onLocationDescriptionGenerated?.(locationDescription);
      return locationDescription;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
      const aiError = new Error(`KI-Lagebeschreibung konnte nicht generiert werden: ${errorMessage}`);
      options.onError?.(aiError);
      throw aiError;
    } finally {
      setIsGeneratingLocationDescription(false);
    }
  }, [locationDescriptionStyle, canGenerateLocationDescription, options]);

  // 批量生成描述
  const generateAllDescriptions = useCallback(async (
    formData: Partial<PropertyFormData>,
    descriptionStyleOverride?: DescriptionStyle,
    locationDescriptionStyleOverride?: DescriptionStyle
  ) => {
    const results = {
      description: '',
      locationDescription: '',
      errors: [] as Error[]
    };

    try {
      // 生成房产描述
      if (canGenerateDescription(formData)) {
        try {
          results.description = await generateDescription(
            formData, 
            descriptionStyleOverride || descriptionStyle
          );
        } catch (error) {
          results.errors.push(error as Error);
        }
      }

      // 生成位置描述
      if (canGenerateLocationDescription(formData)) {
        try {
          results.locationDescription = await generateLocationDescription(
            formData.city!,
            formData.address!,
            locationDescriptionStyleOverride || locationDescriptionStyle
          );
        } catch (error) {
          results.errors.push(error as Error);
        }
      }

      return results;
    } catch (error) {
      results.errors.push(error as Error);
      return results;
    }
  }, [
    descriptionStyle, 
    locationDescriptionStyle, 
    canGenerateDescription, 
    canGenerateLocationDescription, 
    generateDescription, 
    generateLocationDescription
  ]);

  // 重置AI生成状态
  const resetAIGeneration = useCallback(() => {
    setIsGeneratingDescription(false);
    setIsGeneratingLocationDescription(false);
  }, []);

  // 设置描述风格
  const setDescriptionStyleWithCallback = useCallback((style: DescriptionStyle) => {
    setDescriptionStyle(style);
  }, []);

  // 设置位置描述风格
  const setLocationDescriptionStyleWithCallback = useCallback((style: DescriptionStyle) => {
    setLocationDescriptionStyle(style);
  }, []);

  return {
    // 状态
    isGeneratingDescription,
    isGeneratingLocationDescription,
    descriptionStyle,
    locationDescriptionStyle,
    
    // 方法
    generateDescription,
    generateLocationDescription,
    generateAllDescriptions,
    resetAIGeneration,
    
    // 检查方法
    canGenerateDescription,
    canGenerateLocationDescription,
    
    // 设置器
    setDescriptionStyle: setDescriptionStyleWithCallback,
    setLocationDescriptionStyle: setLocationDescriptionStyleWithCallback,
    
    // 计算属性
    isGenerating: isGeneratingDescription || isGeneratingLocationDescription,
  };
}
