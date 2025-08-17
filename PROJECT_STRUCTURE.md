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

### 目录结构
```
frontend/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── page.tsx                  # 首页
│   │   ├── layout.tsx                # 根布局
│   │   ├── globals.css               # 全局样式
│   │   └── properties/               # 房源相关页面
│   │       ├── new/                  # 创建新房源
│   │       │   └── page.tsx          # 多步骤表单页面
│   │       └── [id]/                 # 动态路由
│   │           ├── preview/          # 房源预览
│   │           │   └── page.tsx      # 预览页面
│   │           └── expose/           # Expose生成
│   │               └── [exposeId]/   # 动态expose ID
│   │                   └── page.tsx  # Expose状态和预览页面
│   ├── components/                   # 可复用组件
│   ├── hooks/                        # 自定义Hooks
│   │   ├── useMultiStepForm.ts       # 多步骤表单管理
│   │   └── useUploadImages.ts        # 图片上传管理
│   ├── lib/                          # 工具库
│   │   └── validations.ts            # Zod验证模式
│   ├── services/                     # API服务
│   │   └── api.ts                    # 后端API调用
│   └── types/                        # TypeScript类型定义
│       └── property.ts               # 房源相关类型
├── public/                           # 静态资源
├── package.json                      # 依赖配置
├── next.config.ts                    # Next.js配置
├── tailwind.config.js                # Tailwind配置
├── postcss.config.mjs                # PostCSS配置
├── tsconfig.json                     # TypeScript配置
├── eslint.config.mjs                 # ESLint配置
└── env.local                         # 环境变量配置
```

### 核心功能页面

#### 1. 多步骤房源表单 (`/properties/new`)
- **步骤1**: 基本信息（标题、地址、价格）
- **步骤2**: 房屋详情（房间数、面积、建成年份）
- **步骤3**: 描述文本（支持AI自动生成）
- **步骤4**: 图片上传（多图支持、预览、进度条）

#### 2. 房源预览 (`/properties/[id]/preview`)
- 显示缓存的房源数据
- 展示上传的图片
- 响应式布局设计

#### 3. Expose生成状态 (`/properties/[id]/expose/[exposeId]`)
- 实时显示生成进度
- 预览生成的expose
- PDF下载功能
- 打印和分享选项

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
│   │   ├── config.py                 # 应用配置
│   │   └── database.py               # 数据库连接
│   ├── models/                       # 数据模型
│   ├── schemas/                      # Pydantic模式
│   ├── services/                     # 业务逻辑服务
│   └── routes/                       # API路由
│       ├── __init__.py
│       ├── auth.py                   # 认证相关
│       ├── properties.py             # 房源管理
│       ├── images.py                 # 图片处理
│       ├── cache.py                  # 缓存管理 ⭐ 新增
│       └── expose_generation.py      # Expose生成路由 ⭐ 主要实现
├── static/                           # 静态文件
│   └── cache/                        # 缓存图片目录
├── requirements.txt                   # Python依赖
├── pyproject.toml                    # Poetry配置
├── Dockerfile                        # 容器化配置
└── test_server.py                    # 测试服务器脚本 ⭐ 新增
```

### API端点

#### 缓存管理 (`/api/cache`)
- `POST /api/cache/property-data` - 缓存房源数据
- `GET /api/cache/property-data/{id}` - 获取缓存的房源数据
- `POST /api/cache/property-images/{id}` - 缓存房源图片
- `GET /api/cache/property-images/{id}` - 获取缓存的图片

#### Expose生成 (`/api/expose`)
- `POST /api/expose/generate/{property_id}` - 开始生成expose
- `GET /api/expose/status/{expose_id}` - 获取生成状态
- `GET /api/expose/preview/{expose_id}` - 获取预览数据
- `GET /api/expose/download/{expose_id}` - 下载PDF
- `DELETE /api/expose/{expose_id}` - 删除expose

#### 主要业务 (`/api/v1`)
- `POST /api/v1/properties/` - 创建房源
- `GET /api/v1/properties/` - 获取房源列表
- `GET /api/v1/properties/{id}` - 获取特定房源

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
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. 启动前端
```bash
cd frontend
npm install
npm run dev
```

### 3. 使用Docker Compose
```bash
cd infra
docker-compose up -d
```

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
- [x] 前端多步骤表单
- [x] 图片上传和预览
- [x] 后端API路由
- [x] 缓存管理系统
- [x] Expose生成流程
- [x] PDF下载功能
- [x] 响应式UI设计
- [x] 清理冗余代码 ⭐ 新增

### 🚧 进行中
- [ ] 后端服务器启动问题解决
- [ ] 前后端连接测试

### 📝 待完成
- [ ] AI描述生成集成
- [ ] 图片AI优化
- [ ] 真实PDF生成
- [ ] 用户认证系统
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
