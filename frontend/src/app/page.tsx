import Link from 'next/link';
import { Home, Plus, Search, User, Building2, MapPin, Euro } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">Immobilien Exposé Generator</span>
            </div>
            
            <div className="flex items-center gap-4">
              <Link
                href="/properties/new/user-type"
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5" />
                Exposé erstellen
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-6">
              <Building2 className="w-4 h-4" />
              Professionelles Exposé
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Professioneller
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Immobilien Exposé
            </span>
            Generator
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed">
            Erstellen Sie beeindruckende Exposés mit unserem professionellen Generator. 
            Perfekt für Makler und private Verkäufer - mit mehrstufigen Formularen, KI-gestützter Beschreibung 
            und professionellem Design.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
            <Link
              href="/properties/new/user-type"
              className="group flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xl font-semibold rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
            >
              <Plus className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" />
              Jetzt Exposé erstellen
            </Link>
            
            <button className="flex items-center justify-center gap-3 px-10 py-5 border-2 border-gray-200 text-gray-700 text-xl font-semibold rounded-2xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 hover:scale-105 shadow-lg">
              <Search className="w-7 h-7" />
              Beispiele ansehen
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="group bg-white rounded-2xl shadow-xl p-10 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
              <Plus className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Mehrstufige Formulare</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Strukturierte Eingabe von Immobiliendaten in logischen Schritten - von Grundinformationen 
              bis zu Bildern und Kontaktdaten. Übersichtlich und benutzerfreundlich.
            </p>
          </div>
          
          <div className="group bg-white rounded-2xl shadow-xl p-10 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
            <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
              <Search className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">KI-gestützte Generierung</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Automatische Erstellung professioneller Immobilienbeschreibungen basierend auf Ihren Daten. 
              Mit Bildoptimierung für maximale Wirkung.
            </p>
          </div>
          
          <div className="group bg-white rounded-2xl shadow-xl p-10 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
              <User className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Professionelle Präsentation</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Erstellen Sie beeindruckende Exposés mit modernem Design. Vollständig responsiv für 
              alle Geräte - vom Smartphone bis zum Desktop.
            </p>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Technologie</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-blue-600 font-bold text-2xl">N</span>
              </div>
              <div className="text-lg font-semibold text-gray-900">Next.js 15</div>
              <div className="text-sm text-gray-500">App Router</div>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-2xl">TS</span>
              </div>
              <div className="text-lg font-semibold text-gray-900">TypeScript</div>
              <div className="text-sm text-gray-500">Typsicherheit</div>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-2xl">T</span>
              </div>
              <div className="text-lg font-semibold text-gray-900">Tailwind CSS</div>
              <div className="text-sm text-gray-500">Utility-First CSS</div>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-2xl">R</span>
              </div>
              <div className="text-lg font-semibold text-gray-900">React 19</div>
              <div className="text-sm text-gray-500">Neueste Features</div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">1000+</div>
            <div className="text-gray-600">Erstellte Exposés</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">500+</div>
            <div className="text-gray-600">Zufriedene Kunden</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">24/7</div>
            <div className="text-gray-600">Verfügbarkeit</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">Immobilien Exposé Generator</span>
              </div>
              <p className="text-gray-400">
                Professionelle Immobilienpräsentationen einfach und schnell erstellen.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Funktionen</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Mehrstufige Formulare</li>
                <li>KI-gestützte Beschreibungen</li>
                <li>Bildoptimierung</li>
                <li>Responsive Design</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Unterstützung</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Dokumentation</li>
                <li>Kontakt</li>
                <li>FAQ</li>
                <li>Updates</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Rechtliches</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Datenschutz</li>
                <li>AGB</li>
                <li>Impressum</li>
                <li>Cookie-Richtlinie</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Immobilien Exposé Generator. Entwickelt mit Next.js + TypeScript + Tailwind CSS.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
