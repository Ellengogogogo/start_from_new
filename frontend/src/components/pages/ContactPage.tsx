import React, { useState } from 'react';

export interface Contact {
  name: string;
  phone: string;
  email: string;
  avatar: string;
}

export interface AgentInfo {
  companyLogo?: string;
  responsiblePerson: string;
  address: string;
  website?: string;
  phone: string;
  userType: string;
}

export interface ContactPageProps {
  contacts?: Contact[];
  agentInfo?: AgentInfo;
  propertyName?: string;
  pageNumber?: string;
  backgroundColor?: 'white' | 'gradient' | 'gray';
  className?: string;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  contacts,
  agentInfo,
  propertyName,
  pageNumber = '12 / 12',
  backgroundColor = 'white',
  className = ''
}) => {
  const [logoError, setLogoError] = useState(false);

  // 背景样式配置
  const backgroundClasses = {
    white: 'bg-white',
    gradient: 'bg-gradient-to-br from-gray-50 to-gray-100',
    gray: 'bg-gray-100'
  };

  // 默认联系人信息
  const defaultContacts: Contact[] = [
    {
      name: 'Herr Zhang',
      phone: '+86 138 0013 8000',
      email: 'zhang@example.com',
      avatar: '/placeholder-avatar.jpg'
    },
    {
      name: 'Frau Li',
      phone: '+86 139 0013 8001',
      email: 'li@example.com',
      avatar: '/placeholder-avatar.jpg'
    }
  ];

  const displayContacts = contacts || defaultContacts;

  const getFullImageUrl = (url: string): string => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    return `${baseUrl}${url}`;
  };

  return (
    <div className={`contact-page w-full h-screen relative overflow-hidden ${backgroundClasses[backgroundColor]} ${className}`}>
      
      {/* 背景设计系统 - 低饱和度 */}
      <div className="absolute inset-0 z-0">
        {/* 主背景渐变 */}
        <div className="absolute inset-0 bg-gradient-to-br from-stone-50/40 via-slate-50/30 to-gray-50/40"></div>
        
        {/* 几何装饰元素 - 低饱和度 */}
        <div className="absolute top-20 right-20 w-80 h-80 bg-stone-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-slate-200/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gray-200/10 rounded-full blur-3xl"></div>
        
        {/* 名片风格网格背景 */}
        <div className="absolute inset-0 opacity-[0.02]" 
             style={{
               backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)',
               backgroundSize: '20px 20px'
             }}>
        </div>
      </div>

      {/* 主内容 - 现代名片风格布局 */}
      <div className="relative z-10 h-full flex flex-col px-16 py-20">
        
        {/* 标题区域 - 低饱和度设计 */}
        <div className="mb-16">
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-3 h-3 bg-stone-400 rounded-full animate-pulse"></div>
                <div className="text-sm text-stone-500 uppercase tracking-widest font-medium">
                  Ihr Ansprechpartner
                </div>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[0.9] mb-6">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-stone-600 to-slate-600">
                  Kontakt &
                </span>
                <span className="block text-stone-600 font-light italic">
                  Service
                </span>
              </h1>
              
              {/* 简约装饰线 */}
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 border-2 border-stone-300 rounded-full"></div>
                <div className="h-1 w-20 bg-gradient-to-r from-stone-300 to-slate-300 rounded-full"></div>
                <div className="w-3 h-3 bg-stone-400 rounded-full"></div>
                <div className="h-1 w-12 bg-gradient-to-r from-slate-300 to-gray-300 rounded-full"></div>
              </div>
            </div>
            
            {/* 服务时间装饰 */}
            <div className="text-right bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/50">
              <div className="text-xs text-stone-500 uppercase tracking-wider mb-1">Verfügbar</div>
              <div className="text-lg font-semibold text-stone-700">Mo-Fr 9-18h</div>
              <div className="text-sm text-stone-600">Sa 10-14h</div>
            </div>
          </div>
        </div>

        {/* 代理信息区域 - 如果存在 */}
        {agentInfo && (
          <div className="mb-12">
            <div className="relative bg-white/40 backdrop-blur-sm rounded-3xl border border-white/60 shadow-lg">
              <div className="relative z-10 p-8">
                <div className="flex items-center space-x-6">
                  {/* 公司Logo */}
                  {agentInfo.companyLogo && !logoError && (
                    <div className="w-20 h-20 bg-white rounded-2xl p-2 shadow-md">
                      <img
                        src={getFullImageUrl(agentInfo.companyLogo)}
                        alt="Company logo"
                        className="w-full h-full rounded-xl object-cover"
                        onError={() => setLogoError(true)}
                      />
                    </div>
                  )}
                  
                  {/* 公司信息 */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-stone-800 mb-3">Immobilienmakler</h3>
                    <div className="grid grid-cols-2 gap-4 text-stone-700">
                      <div>
                        <div className="text-xs text-stone-500 uppercase tracking-wider mb-1">Ansprechpartner</div>
                        <div className="font-semibold">{agentInfo.responsiblePerson}</div>
                      </div>
                      <div>
                        <div className="text-xs text-stone-500 uppercase tracking-wider mb-1">Telefon</div>
                        <div className="font-semibold">{agentInfo.phone}</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-xs text-stone-500 uppercase tracking-wider mb-1">Adresse</div>
                        <div className="font-semibold">{agentInfo.address}</div>
                      </div>
                      {agentInfo.website && (
                        <div className="col-span-2">
                          <div className="text-xs text-stone-500 uppercase tracking-wider mb-1">Website</div>
                          <div className="font-semibold text-stone-600">{agentInfo.website}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* 联系人信息 - 简化设计 */}
        <div className="flex-1 grid grid-cols-2 gap-8 items-center">
          {displayContacts.map((contact, index) => (
            <div key={index} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-stone-300/60 shadow-sm">
              
              {/* 头像和姓名 */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-14 h-14 bg-stone-100 rounded-xl overflow-hidden">
                  <img 
                    src={contact.avatar ? getFullImageUrl(contact.avatar) : `https://source.unsplash.com/100x100/?portrait-${index + 1}`} 
                    alt={contact.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://source.unsplash.com/100x100/?portrait-${index + 1}`;
                    }}
                  />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-stone-800">{contact.name}</h3>
                  <p className="text-stone-600 text-sm">Immobilienberater</p>
                </div>
              </div>
              
              {/* 联系方式 */}
              <div className="space-y-2">
                {/* 电话 */}
                <div className="flex items-center space-x-3 text-stone-700">
                  <div className="w-6 h-6 bg-stone-200 rounded-lg flex items-center justify-center">
                    <svg className="w-3 h-3 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span className="text-sm">{contact.phone}</span>
                </div>
                
                {/* 邮箱 */}
                <div className="flex items-center space-x-3 text-stone-700">
                  <div className="w-6 h-6 bg-stone-200 rounded-lg flex items-center justify-center">
                    <svg className="w-3 h-3 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-sm break-all">{contact.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


    </div>
  );
};
