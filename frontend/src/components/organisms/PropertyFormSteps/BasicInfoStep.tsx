import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { PropertyFormData } from '@/types/property';

export interface BasicInfoStepProps {
  register: UseFormRegister<PropertyFormData>;
  errors: FieldErrors<PropertyFormData>;
  defaultValues?: Partial<PropertyFormData>;
}

export default function BasicInfoStep({ register, errors, defaultValues }: BasicInfoStepProps) {
  return (
    <div className="space-y-6">
      {/* 房产标题 */}
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
          defaultValue={defaultValues?.title}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* 房产类型 */}
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
          defaultValue={defaultValues?.property_type || 'apartment'}
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

      {/* 城市和邮编 */}
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
            defaultValue={defaultValues?.city || 'Berlin'}
          />
          {errors.city && (
            <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="plz" className="block text-sm font-medium text-gray-700 mb-2">
            Postleitzahl *
          </label>
          <input
            {...register('plz')}
            type="text"
            id="plz"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.plz ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="z.B.: 10115"
            defaultValue={defaultValues?.plz}
          />
          {errors.plz && (
            <p className="mt-1 text-sm text-red-600">{errors.plz.message}</p>
          )}
        </div>
      </div>

      {/* 完整地址 */}
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
          defaultValue={defaultValues?.address}
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
        )}
      </div>

      {/* 价格 */}
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
          defaultValue={defaultValues?.price}
        />
        {errors.price && (
          <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
        )}
      </div>

      {/* 信息提示 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Grundinformationen
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>Füllen Sie die grundlegenden Informationen über Ihre Immobilie aus. Diese Daten werden für die weitere Bearbeitung und das generierte Exposé benötigt.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
