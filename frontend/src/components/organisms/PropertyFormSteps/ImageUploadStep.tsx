import React, { useState } from 'react';
import { Images } from '@/types/property';
import { ImageCategory } from '@/hooks/useImageUpload';

export interface ImageUploadStepProps {
  images: Images;
  imageUrls: Record<ImageCategory, string[]>;
  isDragOver: boolean;
  dragOverTab: ImageCategory;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>, category: ImageCategory) => void;
  onRemoveImage: (category: ImageCategory, index: number) => void;
  onDrop: (files: File[], category: ImageCategory) => void;
  onDragStateChange: (isOver: boolean, category?: ImageCategory) => void;
  getTabDisplayName: (category: ImageCategory) => string;
  getCategoryImageCount: (category: ImageCategory) => number;
  getTotalImageCount: () => number;
  maxImagesPerCategory: number;
}

export default function ImageUploadStep({
  images,
  imageUrls,
  isDragOver,
  dragOverTab,
  onImageUpload,
  onRemoveImage,
  onDrop,
  onDragStateChange,
  getTabDisplayName,
  getCategoryImageCount,
  getTotalImageCount,
  maxImagesPerCategory,
}: ImageUploadStepProps) {
  const [activeImageTab, setActiveImageTab] = useState<ImageCategory>('wohnzimmer');

  const imageCategories: Array<{ id: ImageCategory; name: string; icon: string }> = [
    { id: 'wohnzimmer', name: 'Wohnzimmer', icon: '🏠' },
    { id: 'kueche', name: 'Küche & Essbereich', icon: '🍳' },
    { id: 'zimmer', name: 'Zimmer', icon: '🛏️' },
    { id: 'bad', name: 'Bad', icon: '🚿' },
    { id: 'balkon', name: 'Balkon & Außenbereich', icon: '🌿' },
    { id: 'grundriss', name: 'Grundriss', icon: '📐' }
  ];

  return (
    <div className="space-y-8">
      {/* 分类图片上传标签页 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Immobilienbilder nach Kategorien *
        </label>
        
        {/* 标签导航 */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {imageCategories.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveImageTab(tab.id)}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeImageTab === tab.id
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

        {/* 信息提示 */}
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Bild-Upload Anforderungen
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>• Jede Kategorie kann maximal {maxImagesPerCategory} Bilder enthalten</p>
                <p>• Mindestens eine Kategorie muss Bilder enthalten</p>
              </div>
            </div>
          </div>
        </div>

        {/* 标签内容 */}
        <div className="mt-6">
          {(() => {
            const currentImages = images[activeImageTab] || [];
            
            return (
              <div className="space-y-4">
                {/* 统一的上传区域 - 支持点击和拖拽 */}
                <div 
                  className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-all ${
                    isDragOver && dragOverTab === activeImageTab
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300'
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    onDragStateChange(true, activeImageTab);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    onDragStateChange(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    onDragStateChange(false);
                    const files = Array.from(e.dataTransfer.files);
                    
                    // 检查是否可以添加更多图片
                    const availableSlots = maxImagesPerCategory - currentImages.length;
                    
                    if (availableSlots <= 0) {
                      alert(`Sie können maximal ${maxImagesPerCategory} Bilder für ${getTabDisplayName(activeImageTab)} hochladen.`);
                      return;
                    }
                    
                    const filesToAdd = files.slice(0, availableSlots);
                    onDrop(filesToAdd, activeImageTab);
                  }}
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => onImageUpload(e, activeImageTab)}
                    className="hidden"
                    id={`image-upload-${activeImageTab}`}
                  />
                  <label
                    htmlFor={`image-upload-${activeImageTab}`}
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <div className="text-lg font-medium text-gray-700 mb-2">
                      {getTabDisplayName(activeImageTab)} Bilder hochladen
                    </div>
                    <div className="text-sm text-gray-500">
                      JPG, PNG, WebP Formate unterstützt, maximal {maxImagesPerCategory} Bilder
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {isDragOver && dragOverTab === activeImageTab
                        ? 'Bilder hier ablegen'
                        : 'Drag & Drop oder Klick zum Auswählen'}
                    </div>
                  </label>
                </div>

                {/* 图片数量和上传按钮 */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {currentImages.length} von {maxImagesPerCategory} Bilder hochgeladen
                  </div>
                  <button
                    type="button"
                    onClick={() => document.getElementById(`image-upload-${activeImageTab}`)?.click()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Weitere Bilder hinzufügen
                  </button>
                </div>

                {/* 图片预览网格 */}
                {currentImages.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      {getTabDisplayName(activeImageTab)} Bilder
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {currentImages.map((file, index) => {
                        // 使用存储的URL或创建新的URL
                        const imageUrl = imageUrls[activeImageTab]?.[index] || URL.createObjectURL(file);
                        
                        return (
                          <div key={index} className="relative group">
                            <img
                              src={imageUrl}
                              alt={`${getTabDisplayName(activeImageTab)} Bild ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => onRemoveImage(activeImageTab, index)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
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

                {/* 空状态 */}
                {currentImages.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>Noch keine Bilder für {getTabDisplayName(activeImageTab)} hochgeladen</p>
                    <p className="text-sm">Laden Sie Bilder hoch, um diese Kategorie zu vervollständigen</p>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>

      {/* 图片摘要 */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Bild-Übersicht</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          {imageCategories.map(({ id, name }) => (
            <div key={id} className="flex items-center justify-between">
              <span className="text-gray-600">{name}:</span>
              <span className={`font-medium ${getCategoryImageCount(id) > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                {getCategoryImageCount(id)} Bilder
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm font-medium">
            <span>Gesamt:</span>
            <span className="text-blue-600">
              {getTotalImageCount()} Bilder
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
