'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Download, 
  Eye, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Share2,
  Printer
} from 'lucide-react';
import { ExposeData } from '@/types/property';
import { getExposeStatus, downloadPDF, getExposePreview } from '@/services/api';
import { Expose_A4_Classic, ExposeData as ExposeTemplateData } from '@/components/templates/Expose_A4_Classic';
import { Expose_PPT_Classic, ExposePPTData } from '@/components/templates/Expose_PPT_Classic';

export default function ExposeGenerationPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;
  const exposeId = params.exposeId as string;
  
  const [exposeData, setExposeData] = useState<ExposeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<'a4' | 'ppt'>('a4');
  const [previewData, setPreviewData] = useState<{
    title?: string;
    address?: string;
    price?: number;
    rooms?: number;
    area?: number;
    yearBuilt?: number;
    description?: string;
    images?: Array<{
      url: string;
      isPrimary: boolean;
    }>;
  } | null>(null);

  // 转换数据格式以适配 Expose_A4_Classic 组件
  const transformPreviewDataForExpose = (data: ExposeData['previewData']): ExposeTemplateData => {
    if (!data) {
      // 返回默认数据
      return {
        title: 'Professionelle Immobilienpräsentation',
        address: 'Adressinformationen',
        price: 0,
        priceUnit: 'Tsd.',
        tags: ['Ausstattung', 'Verkehrsgünstige Lage', 'Schlafzimmer'],
        rooms: 0,
        area: 0,
        areaUnit: 'm²',
        yearBuilt: 0,
        floor: '15',
        totalFloors: 28,
        orientation: 'Nord-Süd-Orientierung',
        renovation: 'Ausstattung',
        description: 'Keine Beschreibung verfügbar',
        images: [],
        contact: {
          name: 'Herr Zhang',
          title: 'Erfolgreicher Immobilienberater',
          avatar: 'https://source.unsplash.com/100x100/?portrait',
          phone: '138-0013-8000',
          email: 'zhang@example.com',
          company: 'Guomao Immobilienmakler GmbH',
          license: 'B-00123456789'
        },
        coordinates: {
          lat: 39.9042,
          lng: 116.4074
        }
      };
    }
    
    return {
      title: data.title || 'Professionelle Immobilienpräsentation',
      address: data.address || 'Adressinformationen',
      price: data.price || 0,
      priceUnit: 'Tsd.',
      tags: ['Ausstattung', 'Verkehrsgünstige Lage', 'Schlafzimmer'],
      rooms: data.rooms || 0,
      area: data.area || 0,
      areaUnit: 'm²',
      yearBuilt: data.yearBuilt || 0,
      floor: '15',
      totalFloors: 28,
      orientation: 'Nord-Süd-Orientierung',
      renovation: 'Ausstattung',
      description: data.description || 'Keine Beschreibung verfügbar',
      images: (data.images || []).map((img, index: number) => ({
        id: `img_${index}`,
        url: img.url,
        alt: `Immobilienbild ${index + 1}`
      })),
      contact: {
        name: data.contact_person || 'Herr Zhang',
        title: 'Erfolgreicher Immobilienberater',
        avatar: 'https://source.unsplash.com/100x100/?portrait',
        phone: data.contact_phone || '138-0013-8000',
        email: data.contact_email || 'zhang@example.com',
        company: 'Guomao Immobilienmakler GmbH',
        license: 'B-00123456789'
      },
      coordinates: {
        lat: 39.9042,
        lng: 116.4074
      }
    };
  };

  // 转换数据格式以适配 Expose_PPT_Classic 组件
  const transformPreviewDataForPPT = (data: ExposeData['previewData']): ExposePPTData => {
    if (!data) {
      // 返回默认数据
      return {
        propertyName: 'Professionelle Immobilienpräsentation',
        title: 'Professionelle Immobilienpräsentation',
        address: 'Adressinformationen',
        agendaItems: [
          'Immobilienübersicht',
          'Eckdaten',
          'Immobiliendetails',
          'Bildergalerie',
          'Lagebeschreibung',
          'Grundriss',
          'Kontaktinformationen'
        ],
        keyFacts: {
          baujahr: '2020',
          wohnflaeche: '120 m²',
          zimmer: '5',
          schlafzimmer: '3',
          badezimmer: '2',
          heizungssystem: 'Fußbodenheizung',
          energieklasse: 'A'
        },
        description: 'Dies ist eine hochwertige Immobilie in einer erstklassigen Lage mit ausgezeichneter Verkehrsanbindung. Die Wohnung ist durchdacht gestaltet, bietet viel Tageslicht und verfügt über eine vollständige Ausstattung.',
        images: [],
        locationText: 'Verkehrsgünstige Lage',
        locationImage: 'https://source.unsplash.com/800x600/?city-map',
        floorPlanImage: 'https://source.unsplash.com/800x600/?floor-plan',
        floorPlanDetails: [
          '3 Schlafzimmer, Hauptschlafzimmer mit eigenem Bad',
          '2 Badezimmer, Trocken- und Nassbereich getrennt',
          'Offene Küche, Essbereich integriert',
          'Wohnzimmer geräumig, viel Tageslicht',
          'Balkon verbindet Wohnzimmer und Hauptschlafzimmer',
          'Abstellraum und Kleiderschrank vorhanden'
        ],
        contacts: [
          {
            name: 'Herr Zhang',
            phone: '138-0013-8000',
            email: 'zhang@example.com',
            avatar: 'https://source.unsplash.com/100x100/?portrait-1'
          },
          {
            name: 'Frau Li',
            phone: '139-0013-8001',
            email: 'li@example.com',
            avatar: 'https://source.unsplash.com/100x100/?portrait-2'
          }
        ],
        agentInfo: undefined
      };
    }
    
    return {
      propertyName: data.title || 'Professionelle Immobilienpräsentation',
      title: data.title || 'Professionelle Immobilienpräsentation',
      address: data.address || 'Adressinformationen',
      agendaItems: [
        'Immobilienübersicht',
        'Eckdaten',
        'Immobiliendetails',
        'Bildergalerie',
        'Lagebeschreibung',
        'Grundriss',
        'Kontaktinformationen'
      ],
      keyFacts: {
        baujahr: data.yearBuilt?.toString() || '2020',
        wohnflaeche: `${data.area || 120} m²`,
        zimmer: data.rooms?.toString() || '5',
        schlafzimmer: data.bedrooms?.toString() || '3',
        badezimmer: data.bathrooms?.toString() || '2',
        heizungssystem: data.heating_system || 'Fußbodenheizung',
        energieklasse: data.energy_certificate || 'A',
        energietraeger: data.energy_source || 'Erdgas',
        parkplatz: data.parking || 'Garage',
        renovierungsqualitaet: data.renovation_quality || 'Hochwertig',
        bodenbelag: data.floor_type || 'Parkett'
      },
      description: data.description || 'Dies ist eine hochwertige Immobilie in einer erstklassigen Lage mit ausgezeichneter Verkehrsanbindung. Die Wohnung ist durchdacht gestaltet, bietet viel Tageslicht und verfügt über eine vollständige Ausstattung.',
      images: (data.images || []).map((img, index: number) => ({
        id: `img_${index}`,
        url: img.url,
        alt: `Immobilienbild ${index + 1}`
      })),
      locationText: 'Verkehrsgünstige Lage',
      locationImage: data.images?.[0]?.url || 'https://source.unsplash.com/800x600/?city-map',
      floorPlanImage: data.images?.[1]?.url || 'https://source.unsplash.com/800x600/?floor-plan',
      floorPlanDetails: [
        `${data.rooms || 3} Schlafzimmer, Hauptschlafzimmer mit eigenem Bad`,
        `${Math.max(1, Math.floor((data.rooms || 3) * 0.4))} Badezimmer, Trocken- und Nassbereich getrennt`,
        'Offene Küche, Essbereich integriert',
        'Wohnzimmer geräumig, viel Tageslicht',
        'Balkon verbindet Wohnzimmer und Hauptschlafzimmer',
        'Abstellraum und Kleiderschrank vorhanden'
      ],
      contacts: [
        {
          name: data.contact_person || 'Herr Zhang',
          phone: data.contact_phone || '138-0013-8000',
          email: data.contact_email || 'zhang@example.com',
          avatar: 'https://source.unsplash.com/100x100/?portrait-1'
        },
        {
          name: data.contact_person2 || 'Frau Li',
          phone: data.contact_phone2 || '139-0013-8001',
          email: data.contact_email2 || 'li@example.com',
          avatar: 'https://source.unsplash.com/100x100/?portrait-2'
        }
      ]
    };
  };

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await getExposeStatus(exposeId);
        setExposeData({
          id: exposeId,
          propertyId,
          status: status.status as 'pending' | 'processing' | 'completed' | 'failed',
          progress: status.progress,
          createdAt: new Date().toISOString(),
        });

        if (status.status === 'completed') {
          const preview = await getExposePreview(exposeId);
          setPreviewData(preview);
        }
      } catch (err) {
        console.error('获取状态失败:', err);
        setError('获取生成状态失败');
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();

    const interval = setInterval(async () => {
      if (exposeData?.status === 'processing' || exposeData?.status === 'pending') {
        try {
          const status = await getExposeStatus(exposeId);
          setExposeData(prev => prev ? { 
            ...prev, 
            status: status.status as 'pending' | 'processing' | 'completed' | 'failed',
            progress: status.progress 
          } : null);
          
          if (status.status === 'completed') {
            clearInterval(interval);
            const preview = await getExposePreview(exposeId);
            setPreviewData(preview);
          }
        } catch (err) {
          console.error('检查状态失败:', err);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [exposeId, propertyId, exposeData?.status]);

  const handleDownloadPDF = async () => {
    try {
      const blob = await downloadPDF(exposeId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Immobilienpräsentation_${propertyId}_${exposeId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('下载失败:', error);
      alert('下载失败，请重试');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'processing':
        return <Clock className="w-8 h-8 text-blue-500 animate-spin" />;
      case 'pending':
        return <Clock className="w-8 h-8 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="w-8 h-8 text-red-500" />;
      default:
        return <Clock className="w-8 h-8 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Generierung abgeschlossen';
      case 'processing':
        return 'Wird generiert...';
      case 'pending':
        return 'Wartet auf Verarbeitung';
      case 'failed':
        return 'Generierung fehlgeschlagen';
      default:
        return 'Unbekannter Status';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'processing':
        return 'text-blue-600';
      case 'pending':
        return 'text-yellow-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Initialisierung...</p>
        </div>
      </div>
    );
  }

  if (error || !exposeData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Ladefehler</h2>
          <p className="text-gray-600 mb-4">{error || 'Konnte Expose-Daten nicht laden'}</p>
          <button
            onClick={() => router.push('/properties/new')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Erneut erstellen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.push('/properties/new')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Zurück zur Erstellung
            </button>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                Expose ID: {exposeId}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 状态显示 */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center">
            {getStatusIcon(exposeData.status)}
            <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-2">
              Professionelle Exposé generieren
            </h1>
            <p className={`text-xl font-medium ${getStatusColor(exposeData.status)} mb-6`}>
              {getStatusText(exposeData.status)}
            </p>
            
            {exposeData.status === 'processing' && exposeData.progress && (
              <div className="w-full max-w-md mx-auto">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Generierungsfortschritt</span>
                  <span className="text-blue-600 font-medium">{exposeData.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${exposeData.progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {exposeData.status === 'completed' && (
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  PDF herunterladen
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Printer className="w-5 h-5" />
                  Drucken
                </button>
                <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Share2 className="w-5 h-5" />
                  Teilen
                </button>
              </div>
            )}

            {exposeData.status === 'failed' && (
              <div className="mt-6">
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Erneut generieren
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Expose预览 */}
        {exposeData.status === 'completed' && previewData && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Eye className="w-6 h-6 text-blue-600" />
                    Professionelle Exposé Vorschau
                  </h2>
                  <p className="text-gray-600 mt-2">Dies ist Ihre professionelle Exposé Vorschau</p>
                </div>
                
                {/* 模板选择 */}
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700">Vorlage auswählen:</span>
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setSelectedTemplate('a4')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        selectedTemplate === 'a4'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      A4-Klassisch
                    </button>
                    <button
                      onClick={() => setSelectedTemplate('ppt')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        selectedTemplate === 'ppt'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-blue-600 shadow-sm'
                      }`}
                    >
                      PowerPoint-Stil
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 使用选择的模板展示预览 */}
            <div className="bg-gray-50">
              {selectedTemplate === 'a4' ? (
                <Expose_A4_Classic
                  data={transformPreviewDataForExpose(previewData)}
                  showPrintButton={false}
                  onPrint={handlePrint}
                  onShare={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: previewData.title || 'Immobilienpräsentation',
                        text: 'Siehe diese beeindruckende Immobilienpräsentation',
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link in die Zwischenablage kopiert');
                    }
                  }}
                  onContact={() => {
                    alert('Kontaktfunktion: Anruf 138-0013-8000');
                  }}
                />
              ) : (
                <Expose_PPT_Classic
                  data={transformPreviewDataForPPT(previewData)}
                  showNavigation={false}
                  onPrint={handlePrint}
                  onShare={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: previewData.title || 'Immobilienpräsentation',
                        text: 'Siehe diese beeindruckende Immobilienpräsentation',
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link in die Zwischenablage kopiert');
                    }
                  }}
                  onContact={() => {
                    alert('Kontaktfunktion: Anruf 138-0013-8000');
                  }}
                />
              )}
            </div>
          </div>
        )}

        {/* 调试信息 */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Debug-Informationen</h3>
          <pre className="text-xs text-gray-600 overflow-auto">
            {JSON.stringify({ propertyId, exposeId, exposeData, previewData }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
