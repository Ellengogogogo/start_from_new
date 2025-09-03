import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { PropertyFormData } from '@/types/property';

export interface ContactInfoStepProps {
  register: UseFormRegister<PropertyFormData>;
  errors: FieldErrors<PropertyFormData>;
  defaultValues?: Partial<PropertyFormData>;
}

export default function ContactInfoStep({ register, errors, defaultValues }: ContactInfoStepProps) {
  return (
    <div className="space-y-6">
      {/* 主要联系人信息 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Hauptkontakt *</h3>
        
        <div className="space-y-4">
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
              defaultValue={defaultValues?.contact_person || ''}
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
              defaultValue={defaultValues?.contact_phone || ''}
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
              defaultValue={defaultValues?.contact_email || ''}
            />
            {errors.contact_email && (
              <p className="mt-1 text-sm text-red-600">{errors.contact_email.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* 第二联系人信息（可选） */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Zweiter Kontakt (optional)</h3>
        
        <div className="space-y-4">
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
              defaultValue={defaultValues?.contact_person2 || ''}
            />
            {errors.contact_person2 && (
              <p className="mt-1 text-sm text-red-600">{errors.contact_person2.message}</p>
            )}
          </div>

          <div>
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
              defaultValue={defaultValues?.contact_phone2 || ''}
            />
            {errors.contact_phone2 && (
              <p className="mt-1 text-sm text-red-600">{errors.contact_phone2.message}</p>
            )}
          </div>

          <div>
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
              defaultValue={defaultValues?.contact_email2 || ''}
            />
            {errors.contact_email2 && (
              <p className="mt-1 text-sm text-red-600">{errors.contact_email2.message}</p>
            )}
          </div>
        </div>
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
  );
}
