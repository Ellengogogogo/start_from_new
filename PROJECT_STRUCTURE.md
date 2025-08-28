# Property Expose Generator - Project Structure

## 📁 项目概览

这是一个专业的房产展示生成器项目，采用现代化的全栈架构，支持AI驱动的房源描述生成和图片优化。

```
start_from_new/
├── frontend/          # Next.js 15 + TypeScript + Tailwind CSS 前端
├── backend/           # FastAPI + Python 后端 API
├── worker/            # Python 后台任务处理
├── infra/             # Docker 和基础设施配置
├── .gitignore         # Git 忽略文件
├── env.example        # 环境变量示例
├── start.bat          # Windows 启动脚本
└── README.md          # 项目说明文档
```

## 🚀 Frontend (Next.js 15 + TypeScript + Tailwind CSS)

### 技术栈
- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS 4
- **状态管理**: React Hook Form + Zod
- **HTTP客户端**: Axios
- **图标**: Lucide React
- **组件架构**: Atomic Design (原子设计)

### 组件架构说明
前端采用 **Atomic Design** 设计系统，将组件按照复杂度和复用性分为四个层次：

- **Atoms (原子)**: 最小的UI组件，如按钮、输入框、标签等
- **Molecules (分子)**: 由原子组成的简单组合，如搜索框、价格标签等  
- **Organisms (有机体)**: 由分子和原子组成的复杂组件，如表单、导航栏等
- **Templates (模板)**: 页面级别的布局结构，如Expose展示模板

这种架构确保了组件的可复用性、一致性和可维护性。

### 目录结构
```
frontend/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── page.tsx                  # 首页
│   │   ├── layout.tsx                # 根布局
│   │   ├── globals.css               # 全局样式
│   │   ├── favicon.ico               # 网站图标
│   │   └── properties/               # 房源相关页面
│   │       ├── new/                  # 创建新房源
│   │       │   ├── page.tsx          # 多步骤表单页面
│   │       │   ├── layout.tsx        # 新房源布局
│   │       │   ├── user-type/        # 用户类型选择
│   │       │   └── agent-info/       # 经纪人信息
│   │       └── [id]/                 # 动态路由
│   │           └── expose/           # Expose生成
│   │               └── [exposeId]/   # 动态expose ID
│   │                   └── page.tsx  # Expose状态和预览页面
│   ├── components/                   # 可复用组件 (Atomic Design)
│   │   ├── atoms/                    # 原子组件
│   │   │   ├── Avatar.tsx            # 头像组件
│   │   │   ├── Badge.tsx             # 徽章组件
│   │   │   ├── Button.tsx            # 按钮组件
│   │   │   ├── Divider.tsx           # 分割线组件
│   │   │   └── Input.tsx             # 输入框组件
│   │   ├── molecules/                # 分子组件
│   │   │   ├── FeatureList.tsx       # 特性列表
│   │   │   ├── ImageGallery.tsx      # 图片画廊
│   │   │   ├── PriceTag.tsx          # 价格标签
│   │   │   └── PropertyCard.tsx      # 房源卡片
│   │   ├── organisms/                # 有机体组件
│   │   │   ├── ContactCard.tsx       # 联系卡片
│   │   │   ├── MapSection.tsx        # 地图区域
│   │   │   ├── ProgressIndicator.tsx # 进度指示器
│   │   │   ├── PropertyForm.tsx # 房源表单主组件
│   │   │   ├── PropertyFormNavigation.tsx # 表单导航
│   │   │   ├── PropertyHeader.tsx    # 房源头部
│   │   │   ├── index.ts              # 导出文件
│   │   │   └── PropertyFormSteps/    # 表单步骤组件
│   │   │       ├── BasicInfoStep.tsx     # 基本信息步骤
│   │   │       ├── ContactInfoStep.tsx   # 联系信息步骤
│   │   │       ├── DescriptionStep.tsx   # 描述步骤
│   │   │       ├── ImageUploadStep.tsx   # 图片上传步骤
│   │   │       ├── PropertyDetailsStep.tsx # 房源详情步骤
│   │   │       └── index.ts              # 步骤导出文件
│   │   └── templates/                # 模板组件
│   │       └── Expose_PPT_Classic.tsx    # 经典PPT风格Expose模板
│   ├── hooks/                        # 自定义Hooks
│   │   ├── useAIGeneration.ts        # AI生成Hook
│   │   ├── useMultiStepForm.ts       # 多步骤表单管理
│   │   ├── usePhotoUpload.ts         # 图片上传管理
│   │   ├── usePropertyForm.ts        # 房源表单管理
│   │   └── index.ts                  # Hooks导出文件
│   ├── lib/                          # 工具库
│   │   ├── utils.ts                  # 通用工具函数
│   │   └── validations.ts            # Zod验证模式
│   ├── services/                     # API服务
│   │   └── api.ts                    # 后端API调用
│   └── types/                        # TypeScript类型定义
│       └── property.ts               # 房源相关类型
├── public/                           # 静态资源
├── package.json                      # 依赖配置
├── package-lock.json                 # 依赖锁定文件
├── next.config.ts                    # Next.js配置
├── next-env.d.ts                     # Next.js类型声明
├── tailwind.config.ts                # Tailwind配置
├── postcss.config.mjs                # PostCSS配置
├── tsconfig.json                     # TypeScript配置
├── eslint.config.mjs                 # ESLint配置
├── env.local                         # 环境变量配置
├── Dockerfile                        # 容器化配置
├── README.md                         # 项目说明
├── README_PREVIEW.md                 # 预览说明
└── PROJECT_STRUCTURE.md              # 前端项目结构说明
```

