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
            <option value="Zentralheizung">Zentralheizung</option>
            <option value="Fußbodenheizung">Fußbodenheizung</option>
            <option value="Heizkörper">Heizkörper</option>
            <option value="Klimaanlage">Klimaanlage</option>
            <option value="Kaminofen">Kaminofen</option>
            <option value="Wärmepumpe">Wärmepumpe</option>
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
            <option value="Erdgas">Erdgas</option>
            <option value="Strom">Strom</option>
            <option value="Heizöl">Heizöl</option>
            <option value="Fernwärme">Fernwärme</option>
            <option value="Holz">Holz</option>
            <option value="Solarenergie">Solarenergie</option>
            <option value="Geothermie">Geothermie</option>
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
            <option value="Garage">Garage</option>
            <option value="Parkplatz">Parkplatz</option>
            <option value="Straßenparken">Straßenparken</option>
            <option value="Tiefgarage">Tiefgarage</option>
            <option value="Kein Parkplatz">Kein Parkplatz</option>
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
            <option value="Luxuriös">Luxuriös</option>
            <option value="Hochwertig">Hochwertig</option>
            <option value="Standard">Standard</option>
            <option value="Grundlegend">Grundlegend</option>
            <option value="Renovierungsbedürftig">Renovierungsbedürftig</option>
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
            <option value="Parkett">Parkett</option>
            <option value="Laminat">Laminat</option>
            <option value="Fliesen">Fliesen</option>
            <option value="Teppich">Teppich</option>
            <option value="Vinyl">Vinyl</option>
            <option value="Beton">Beton</option>
            <option value="Gemischt">Gemischt</option>
          </select>
          {errors.floor_type && (
            <p className="mt-1 text-sm text-red-600">{errors.floor_type.message}</p>
          )}
        </div>
      </div>

      {/* 新增字段：地块大小、阳台/花园、能源信息 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="grundstuecksgroesse" className="block text-sm font-medium text-gray-700 mb-2">
            Grundstücksgröße (m²)
          </label>
          <input
            {...register('grundstuecksgroesse', { valueAsNumber: true })}
            type="number"
            id="grundstuecksgroesse"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.grundstuecksgroesse ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="z.B.: 500"
            min="0"
            step="0.01"
            defaultValue={defaultValues?.grundstuecksgroesse}
          />
          {errors.grundstuecksgroesse && (
            <p className="mt-1 text-sm text-red-600">{errors.grundstuecksgroesse.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="balkon_garten" className="block text-sm font-medium text-gray-700 mb-2">
            Balkon/Garten
          </label>
          <select
            {...register('balkon_garten')}
            id="balkon_garten"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.balkon_garten ? 'border-red-500' : 'border-gray-300'
            }`}
            defaultValue={defaultValues?.balkon_garten || ''}
          >
            <option value="">Balkon/Garten auswählen</option>
            <option value="Balkon">Balkon</option>
            <option value="Terrasse">Terrasse</option>
            <option value="Garten">Garten</option>
            <option value="Balkon + Garten">Balkon + Garten</option>
            <option value="Terrasse + Garten">Terrasse + Garten</option>
            <option value="Kein Außenbereich">Kein Außenbereich</option>
          </select>
          {errors.balkon_garten && (
            <p className="mt-1 text-sm text-red-600">{errors.balkon_garten.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="energieverbrauch" className="block text-sm font-medium text-gray-700 mb-2">
            Energieverbrauch (kWh/m²)
          </label>
          <input
            {...register('energieverbrauch', { valueAsNumber: true })}
            type="number"
            id="energieverbrauch"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.energieverbrauch ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="z.B.: 120"
            min="0"
            step="0.1"
            defaultValue={defaultValues?.energieverbrauch}
          />
          {errors.energieverbrauch && (
            <p className="mt-1 text-sm text-red-600">{errors.energieverbrauch.message}</p>
          )}
        </div>
      </div>

      {/* 能源证书信息 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="energieausweis_typ" className="block text-sm font-medium text-gray-700 mb-2">
            Energieausweis
          </label>
          <select
            {...register('energieausweis_typ')}
            id="energieausweis_typ"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.energieausweis_typ ? 'border-red-500' : 'border-gray-300'
            }`}
            defaultValue={defaultValues?.energieausweis_typ || ''}
          >
            <option value="">Energieausweis auswählen</option>
            <option value="Verbrauchsausweis">Verbrauchsausweis</option>
            <option value="Bedarfsausweis">Bedarfsausweis</option>
            <option value="Kein Energieausweis">Kein Energieausweis</option>
          </select>
          {errors.energieausweis_typ && (
            <p className="mt-1 text-sm text-red-600">{errors.energieausweis_typ.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="energieausweis_gueltig_bis" className="block text-sm font-medium text-gray-700 mb-2">
            Energieausweis gültig bis
          </label>
          <input
            {...register('energieausweis_gueltig_bis')}
            type="date"
            id="energieausweis_gueltig_bis"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.energieausweis_gueltig_bis ? 'border-red-500' : 'border-gray-300'
            }`}
            defaultValue={defaultValues?.energieausweis_gueltig_bis}
          />
          {errors.energieausweis_gueltig_bis && (
            <p className="mt-1 text-sm text-red-600">{errors.energieausweis_gueltig_bis.message}</p>
          )}
        </div>
      </div>

      {/* Einbauküche 字段 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="einbaukueche" className="block text-sm font-medium text-gray-700 mb-2">
            Einbauküche
          </label>
          <select
            {...register('einbaukueche')}
            id="einbaukueche"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.einbaukueche ? 'border-red-500' : 'border-gray-300'
            }`}
            defaultValue={defaultValues?.einbaukueche || ''}
          >
            <option value="">Einbauküche auswählen</option>
            <option value="Ja">Ja</option>
            <option value="Nein">Nein</option>
          </select>
          {errors.einbaukueche && (
            <p className="mt-1 text-sm text-red-600">{errors.einbaukueche.message}</p>
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
