import Link from 'next/link';
import { Home, Plus, Search, User } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Home className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">房源展示生成器</span>
            </div>
            
            <div className="flex items-center gap-4">
              <Link
                href="/properties/new/user-type"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                创建房源
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            专业的房源展示
            <span className="text-blue-600">生成器</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            为房产中介和个人卖家提供专业的房源展示页面生成服务。
            支持多步骤表单、图片上传、AI描述生成，让您的房源展示更加专业美观。
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/properties/new/user-type"
              className="flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <Plus className="w-6 h-6" />
              立即创建房源
            </Link>
            
            <button className="flex items-center justify-center gap-3 px-8 py-4 border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200">
              <Search className="w-6 h-6" />
              查看示例
            </button>
          </div>
        </div>

        {/* 功能特性 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">多步骤表单</h3>
            <p className="text-gray-600">
              分步骤填写房源信息，包括基本信息、房屋详情、描述文本和图片上传，
              让创建过程更加清晰有序。
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">AI 智能生成</h3>
            <p className="text-gray-600">
              基于房源信息自动生成专业的描述文本，支持图片AI优化，
              让您的房源展示更加吸引人。
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">专业展示</h3>
            <p className="text-gray-600">
              生成美观专业的房源展示页面，支持响应式设计，
              在手机、平板、电脑上都有完美的显示效果。
            </p>
          </div>
        </div>

        {/* 技术栈 */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">技术特性</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold text-lg">N</span>
              </div>
              <div className="text-sm font-medium text-gray-900">Next.js 15</div>
              <div className="text-xs text-gray-500">App Router</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-lg">TS</span>
              </div>
              <div className="text-sm font-medium text-gray-900">TypeScript</div>
              <div className="text-xs text-gray-500">类型安全</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <div className="text-sm font-medium text-gray-900">Tailwind CSS</div>
              <div className="text-xs text-gray-500">原子化CSS</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <div className="text-sm font-medium text-gray-900">React 19</div>
              <div className="text-xs text-gray-500">最新特性</div>
            </div>
          </div>
        </div>
      </div>

      {/* 页脚 */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2024 房源展示生成器. 使用 Next.js + TypeScript + Tailwind CSS 构建.
          </p>
        </div>
      </footer>
    </div>
  );
}