### 核心功能页面

#### 1. 多步骤房源表单 (`/properties/new`)
- **步骤1**: 基本信息（标题、地址、价格）
- **步骤2**: 房屋详情（房间数、面积、建成年份）
- **步骤3**: 描述文本（支持AI自动生成）
- **步骤4**: 图片上传（多图支持、预览、进度条）
- **用户类型选择**: 支持不同用户角色（买家、卖家、经纪人）
- **经纪人信息**: 经纪人专属信息收集

#### 2. Expose生成状态 (`/properties/[id]/expose/[exposeId]`)
- 实时显示生成进度
- 预览生成的expose
- PDF下载功能
- 打印和分享选项
- 支持多种模板样式（经典PPT风格等）

## 🐍 Backend (FastAPI + Python)

### 技术栈
- **框架**: FastAPI
- **语言**: Python 3.12+
- **异步**: SQLAlchemy Async + asyncpg
- **验证**: Pydantic
- **文档**: OpenAPI/Swagger
- **CORS**: 支持前端跨域请求

### 目录结构
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                       # 主应用入口
│   ├── core/                         # 核心配置
│   │   ├── __init__.py
│   │   ├── config.py                 # 应用配置
│   │   └── database.py               # 数据库连接
│   ├── models/                       # 数据模型
│   ├── routes/                       # 路由管理
│   │   ├── __init__.py
│   │   ├── routers.py                # 主路由配置 ⭐ 重构
│   │   └── endpoints/                # 端点实现 ⭐ 重构
│   │       ├── auth.py               # 认证相关端点
│   │       ├── cache.py              # 缓存管理端点
│   │       ├── expose_generation.py  # Exposé 生成端点
│   │       ├── images.py             # 图片处理端点
│   │       └── properties.py         # 房源管理端点
│   ├── schemas/                      # Pydantic模式
│   │   ├── __init__.py
│   │   ├── auth.py                   # 认证模式
│   │   ├── expose.py                 # Exposé 模式
│   │   ├── image.py                  # 图片模式
│   │   └── property.py               # 房源模式
│   └── services/                     # 业务逻辑服务
│       ├── __init__.py
│       ├── auth_service.py           # 认证服务
│       ├── expose_service.py         # Exposé 服务
│       ├── image_service.py          # 图片服务
│       └── property_service.py       # 房源服务
├── static/                           # 静态文件
│   └── cache/                        # 缓存图片目录
├── requirements.txt                   # Python依赖
├── pyproject.toml                    # Poetry配置
├── Dockerfile                        # 容器化配置
└── test_server.py                    # 测试服务器脚本
```

### 路由架构重构 ⭐ 新增

#### 新的路由组织方式
- **`routers.py`**: 统一管理所有路由，使用 `/api/v1` 前缀
- **`endpoints/`**: 所有端点实现都集中在这个文件夹中
- **模块化设计**: 每个功能模块都有独立的端点文件
- **统一前缀**: 所有 API 都通过 `/api/v1` 访问，便于版本管理

#### 路由结构
```
/api/v1/
├── auth/                    # 认证相关
├── cache/                   # 缓存管理
├── expose_generation/       # Exposé 生成
├── images/                  # 图片管理
└── properties/              # 房源管理
```

### API端点

#### 统一路由结构 (`/api/v1`)
所有 API 端点现在都通过 `/api/v1` 前缀进行组织：

- **认证管理** (`/api/v1/auth`)
- **缓存管理** (`/api/v1/cache`)
- **Exposé 生成** (`/api/v1/expose_generation`)
- **图片管理** (`/api/v1/images`)
- **房源管理** (`/api/v1/properties`)

#### 主要端点
- `POST /api/v1/properties/` - 创建房源
- `GET /api/v1/properties/` - 获取房源列表
- `GET /api/v1/properties/{id}` - 获取特定房源
- `POST /api/v1/cache/property-data` - 缓存房源数据
- `POST /api/v1/cache/property-images/{id}` - 缓存房源图片
- `POST /api/v1/expose_generation/generate/{property_id}` - 开始生成 Exposé
- `GET /api/v1/expose_generation/status/{expose_id}` - 获取生成状态
- `GET /api/v1/expose_generation/preview/{expose_id}` - 获取预览数据

## 🔧 Worker (Python Background Tasks)

### 功能
- 异步处理expose生成任务
- AI驱动的房源描述生成
- 图片优化和处理
- 后台任务队列管理

### 目录结构
```
worker/
├── main.py                           # 主程序入口
├── requirements.txt                   # 依赖配置
└── Dockerfile                        # 容器化配置
```

## 🐳 Infrastructure (Docker)

### 目录结构
```
infra/
├── docker-compose.yml                # 多服务编排
└── init.sql                          # 数据库初始化脚本
```

### 服务配置
- **Frontend**: Next.js 开发服务器 (端口 3000)
- **Backend**: FastAPI 服务器 (端口 8000)
- **Database**: PostgreSQL (端口 5432)
- **Cache**: Redis (端口 6379)
- **Worker**: Python 后台任务处理器

## 🚀 开发环境启动

### 1. 启动后端
```bash
cd backend
.\.venv\Scripts\activate  # Windows
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. 启动前端
```bash
cd frontend
npm install
npm run dev
```

