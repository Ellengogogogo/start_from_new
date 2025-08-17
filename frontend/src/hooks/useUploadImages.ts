import { useState, useCallback } from 'react';
import { UploadProgress } from '@/types/property';

export interface UseUploadImagesOptions {
  onProgress?: (progress: UploadProgress) => void;
  onSuccess?: (response: { images: string[] }) => void;
  onError?: (error: Error) => void;
}

export function useUploadImages(options: UseUploadImagesOptions = {}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const uploadImages = useCallback(async (
    propertyId: string,
    images: File[],
    apiUrl: string = '/api/cache/property-images'
  ) => {
    if (images.length === 0) return;

    setIsUploading(true);
    setUploadProgress({});

    try {
      const formData = new FormData();
      images.forEach((image, index) => {
        formData.append('images', image);
      });

      const xhr = new XMLHttpRequest();

      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(prev => ({
              ...prev,
              [propertyId]: progress
            }));
            options.onProgress?.(uploadProgress);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              setUploadedImages(prev => [...prev, ...response.images]);
              options.onSuccess?.(response);
              resolve(response);
            } catch (error) {
              reject(new Error('Failed to parse response'));
            }
          } else {
            reject(new Error(`Upload failed with status: ${xhr.status}`));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed'));
        });

        xhr.open('POST', `${apiUrl}/${propertyId}`);
        xhr.send(formData);
      });
    } catch (error) {
      options.onError?.(error as Error);
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress({});
    }
  }, [options]);

  const resetUpload = useCallback(() => {
    setIsUploading(false);
    setUploadProgress({});
    setUploadedImages([]);
  }, []);

  return {
    isUploading,
    uploadProgress,
    uploadedImages,
    uploadImages,
    resetUpload,
  };
}
