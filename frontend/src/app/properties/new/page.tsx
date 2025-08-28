'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PropertyFormData, AgentInfo, Images } from '@/types/property';
import { PropertyForm } from '@/components/organisms';
import { cachePropertyData, uploadPropertyImages, generateExpose } from '@/services/api';

export default function NewPropertyPage() {
  const router = useRouter();
  const [agentInfo, setAgentInfo] = useState<AgentInfo | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [updateImageUrlsRef, setUpdateImageUrlsRef] = useState<((category: keyof Images, urls: string[]) => void) | null>(null);

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
      if (data.images) {
        try {
          // Convert Images object to flat array of files
          const allImages: Array<File & { category?: keyof Images; displayName?: string }> = [];
          Object.entries(data.images).forEach(([category, files]) => {
            if (files && files.length > 0) {
              files.forEach((file: File) => {
                allImages.push({
                  ...file,
                  category: category as keyof Images,
                  displayName: category
                });
              });
            }
          });
          
          if (allImages.length > 0) {
            const imageResult = await uploadPropertyImages(propertyId, allImages);
            // Store the uploaded image URLs for later use
            console.log('Images uploaded successfully:', imageResult.images);
            
            // Update imageUrls state with the uploaded URLs
            if (updateImageUrlsRef && imageResult.images) {
              // Group images by category
              const imagesByCategory: Record<string, string[]> = {};
              imageResult.images.forEach((image, index) => {
                const category = allImages[index]?.category || 'wohnzimmer';
                if (!imagesByCategory[category]) {
                  imagesByCategory[category] = [];
                }
                imagesByCategory[category].push(image.url);
              });
              
              // Update each category's imageUrls
              Object.entries(imagesByCategory).forEach(([category, urls]) => {
                updateImageUrlsRef(category as keyof Images, urls);
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

  // Callback to receive updateImageUrls function from PropertyForm
  const handleUpdateImageUrlsRef = useCallback((updateFn: (category: keyof Images, urls: string[]) => void) => {
    setUpdateImageUrlsRef(() => updateFn);
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
              <PropertyForm
        agentInfo={agentInfo}
        onSaveDraft={handleSaveDraft}
        onSubmit={handleSubmit}
        onUpdateImageUrlsRef={handleUpdateImageUrlsRef}
        isEditMode={false}
      />
    </div>
  );
}