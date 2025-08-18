'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { User, Building2 } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            请选择用户类型
          </h1>
          <p className="text-lg text-gray-600">
            选择您的用户类型以继续创建房源信息
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                1
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600">选择用户类型</span>
            </div>
            <div className="w-8 h-1 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center font-semibold">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-gray-500">填写房源信息</span>
            </div>
          </div>
        </div>

        {/* User Type Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Private User Card */}
          <div 
            className="bg-white rounded-lg shadow-lg p-8 cursor-pointer hover:shadow-xl transition-shadow duration-300 border-2 border-transparent hover:border-blue-200"
            onClick={() => handleUserTypeSelect('private')}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                私人用户
              </h3>
              <p className="text-gray-600 mb-4">
                个人用户，直接进入房源信息填写
              </p>
              <div className="text-sm text-gray-500">
                适合个人房东或买家
              </div>
            </div>
          </div>

          {/* Real Estate Agent Card */}
          <div 
            className="bg-white rounded-lg shadow-lg p-8 cursor-pointer hover:shadow-xl transition-shadow duration-300 border-2 border-transparent hover:border-blue-200"
            onClick={() => handleUserTypeSelect('agent')}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                房地产中介
              </h3>
              <p className="text-gray-600 mb-4">
                专业中介，需要填写公司信息
              </p>
              <div className="text-sm text-gray-500">
                适合房地产公司或中介机构
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => router.back()}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← 返回
          </button>
        </div>
      </div>
    </div>
  );
}
