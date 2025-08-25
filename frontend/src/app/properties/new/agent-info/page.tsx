'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, Upload, ArrowRight, ArrowLeft, CheckCircle, Globe, Phone, MapPin, User } from 'lucide-react';

// Agent info schema
const agentInfoSchema = z.object({
  companyLogo: z.any().optional(),
  address: z.string().min(1, 'Adresse ist erforderlich').max(200, 'Adresse darf maximal 200 Zeichen haben'),
  website: z.string().url('Bitte geben Sie eine gültige URL ein').optional().or(z.literal('')),
  phone: z.string().min(1, 'Telefonnummer ist erforderlich').max(20, 'Telefonnummer darf maximal 20 Zeichen haben'),
});

type AgentInfoFormData = z.infer<typeof agentInfoSchema>;

export default function AgentInfoPage() {
  const router = useRouter();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<AgentInfoFormData>({
    resolver: zodResolver(agentInfoSchema),
  });

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue('companyLogo', file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: AgentInfoFormData) => {
    setIsSubmitting(true);
    try {
      // Store agent info in sessionStorage for later use
      const agentInfo = {
        ...data,
        companyLogo: logoPreview, // Store the preview URL
        userType: 'agent' as const,
      };
      sessionStorage.setItem('agentInfo', JSON.stringify(agentInfo));
      
      // Navigate to property form
      router.push('/properties/new');
    } catch (error) {
      console.error('Error saving agent info:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium">
              <Building2 className="w-4 h-4" />
              Schritt 2 von 3
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Unternehmensinformationen
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Bitte füllen Sie Ihre Unternehmensdaten aus
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold text-lg shadow-lg">
                <CheckCircle className="w-6 h-6" />
              </div>
              <span className="ml-3 text-base font-medium text-green-600">Benutzertyp</span>
            </div>
            <div className="w-12 h-1 bg-green-600 rounded-full"></div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center font-semibold text-lg shadow-lg">
                2
              </div>
              <span className="ml-3 text-base font-semibold text-blue-600">Unternehmensdaten</span>
            </div>
            <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center font-semibold text-lg">
                3
              </div>
              <span className="ml-3 text-base font-medium text-gray-500">Immobiliendaten</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-10 border border-gray-100">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Company Logo */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                <Building2 className="w-5 h-5 inline mr-2 text-blue-600" />
                Firmenlogo
              </label>
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Firmenlogo Vorschau"
                      className="w-20 h-20 rounded-xl object-cover border-2 border-gray-200 shadow-md"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                      <Building2 className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                    id="company-logo"
                  />
                  <label
                    htmlFor="company-logo"
                    className="cursor-pointer inline-flex items-center px-6 py-3 border border-gray-300 rounded-xl shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:border-blue-300"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Bild auswählen
                  </label>
                  <p className="text-sm text-gray-500 mt-2">
                    Unterstützt JPG, PNG Format, maximal 2MB
                  </p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-lg font-semibold text-gray-900 mb-3">
                <MapPin className="w-5 h-5 inline mr-2 text-blue-600" />
                Firmenadresse <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="address"
                {...register('address')}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                placeholder="Vollständige Firmenadresse eingeben"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-2">{errors.address.message}</p>
              )}
            </div>

            {/* Website */}
            <div>
              <label htmlFor="website" className="block text-lg font-semibold text-gray-900 mb-3">
                <Globe className="w-5 h-5 inline mr-2 text-blue-600" />
                Firmenwebsite
              </label>
              <input
                type="url"
                id="website"
                {...register('website')}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                placeholder="https://example.com"
              />
              {errors.website && (
                <p className="text-red-500 text-sm mt-2">{errors.website.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-lg font-semibold text-gray-900 mb-3">
                <Phone className="w-5 h-5 inline mr-2 text-blue-600" />
                Telefonnummer <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                {...register('phone')}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                placeholder="Telefonnummer eingeben"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-2">{errors.phone.message}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-8">
              <button
                type="button"
                onClick={() => router.push('/properties/new/user-type')}
                className="inline-flex items-center gap-2 px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium hover:shadow-md"
              >
                <ArrowLeft className="w-5 h-5" />
                Zurück
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isSubmitting ? (
                  'Wird gespeichert...'
                ) : (
                  <>
                    Fortfahren
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
