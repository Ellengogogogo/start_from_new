'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { User, Building2, ArrowLeft, CheckCircle } from 'lucide-react';

export default function UserTypePage() {
  const router = useRouter();

  const handleUserTypeSelect = (userType: 'private' | 'agent') => {
    // Store user type in sessionStorage
    sessionStorage.setItem('userType', userType);
    
    if (userType === 'private') {
      // Go directly to property form
      router.push('/properties/new');
    } else {
      // Go to agent info form
      router.push('/properties/new/agent-info');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
              <Building2 className="w-4 h-4" />
              Schritt 1 von 3
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Benutzertyp auswählen
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Wählen Sie Ihren Benutzertyp, um mit der Erstellung Ihrer Immobilienpräsentation fortzufahren
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-16">
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center font-semibold text-lg shadow-lg">
                1
              </div>
              <span className="ml-3 text-base font-semibold text-blue-600">Benutzertyp</span>
            </div>
            <div className="w-12 h-1 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full"></div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center font-semibold text-lg">
                2
              </div>
              <span className="ml-3 text-base font-medium text-gray-500">Immobiliendaten</span>
            </div>
          </div>
        </div>

        {/* User Type Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Private User Card */}
          <div 
            className="group bg-white rounded-2xl shadow-xl p-10 cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-200 hover:-translate-y-2"
            onClick={() => handleUserTypeSelect('private')}
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <User className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Privatperson
              </h3>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                Direkter Zugang zum Immobilienformular ohne zusätzliche Unternehmensinformationen
              </p>
              <div className="text-sm text-gray-500 bg-gray-50 rounded-lg px-4 py-2">
                Ideal für private Vermieter oder Käufer
              </div>
            </div>
            
            {/* Hover indicator */}
            <div className="mt-6 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="inline-flex items-center gap-2 text-blue-600 font-medium">
                <span>Auswählen</span>
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Real Estate Agent Card */}
          <div 
            className="group bg-white rounded-2xl shadow-xl p-10 cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-green-200 hover:-translate-y-2"
            onClick={() => handleUserTypeSelect('agent')}
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Building2 className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Immobilienmakler
              </h3>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                Professioneller Zugang mit Unternehmensinformationen und Logo-Upload
              </p>
              <div className="text-sm text-gray-500 bg-gray-50 rounded-lg px-4 py-2">
                Ideal für Immobilienunternehmen und Maklerbüros
              </div>
            </div>
            
            {/* Hover indicator */}
            <div className="mt-6 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="inline-flex items-center gap-2 text-green-600 font-medium">
                <span>Auswählen</span>
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors font-medium group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
            Zurück zur Startseite
          </button>
        </div>
      </div>
    </div>
  );
}
