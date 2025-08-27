import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { PropertyFormData } from '@/types/property';

export interface PropertyDetailsStepProps {
  register: UseFormRegister<PropertyFormData>;
  errors: FieldErrors<PropertyFormData>;
  defaultValues?: Partial<PropertyFormData>;
}

export default function PropertyDetailsStep({ register, errors, defaultValues }: PropertyDetailsStepProps) {
  return (
    <div className="space-y-6">
      {/* 房间信息 */}
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
            defaultValue={defaultValues?.rooms}
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
            defaultValue={defaultValues?.bedrooms}
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
            defaultValue={defaultValues?.bathrooms}
          />
          {errors.bathrooms && (
            <p className="mt-1 text-sm text-red-600">{errors.bathrooms.message}</p>
          )}
        </div>
      </div>

      {/* 面积和建筑年份 */}
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
            defaultValue={defaultValues?.area}
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
            defaultValue={defaultValues?.yearBuilt}
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
            defaultValue={defaultValues?.heating_system || ''}
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

      {/* 能源和停车 */}
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
            defaultValue={defaultValues?.energy_source || ''}
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
            defaultValue={defaultValues?.energy_certificate || ''}
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
            defaultValue={defaultValues?.parking || ''}
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

      {/* 装修质量和地面类型 */}
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
            defaultValue={defaultValues?.renovation_quality || ''}
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
            defaultValue={defaultValues?.floor_type || ''}
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

      {/* 信息提示 */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              Immobiliendetails
            </h3>
            <div className="mt-2 text-sm text-green-700">
              <p>Detaillierte Informationen über die technischen Eigenschaften und Ausstattung Ihrer Immobilie. Diese Daten sind wichtig für die Bewertung und das Exposé.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
