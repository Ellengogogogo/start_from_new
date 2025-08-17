# Property Expose Generator

一个专业的房产Expose生成网站，帮助个人和房产中介创建美观、专业的房产展示文档。

## 🏗️ 项目架构

这是一个monorepo项目，包含以下模块：

- **Frontend**: Next.js + TypeScript + Tailwind CSS
- **Backend**: FastAPI + Python
- **Worker**: Python异步任务处理
- **Infra**: Docker Compose配置

## 🚀 快速开始

### 前置要求

- Node.js 18+
- Python 3.9+
- Docker & Docker Compose

### 安装和运行

1. **克隆项目**
```bash
git clone <repository-url>
cd start_from_new
```

2. **启动前端**
```bash
cd frontend
npm install
npm run dev
```

3. **启动后端**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

4. **启动完整环境**
```bash
docker-compose up -d
```

## 📁 项目结构

```
start_from_new/
├── frontend/                 # Next.js前端应用
│   ├── src/
│   │   ├── app/            # App Router页面
│   │   ├── components/     # UI组件
│   │   └── lib/           # 工具函数
│   ├── package.json
│   └── tailwind.config.js
├── backend/                 # FastAPI后端
│   ├── app/
│   │   ├── main.py        # 主应用入口
│   │   ├── models/        # 数据模型
│   │   ├── routes/        # API路由
│   │   └── services/      # 业务逻辑
│   ├── requirements.txt
│   └── pyproject.toml
├── worker/                  # 异步任务处理
│   ├── main.py
│   └── requirements.txt
├── infra/                   # 基础设施配置
│   └── docker-compose.yml
├── .gitignore
└── README.md
```

## 🎨 功能特性

- **房产信息管理**: 输入房产基本信息
- **图片上传**: 支持多张房产图片上传
- **AI描述生成**: 基于房产信息自动生成专业描述
- **图片优化**: AI智能优化房产图片
- **专业模板**: 多种美观的Expose模板
- **响应式设计**: 支持各种设备访问

## 🛠️ 技术栈

### 前端
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- React Hook Form
- Framer Motion

### 后端
- FastAPI
- SQLAlchemy
- Pydantic
- OpenAI API
- Pillow (图像处理)

### 基础设施
- Docker
- PostgreSQL
- Redis
- Nginx

## 📝 开发指南

### 代码规范
- 使用ESLint和Prettier
- Python代码使用Black格式化
- 遵循TypeScript严格模式

### 提交规范
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式
- refactor: 重构
- test: 测试相关

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License
