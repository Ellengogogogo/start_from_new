# 房源展示生成器 - 前端

基于 Next.js 15 + TypeScript + Tailwind CSS 构建的房源展示生成器前端应用。

## 功能特性

### 🏠 多步骤房源表单 (`/properties/new`)
- **步骤1**: 基本信息（标题、地址、价格）
- **步骤2**: 房屋详情（房间数、面积、建成年份）
- **步骤3**: 描述文本（支持AI自动生成）
- **步骤4**: 图片上传（多张图片，预览功能）

### 📱 房源预览页面 (`/properties/[id]/preview`)
- 展示完整的房源信息
- 图片画廊和模态框查看
- 联系信息和操作按钮
- 响应式设计，支持移动端

### 🎨 UI 特性
- 现代化的设计风格
- 流畅的动画和过渡效果
- 完整的表单验证
- 图片上传进度条
- 调试信息显示

## 技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS 4
- **表单**: React Hook Form + Zod
- **图标**: Lucide React
- **HTTP**: Axios

## 项目结构

```
src/
├── app/
│   ├── page.tsx                    # 主页面
│   ├── properties/
│   │   ├── new/
│   │   │   └── page.tsx           # 房源创建表单
│   │   └── [id]/
│   │       └── preview/
│   │           └── page.tsx       # 房源预览页面
│   ├── layout.tsx                  # 根布局
│   └── globals.css                 # 全局样式
├── components/                      # 可复用组件
├── hooks/                          # 自定义 Hooks
│   ├── useMultiStepForm.ts        # 多步骤表单管理
│   └── useUploadImages.ts         # 图片上传管理
├── services/                       # API 服务
│   └── api.ts                     # API 调用函数
├── types/                          # TypeScript 类型定义
│   └── property.ts                # 房源相关类型
└── lib/                           # 工具库
    └── validations.ts             # 表单验证 Schema
```

## 快速开始

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本
```bash
npm run build
npm start
```

## 使用说明

### 1. 创建房源
1. 访问 `/properties/new` 页面
2. 按步骤填写房源信息
3. 上传房源图片
4. 提交表单，系统会：
   - 调用 `POST /api/cache/property-data` 上传房源数据
   - 调用 `POST /api/cache/property-images/{propertyId}` 上传图片
   - 跳转到预览页面

### 2. 查看房源
1. 访问 `/properties/{propertyId}/preview` 页面
2. 查看完整的房源信息
3. 浏览图片画廊
4. 使用各种操作功能

## API 接口

### 房源数据
- `POST /api/cache/property-data` - 缓存房源数据
- `GET /api/cache/property-data/{id}` - 获取缓存的房源数据

### 图片上传
- `POST /api/cache/property-images/{propertyId}` - 上传房源图片
- `GET /api/cache/property-images/{propertyId}` - 获取房源图片

## 自定义配置

### 环境变量
在 `.env.local` 文件中配置：
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Tailwind CSS
Tailwind CSS 4 已预配置，支持：
- 响应式设计
- 深色模式
- 自定义颜色和间距
- JIT 编译

## 开发指南

### 添加新字段
1. 在 `types/property.ts` 中更新类型定义
2. 在 `lib/validations.ts` 中添加验证规则
3. 在表单页面中添加对应的输入字段
4. 更新预览页面的显示

### 样式定制
使用 Tailwind CSS 类名进行样式定制：
```tsx
// 响应式设计
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// 状态样式
<button className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400">

// 动画效果
<div className="transition-all duration-200 hover:scale-105">
```

### 表单验证
使用 Zod 进行表单验证：
```tsx
const schema = z.object({
  title: z.string().min(1, '标题是必填项'),
  price: z.number().min(0, '价格不能为负数'),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema)
});
```

## 部署

### Vercel
推荐使用 Vercel 进行部署：
1. 连接 GitHub 仓库
2. 自动构建和部署
3. 支持预览部署

### 其他平台
支持部署到任何支持 Node.js 的平台：
- Netlify
- Railway
- 自托管服务器

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License
