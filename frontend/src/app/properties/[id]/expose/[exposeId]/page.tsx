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
import { getExposeStatus, downloadPDF, getExposePreview, getCachedPropertyData } from '@/services/api';
import { Expose_PPT_Classic, ExposePPTData } from '@/components/templates/Expose_PPT_Classic';

export default function ExposeGenerationPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;
  const exposeId = params.exposeId as string;
  
  const [exposeData, setExposeData] = useState<ExposeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 删除 previewData，直接使用 exposeData

  // 转换数据格式以适配 Expose_PPT_Classic 组件
  const transformPreviewDataForPPT = (data: ExposeData): ExposePPTData => {
    if (!data) {
      // 如果没有数据，返回空的默认对象
      return {
        propertyName: 'Keine Daten verfügbar',
        title: 'Keine Daten verfügbar',
        address: 'Keine Adresse verfügbar',
        city: 'Keine Stadt verfügbar',
        plz: 'Keine PLZ verfügbar',
        agendaItems: [],
        keyFacts: {},
        description: 'Keine Beschreibung verfügbar',
        locationDescription: '',
        images: [],
        locationText: '',
        locationImage: '',
        floorPlanDetails: [],
        contacts: [],
        agentInfo: undefined
      };
    }
      
    return {
      propertyName: data.title || 'Immobilienpräsentation',
      title: data.title || 'Immobilienpräsentation',
      address: data.address || 'Adresse nicht verfügbar',
      city: data.city || 'Stadt nicht verfügbar',
      plz: data.plz || 'PLZ nicht verfügbar',
      price: data.price || 0, // 添加价格字段
      agendaItems: [
        'Immobilienübersicht',
        'Eckdaten',
        'Objektbeschreibung',
        'Lagebeschreibung',
        'Wohnzimmer',
        'Küche',
        'Schlafzimmer & Arbeitszimmer',
        'Bad',
        'Balkon & Draußen',
        'Grundriss',
        'Kontaktinformationen'
      ],
      keyFacts: {
        baujahr: data.yearBuilt?.toString() || 'N/A',
        wohnflaeche: data.area ? `${data.area} m²` : 'N/A',
        zimmer: data.rooms?.toString() || 'N/A',
        schlafzimmer: data.bedrooms?.toString() || 'N/A',
        badezimmer: data.bathrooms?.toString() || 'N/A',
        heizungssystem: data.heating_system || 'N/A',
        energieklasse: data.energy_certificate || 'N/A',
        energietraeger: data.energy_source || 'N/A',
        parkplatz: data.parking || 'N/A',
        renovierungsqualitaet: data.renovation_quality || 'N/A',
        bodenbelag: data.floor_type || 'N/A',
        grundstuecksgroesse: data.grundstuecksgroesse ? `${data.grundstuecksgroesse} m²` : 'N/A',
        balkon_garten: data.balkon_garten || 'N/A',
        energieverbrauch: data.energieverbrauch ? `${data.energieverbrauch} kWh/m²` : 'N/A',
        energieausweis_typ: data.energieausweis_typ || 'N/A',
        energieausweis_gueltig_bis: data.energieausweis_gueltig_bis || 'N/A',
        einbaukueche: data.einbaukueche || 'N/A',
        city: data.city || 'Berlin',
        plz: data.plz || '10115'
      },
      description: data.description || 'Keine Beschreibung verfügbar',
      locationDescription: data.locationDescription || '',
      images: (data.images || []).map((img, index: number) => ({
        id: img.id || `img_${index}`,
        url: img.url,
        category: img.category || 'wohnzimmer',
        createdAt: img.createdAt || ''
      })),
      locationText: data.locationDescription || '',
      locationImage: data.images?.[0]?.url || '',
      floorPlanDetails: [
        data.rooms ? `${data.rooms} Zimmer` : 'Zimmeranzahl nicht verfügbar',
        data.bathrooms ? `${data.bathrooms} Badezimmer` : 'Badezimmeranzahl nicht verfügbar',
        'Weitere Details folgen'
      ],
      contacts: [
        {
          name: data.contact_person || 'Kontaktperson nicht verfügbar',
          phone: data.contact_phone || 'Telefon nicht verfügbar',
          email: data.contact_email || 'E-Mail nicht verfügbar',
          avatar: ''
        },
        ...(data.contact_person2 ? [{
          name: data.contact_person2,
          phone: data.contact_phone2 || '',
          email: data.contact_email2 || '',
          avatar: ''
        }] : [])
      ].filter(contact => contact.name !== 'Kontaktperson nicht verfügbar'),
      agentInfo: undefined
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
          property_type: 'N/A',
          title: 'Immobilienpräsentation',
          city: 'Berlin',
          plz: '10115',
          address: 'Adresse nicht verfügbar',
          price: 0,
          rooms: 0,
          area: 0,
          yearBuilt: 0,
          bedrooms: 0,
          bathrooms: 0,
          heating_system: 'N/A',
          energy_source: 'N/A',
          energy_certificate: 'N/A',
          parking: 'N/A',
          renovation_quality: 'N/A',
          floor_type: 'N/A',
          contact_person: 'N/A',
          contact_phone: 'N/A',
          contact_email: 'N/A',
          completedAt: undefined,
          pdfUrl: undefined,
          description: '',
          suggested_description: '',
          suggested_location_description: '',
          locationDescription: '',
          images: []
        });

        if (status.status === 'completed') {
          const preview = await getExposePreview(exposeId);
          // 获取缓存的房源数据以获取 city 和 plz
          const cachedPropertyData = await getCachedPropertyData(propertyId);
          // 更新 exposeData 包含所有必要字段
          setExposeData(prev => ({
            ...prev!,
            status: 'completed',
            progress: 100,
            completedAt: new Date().toISOString(),
            city: cachedPropertyData.city || 'Berlin',
            plz: cachedPropertyData.plz || '10115',
            property_type: cachedPropertyData.property_type || 'N/A',
            title: preview.title || 'Immobilienpräsentation',
            address: preview.address || 'Adresse nicht verfügbar',
            price: preview.price || 0,
            rooms: preview.rooms || 0,
            area: preview.area || 0,
            yearBuilt: preview.yearBuilt || 0,
            bedrooms: preview.bedrooms || 0,
            bathrooms: preview.bathrooms || 0,
            heating_system: preview.heating_system || 'N/A',
            energy_source: preview.energy_source || 'N/A',
            energy_certificate: preview.energy_certificate || 'N/A',
            parking: preview.parking || 'N/A',
            renovation_quality: preview.renovation_quality || 'N/A',
            floor_type: preview.floor_type || 'N/A',
            contact_person: preview.contact_person || 'N/A',
            contact_phone: preview.contact_phone || 'N/A',
            contact_email: preview.contact_email || 'N/A',
            contact_person2: preview.contact_person2,
            contact_phone2: preview.contact_phone2,
            contact_email2: preview.contact_email2,
            description: preview.description || cachedPropertyData.description || '',
            suggested_description: cachedPropertyData.suggested_description || '',
            suggested_location_description: cachedPropertyData.suggested_location_description || '',
            grundstuecksgroesse: (preview as any).grundstuecksgroesse,
            einbaukueche: (preview as any).einbaukueche,
            energieverbrauch: (preview as any).energieverbrauch,
            energieausweis_typ: (preview as any).energieausweis_typ,
            energieausweis_gueltig_bis: (preview as any).energieausweis_gueltig_bis,
            floor: (preview as any).floor,
            balkon_garten: (preview as any).balkon_garten,
            locationDescription: (preview as any).locationDescription || cachedPropertyData.locationDescription || '',
            images: preview.images ? preview.images.map((img: any) => ({
              id: img.id || `img_${Date.now()}`,
              url: img.url,
              category: img.category || 'wohnzimmer',
              createdAt: img.createdAt || new Date().toISOString()
            })) : []
          }));
        }
      } catch (err) {
        console.error('Statusabfrage fehlgeschlagen:', err);
        setError('Statusabfrage fehlgeschlagen');
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
            // 获取缓存的房源数据以获取 city 和 plz
            const cachedPropertyData = await getCachedPropertyData(propertyId);
            // 更新 exposeData 包含所有必要字段
            setExposeData(prev => ({
              ...prev!,
              status: 'completed',
              progress: 100,
              completedAt: new Date().toISOString(),
              city: cachedPropertyData.city || 'Berlin',
              plz: cachedPropertyData.plz || '10115',
              title: preview.title || 'Immobilienpräsentation',
              address: preview.address || 'Adresse nicht verfügbar',
              price: preview.price || 0,
              rooms: preview.rooms || 0,
              area: preview.area || 0,
              yearBuilt: preview.yearBuilt || 0,
              bedrooms: preview.bedrooms || 0,
              bathrooms: preview.bathrooms || 0,
              heating_system: preview.heating_system || 'N/A',
              energy_source: preview.energy_source || 'N/A',
              energy_certificate: preview.energy_certificate || 'N/A',
              parking: preview.parking || 'N/A',
              renovation_quality: preview.renovation_quality || 'N/A',
              floor_type: preview.floor_type || 'N/A',
              contact_person: preview.contact_person || 'N/A',
              contact_phone: preview.contact_phone || 'N/A',
              contact_email: preview.contact_email || 'N/A',
                          contact_person2: preview.contact_person2,
            contact_phone2: preview.contact_phone2,
            contact_email2: preview.contact_email2,
            description: preview.description || cachedPropertyData.description || '',
            suggested_description: cachedPropertyData.suggested_description || '',
            suggested_location_description: cachedPropertyData.suggested_location_description || '',
            grundstuecksgroesse: (preview as any).grundstuecksgroesse,
            einbaukueche: (preview as any).einbaukueche,
            energieverbrauch: (preview as any).energieverbrauch,
            energieausweis_typ: (preview as any).energieausweis_typ,
            energieausweis_gueltig_bis: (preview as any).energieausweis_gueltig_bis,
            floor: (preview as any).floor,
            balkon_garten: (preview as any).balkon_garten,
            locationDescription: (preview as any).locationDescription || cachedPropertyData.locationDescription || '',
              images: preview.images ? preview.images.map((img: any) => ({
                id: img.id || `img_${Date.now()}`,
                url: img.url,
                category: img.category || 'wohnzimmer',
                createdAt: img.createdAt || new Date().toISOString()
              })) : []
            }));
          }
        } catch (err) {
          console.error('Statusprüfung fehlgeschlagen:', err);
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
      console.error('Download fehlgeschlagen:', error);
      alert('Download fehlgeschlagen, bitte versuchen Sie es erneut');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusIcon = (status: string) => {
    const statusConfig = {
      completed: { icon: CheckCircle, color: 'text-green-500', animate: false },
      processing: { icon: Clock, color: 'text-blue-500', animate: true },
      pending: { icon: Clock, color: 'text-yellow-500', animate: false },
      failed: { icon: AlertCircle, color: 'text-red-500', animate: false }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const IconComponent = config.icon;
    
    return (
      <IconComponent 
        className={`w-8 h-8 ${config.color} ${config.animate ? 'animate-spin' : ''}`} 
      />
    );
  };

  const getStatusText = (status: string) => {
    const statusTexts = {
      completed: 'Generierung abgeschlossen',
      processing: 'Wird generiert...',
      pending: 'Wartet auf Verarbeitung',
      failed: 'Generierung fehlgeschlagen'
    };
    
    return statusTexts[status as keyof typeof statusTexts] || 'Unbekannter Status';
  };

  const getStatusColor = (status: string) => {
    const statusColors = {
      completed: 'text-green-600',
      processing: 'text-blue-600',
      pending: 'text-yellow-600',
      failed: 'text-red-600'
    };
    
    return statusColors[status as keyof typeof statusColors] || 'text-gray-600';
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
          <p className="text-gray-600 mb-4">{error || 'Konnte Exposé-Daten nicht laden'}</p>
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
              <div className="flex items-center justify-center mt-6">
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  PDF herunterladen
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
        {exposeData.status === 'completed' && exposeData.title && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Eye className="w-6 h-6 text-blue-600" />
                    Exposé Vorschau
                  </h2>
                </div>
              </div>
            </div>
            
            {/* 使用 PPT 模板展示预览 */}
            <div className="bg-gray-50">
              <Expose_PPT_Classic
                data={transformPreviewDataForPPT(exposeData)}
                showNavigation={false}
                onPrint={handlePrint}
                onShare={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: exposeData.title || 'Immobilienpräsentation',
                      text: 'Siehe diese Immobilienpräsentation',
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link kopiert');
                  }
                }}
                onContact={() => {
                  alert('Kontaktfunktion - Verwenden Sie die Kontaktinformationen in der Präsentation');
                }}
              />
            </div>
          </div>
        )}

        {/* 调试信息 */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Debug-Informationen</h3>
          <pre className="text-xs text-gray-600 overflow-auto">
            {JSON.stringify({ propertyId, exposeId, exposeData }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
