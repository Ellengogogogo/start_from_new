'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PropertyFormData, AgentInfo, Photos } from '@/types/property';
import { PropertyFormContainer } from '@/components/organisms';
import { cachePropertyData, uploadPropertyImages, generateExpose } from '@/services/api';

export default function NewPropertyPage() {
  const router = useRouter();
  const [agentInfo, setAgentInfo] = useState<AgentInfo | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [updatePhotoUrlsRef, setUpdatePhotoUrlsRef] = useState<((category: keyof Photos, urls: string[]) => void) | null>(null);

  // Check if we're on the client side to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check if there is agent information
  useEffect(() => {
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

  // Handle save draft
  const handleSaveDraft = async (data: PropertyFormData) => {
    try {
      // Cache the property data
      await cachePropertyData(data);
      
      // Show success message (you can add a toast notification here)
      console.log('Draft saved successfully');
      
      // Optionally redirect to a draft list page
      // router.push('/properties/drafts');
    } catch (error) {
      console.error('Error saving draft:', error);
      // Show error message (you can add a toast notification here)
      throw error;
    }
  };

  // Handle form submission
  const handleSubmit = async (data: PropertyFormData) => {
    try {
      // First, cache the property data to get a property ID
      const cachedProperty = await cachePropertyData(data);
      const propertyId = cachedProperty.id;
      
      // Upload images if any
      if (data.photos) {
        try {
          // Convert Photos object to flat array of files
          const allPhotos: Array<File & { category?: keyof Photos; displayName?: string }> = [];
          Object.entries(data.photos).forEach(([category, files]) => {
            if (files && files.length > 0) {
              files.forEach((file: File) => {
                allPhotos.push({
                  ...file,
                  category: category as keyof Photos,
                  displayName: category
                });
              });
            }
          });
          
          if (allPhotos.length > 0) {
            const imageResult = await uploadPropertyImages(propertyId, allPhotos);
            // Store the uploaded image URLs for later use
            console.log('Images uploaded successfully:', imageResult.images);
            
            // Update photoUrls state with the uploaded URLs
            if (updatePhotoUrlsRef && imageResult.images) {
              // Group images by category
              const imagesByCategory: Record<string, string[]> = {};
              imageResult.images.forEach((image, index) => {
                const category = allPhotos[index]?.category || 'wohnzimmer';
                if (!imagesByCategory[category]) {
                  imagesByCategory[category] = [];
                }
                imagesByCategory[category].push(image.url);
              });
              
              // Update each category's photoUrls
              Object.entries(imagesByCategory).forEach(([category, urls]) => {
                updatePhotoUrlsRef(category as keyof Photos, urls);
              });
            }
          }
        } catch (uploadError) {
          console.error('Error uploading images:', uploadError);
          // Continue without images if upload fails
        }
      }

      // Generate expose using the property ID
      const expose = await generateExpose(propertyId);
      
      // Show success message
      console.log('Property created successfully');
      
      // Redirect to the generated expose
      if (expose && expose.exposeId) {
        router.push(`/properties/${propertyId}/expose/${expose.exposeId}`);
      } else {
        router.push('/properties');
      }
    } catch (error) {
      console.error('Error creating property:', error);
      // Show error message (you can add a toast notification here)
      throw error;
    }
  };

  // Callback to receive updatePhotoUrls function from PropertyFormContainer
  const handleUpdatePhotoUrlsRef = useCallback((updateFn: (category: keyof Photos, urls: string[]) => void) => {
    setUpdatePhotoUrlsRef(() => updateFn);
  }, []);

  // Show loading state while checking client side
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PropertyFormContainer
        agentInfo={agentInfo}
        onSaveDraft={handleSaveDraft}
        onSubmit={handleSubmit}
        onUpdatePhotoUrlsRef={handleUpdatePhotoUrlsRef}
        isEditMode={false}
      />
    </div>
  );
}