### 3. 访问应用
- **前端**: http://localhost:3000
- **后端 API**: http://localhost:8000
- **API 文档**: http://localhost:8000/docs
- **ReDoc 文档**: http://localhost:8000/redoc

### 4. 新的 API 端点访问
所有 API 现在都通过 `/api/v1` 前缀访问：
- 认证: http://localhost:8000/api/v1/auth/
- 缓存: http://localhost:8000/api/v1/cache/
- Exposé 生成: http://localhost:8000/api/v1/expose_generation/
- 图片: http://localhost:8000/api/v1/images/
- 房源: http://localhost:8000/api/v1/properties/

## 🔑 环境变量

### 前端 (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NODE_ENV=development
```

### 后端 (env.example)
```env
# API配置
API_HOST=0.0.0.0
API_PORT=8000

# 数据库配置
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/property_expose

# Redis配置
REDIS_URL=redis://localhost:6379

# AI服务配置
OPENAI_API_KEY=your_openai_api_key

# 安全配置
SECRET_KEY=your_secret_key
CORS_ORIGINS=["http://localhost:3000"]
```

## 📋 开发状态

### ✅ 已完成
- [x] 项目脚手架搭建
- [x] 前端多步骤表单 (包含用户类型选择和经纪人信息)
- [x] 图片上传和预览
- [x] 后端API路由
- [x] 缓存管理系统
- [x] Expose生成流程
- [x] PDF下载功能
- [x] 响应式UI设计
- [x] 清理冗余代码
- [x] Atomic Design组件架构
- [x] 多步骤表单步骤组件
- [x] Expose模板系统
- [x] 自定义Hooks系统
- [x] 工具库和验证系统

### 🚧 进行中
- [ ] 后端服务器启动问题解决
- [ ] 前后端连接测试

### 📝 待完成
- [ ] AI描述生成集成
- [ ] 图片AI优化
- [ ] 真实PDF生成
- [ ] 数据持久化
- [ ] 生产环境部署

## 🐛 已知问题

1. **后端启动问题**: 数据库连接失败，已临时禁用数据库初始化
2. **CORS配置**: 需要确保前端能够正确访问后端API
3. **文件上传**: 图片缓存目录需要正确配置权限

## 🔧 故障排除

### 后端无法启动
```bash
# 检查端口占用
netstat -an | findstr :8000

# 使用测试脚本启动
cd backend
python test_server.py
```

### 前端无法连接后端
```bash
# 检查环境变量
cat frontend/env.local

# 测试后端健康检查
curl http://localhost:8000/health
```

## 📚 相关文档

- [Next.js 15 文档](https://nextjs.org/docs)
- [FastAPI 文档](https://fastapi.tiangolo.com/)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [React Hook Form 文档](https://react-hook-form.com/)
