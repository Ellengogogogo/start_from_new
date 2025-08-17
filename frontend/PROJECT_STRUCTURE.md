# 前端项目结构说明

## 目录结构

```
frontend/
├── src/
│   ├── app/                          # Next.js App Router 页面
│   │   ├── page.tsx                  # 主页面 (首页)
│   │   ├── layout.tsx                # 根布局
│   │   ├── globals.css               # 全局样式
│   │   └── properties/               # 房源相关页面
│   │       ├── new/                  # 创建新房源
│   │       │   └── page.tsx         # 多步骤表单页面
│   │       └── [id]/                 # 动态路由 - 房源ID
│   │           └── preview/          # 房源预览
│   │               └── page.tsx      # 预览页面
│   ├── components/                    # 可复用组件 (待扩展)
│   ├── hooks/                        # 自定义 Hooks
│   │   ├── useMultiStepForm.ts      # 多步骤表单管理
│   │   └── useUploadImages.ts       # 图片上传管理
│   ├── services/                     # API 服务
│   │   └── api.ts                   # API 调用函数
│   ├── types/                        # TypeScript 类型定义
│   │   └── property.ts              # 房源相关类型
│   └── lib/                         # 工具库
│       └── validations.ts           # 表单验证 Schema
├── public/                           # 静态资源
│   └── placeholder-house.jpg        # 占位图片
├── package.json                      # 项目依赖
├── tsconfig.json                     # TypeScript 配置
├── next.config.ts                    # Next.js 配置
├── postcss.config.mjs               # PostCSS 配置
├── tailwind.config.js               # Tailwind CSS 配置
└── README.md                        # 项目说明
```

## 核心文件说明

### 1. 主页面 (`src/app/page.tsx`)
- 展示应用介绍和功能特性
- 提供导航到房源创建页面的链接
- 响应式设计，支持移动端和桌面端

### 2. 房源创建表单 (`src/app/properties/new/page.tsx`)
- **多步骤表单设计**：
  - 步骤1: 基本信息（标题、地址、价格）
  - 步骤2: 房屋详情（房间数、面积、建成年份）
  - 步骤3: 描述文本（支持AI自动生成）
  - 步骤4: 图片上传（多张图片，预览功能）
- **表单验证**: 使用 Zod 进行数据验证
- **状态管理**: React Hook Form 管理表单状态
- **图片处理**: 支持多图片上传、预览、删除
- **进度指示器**: 可视化步骤进度

### 3. 房源预览页面 (`src/app/properties/[id]/preview/page.tsx`)
- **完整信息展示**: 房源的所有详细信息
- **图片画廊**: 主图片 + 缩略图列表
- **图片模态框**: 点击图片可全屏查看
- **联系信息**: 经纪人联系方式
- **操作按钮**: 编辑、分享、下载等

### 4. 自定义 Hooks

#### `useMultiStepForm.ts`
- 管理多步骤表单的状态
- 提供步骤导航功能（前进、后退、跳转）
- 支持表单数据同步

#### `useUploadImages.ts`
- 处理图片上传逻辑
- 显示上传进度
- 管理上传状态

### 5. API 服务 (`src/services/api.ts`)
- 封装所有后端API调用
- 支持图片上传进度监控
- 统一的错误处理

### 6. 类型定义 (`src/types/property.ts`)
- `PropertyFormData`: 表单数据类型
- `PropertyData`: 房源数据类型
- `PropertyImage`: 图片数据类型
- `PropertyPreview`: 预览页面数据类型

### 7. 表单验证 (`src/lib/validations.ts`)
- 使用 Zod 定义验证规则
- 分步骤验证 schema
- 中文错误提示

## 技术特性

### UI/UX 设计
- **现代化设计**: 使用 Tailwind CSS 4 构建
- **响应式布局**: 支持各种屏幕尺寸
- **流畅动画**: CSS transitions 和 hover 效果
- **直观导航**: 清晰的步骤指示器

### 表单功能
- **分步填写**: 降低用户认知负担
- **实时验证**: 即时反馈表单错误
- **数据持久化**: 步骤间数据保持
- **智能生成**: AI 描述自动生成

### 图片处理
- **多图片支持**: 最多20张图片
- **预览功能**: 上传前预览
- **进度显示**: 上传进度条
- **格式支持**: JPG、PNG、WebP

### 开发体验
- **TypeScript**: 完整的类型安全
- **调试信息**: 开发时显示状态数据
- **错误处理**: 友好的错误提示
- **代码组织**: 清晰的模块化结构

## 使用流程

### 1. 用户访问
1. 用户访问首页
2. 点击"创建房源"按钮
3. 进入多步骤表单页面

### 2. 填写表单
1. **步骤1**: 填写基本信息
2. **步骤2**: 填写房屋详情
3. **步骤3**: 添加描述（可选AI生成）
4. **步骤4**: 上传图片

### 3. 提交处理
1. 验证所有必填字段
2. 调用API上传房源数据
3. 上传图片文件
4. 跳转到预览页面

### 4. 预览展示
1. 展示完整的房源信息
2. 图片画廊浏览
3. 提供编辑、分享等操作

## 扩展建议

### 组件化
- 将表单步骤抽取为独立组件
- 创建可复用的UI组件库
- 添加加载状态和错误边界组件

### 功能增强
- 添加房源模板功能
- 支持草稿保存
- 添加批量操作功能
- 集成地图显示

### 性能优化
- 图片懒加载
- 表单数据缓存
- 代码分割
- 图片压缩优化

## 部署说明

### 环境要求
- Node.js 18+
- npm 或 yarn

### 构建命令
```bash
npm install          # 安装依赖
npm run build       # 构建生产版本
npm start           # 启动生产服务器
```

### 环境变量
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000  # 后端API地址
```

这个前端项目提供了完整的房源创建和预览功能，具有良好的用户体验和开发体验。
