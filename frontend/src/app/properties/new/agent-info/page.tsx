'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, Upload, ArrowRight } from 'lucide-react';

// Agent info schema
const agentInfoSchema = z.object({
  companyLogo: z.any().optional(),
  responsiblePerson: z.string().min(1, '负责人是必填项').max(100, '负责人姓名不能超过100个字符'),
  address: z.string().min(1, '地址是必填项').max(200, '地址不能超过200个字符'),
  website: z.string().url('请输入有效的网址').optional().or(z.literal('')),
  phone: z.string().min(1, '电话是必填项').max(20, '电话号码不能超过20个字符'),
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            房地产中介信息
          </h1>
          <p className="text-lg text-gray-600">
            请填写您的公司信息
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">
                ✓
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">选择用户类型</span>
            </div>
            <div className="w-8 h-1 bg-blue-600"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600">中介信息</span>
            </div>
            <div className="w-8 h-1 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center font-semibold">
                3
              </div>
              <span className="ml-2 text-sm font-medium text-gray-500">房源信息</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Company Logo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                公司标志
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Company logo preview"
                      className="w-16 h-16 rounded-lg object-cover border border-gray-300"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                      <Building2 className="w-6 h-6 text-gray-400" />
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
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    选择图片
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    支持 JPG, PNG 格式，最大 2MB
                  </p>
                </div>
              </div>
            </div>

            {/* Responsible Person */}
            <div>
              <label htmlFor="responsiblePerson" className="block text-sm font-medium text-gray-700 mb-2">
                负责人 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="responsiblePerson"
                {...register('responsiblePerson')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="请输入负责人姓名"
              />
              {errors.responsiblePerson && (
                <p className="text-red-500 text-sm mt-1">{errors.responsiblePerson.message}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                公司地址 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="address"
                {...register('address')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="请输入公司地址"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
              )}
            </div>

            {/* Website */}
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                公司网站
              </label>
              <input
                type="url"
                id="website"
                {...register('website')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com"
              />
              {errors.website && (
                <p className="text-red-500 text-sm mt-1">{errors.website.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                联系电话 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                {...register('phone')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="请输入联系电话"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={() => router.push('/properties/new/user-type')}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                返回
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {isSubmitting ? (
                  '保存中...'
                ) : (
                  <>
                    继续
                    <ArrowRight className="w-4 h-4 ml-2" />
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
