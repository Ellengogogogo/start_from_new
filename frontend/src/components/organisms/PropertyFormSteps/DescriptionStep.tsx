import React from 'react';
import { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { PropertyFormData } from '@/types/property';
import { DescriptionStyle } from '@/hooks/useAIGeneration';

export interface DescriptionStepProps {
  register: UseFormRegister<PropertyFormData>;
  errors: FieldErrors<PropertyFormData>;
  setValue: UseFormSetValue<PropertyFormData>;
  defaultValues?: Partial<PropertyFormData>;
  // AI生成相关
  descriptionStyle: DescriptionStyle;
  locationDescriptionStyle: DescriptionStyle;
  isGeneratingDescription: boolean;
  isGeneratingLocationDescription: boolean;
  canGenerateDescription: boolean;
  canGenerateLocationDescription: boolean;
  onDescriptionStyleChange: (style: DescriptionStyle) => void;
  onLocationDescriptionStyleChange: (style: DescriptionStyle) => void;
  onGenerateDescription: () => void;
  onGenerateLocationDescription: () => void;
}

export default function DescriptionStep({
  register,
  errors,
  setValue,
  defaultValues,
  descriptionStyle,
  locationDescriptionStyle,
  isGeneratingDescription,
  isGeneratingLocationDescription,
  canGenerateDescription,
  canGenerateLocationDescription,
  onDescriptionStyleChange,
  onLocationDescriptionStyleChange,
  onGenerateDescription,
  onGenerateLocationDescription,
}: DescriptionStepProps) {
  return (
    <div className="space-y-8">
      {/* 房产描述 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Immobilienbeschreibung
          </label>
          <div className="flex items-center gap-3">
            {/* 风格选择 */}
            <select
              id="description-style"
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => onDescriptionStyleChange(e.target.value as DescriptionStyle)}
              value={descriptionStyle}
            >
              <option value="formal">Formell</option>
              <option value="marketing">Marketing</option>
              <option value="family">Familienfreundlich</option>
            </select>
            
            {/* AI生成按钮 */}
            <button
              type="button"
              onClick={onGenerateDescription}
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
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  KI-Beschreibung generieren
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* 描述编辑器 */}
        <textarea
          {...register('description')}
          id="description"
          rows={6}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Beschreiben Sie die Besonderheiten, Vorteile und Umgebung der Immobilie..."
          defaultValue={defaultValues?.description}
        />
        
        {/* AI生成的描述（可编辑） */}
        {defaultValues?.suggested_description && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-blue-800">KI-generierte Beschreibung</h4>
              <button
                type="button"
                onClick={() => {
                  setValue('description', defaultValues.suggested_description || '');
                }}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Diese Beschreibung verwenden
              </button>
            </div>
            <textarea
              value={defaultValues.suggested_description}
              onChange={(e) => {
                // 这里可以添加更新suggested_description的逻辑
              }}
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
          Maximal 2000 Zeichen, aktuell {defaultValues?.description?.length || 0}/2000
        </p>
      </div>

      {/* 位置描述 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="locationDescription" className="block text-sm font-medium text-gray-700">
            Lagebeschreibung
          </label>
          <div className="flex items-center gap-3">
            {/* 位置描述风格选择 */}
            <select
              id="location-description-style"
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => onLocationDescriptionStyleChange(e.target.value as DescriptionStyle)}
              value={locationDescriptionStyle}
            >
              <option value="formal">Formell</option>
              <option value="marketing">Marketing</option>
              <option value="family">Familienfreundlich</option>
            </select>
            
            {/* AI位置描述生成按钮 */}
            <button
              type="button"
              onClick={onGenerateLocationDescription}
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
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
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
          defaultValue={defaultValues?.locationDescription}
        />
        
        {/* AI生成的位置描述（可编辑） */}
        {defaultValues?.suggested_location_description && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-green-800">KI-generierte Lagebeschreibung</h4>
              <button
                type="button"
                onClick={() => {
                  setValue('locationDescription', defaultValues.suggested_location_description || '');
                }}
                className="text-xs text-green-600 hover:text-green-700 font-medium"
              >
                Diese Beschreibung verwenden
              </button>
            </div>
            <textarea
              value={defaultValues.suggested_location_description}
              onChange={(e) => {
                // 这里可以添加更新suggested_location_description的逻辑
              }}
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
          Maximal 1000 Zeichen, aktuell {defaultValues?.locationDescription?.length || 0}/1000
        </p>
      </div>

      {/* 信息提示 */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-purple-800">
              Beschreibung & KI-Unterstützung
            </h3>
            <div className="mt-2 text-sm text-purple-700">
              <p>Erstellen Sie ansprechende Beschreibungen Ihrer Immobilie. Nutzen Sie die KI-Unterstützung für professionelle Texte in verschiedenen Stilen.</p>
              <p className="mt-1">Die Beschreibungen sind optional, aber wichtig für ein attraktives Exposé.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
