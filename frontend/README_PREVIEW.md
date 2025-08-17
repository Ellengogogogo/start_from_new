# 房源预览功能使用说明

## 功能概述

房源预览功能允许用户在填写房源表单后，实时预览生成的 Exposé 页面效果，无需提交到后端即可查看最终展示效果。

## 使用方法

### 1. 填写房源表单

访问 `/properties/new` 页面，按照步骤填写房源信息：

- **步骤1**: 基本信息（标题、地址、价格）
- **步骤2**: 房屋详情（房间数、面积、建成年份）
- **步骤3**: 描述文本（可选）
- **步骤4**: 图片上传

### 2. 预览效果

在最后一步（图片上传完成后），你会看到两个按钮：

- **预览效果**: 点击后跳转到预览页面，查看 Exposé 效果
- **提交表单**: 正式提交到后端系统

### 3. 查看预览

点击"预览效果"按钮后，系统会：

1. 将当前表单数据保存到 localStorage
2. 跳转到 `/dev-preview` 开发预览页面
3. 使用现有的组件库展示完整的房源 Exposé

## 预览页面功能

### 顶部操作栏

- **返回编辑**: 回到表单页面继续编辑
- **分享**: 分享预览页面链接
- **打印/导出PDF**: 使用浏览器打印功能导出PDF

### 内容展示

预览页面包含以下完整内容：

1. **房源头部**: 标题、地址、价格、标签
2. **图片展示**: 响应式图片画廊，支持lightbox
3. **房源特性**: 房间数、面积、建成年份等
4. **房源描述**: 自动生成的详细描述
5. **位置信息**: 地图占位符和地址详情
6. **联系信息**: 房产顾问联系卡片

## 技术实现

### 数据流程

```
表单填写 → 数据验证 → 保存到localStorage → 跳转预览页面 → 读取数据 → 组件渲染
```

### 数据转换

系统会自动将表单数据转换为预览需要的格式：

- 生成智能标签（根据价格、房间数、面积等）
- 生成专业描述（结合用户输入和自动生成内容）
- 处理图片文件（创建本地URL）
- 添加默认联系信息

### 组件复用

预览页面完全使用现有的 Design System 组件：

- **Atoms**: Button, Badge, Divider
- **Molecules**: ImageGallery, FeatureList
- **Organisms**: PropertyHeader, ContactCard, MapSection

## 自定义配置

### 修改默认联系信息

在 `preview/page.tsx` 中修改 `defaultContact` 对象：

```typescript
const defaultContact = {
  name: "你的姓名",
  title: "你的职位",
  phone: "你的电话",
  email: "你的邮箱",
  // ... 其他信息
};
```

### 修改默认坐标

修改 `defaultCoordinates` 对象：

```typescript
const defaultCoordinates = {
  lat: 你的纬度,
  lng: 你的经度
};
```

### 自定义标签生成逻辑

在 `generateTags` 函数中添加更多标签规则：

```typescript
const generateTags = (data: SimplePropertyData): string[] => {
  const tags: string[] = [];
  
  // 添加你的标签逻辑
  if (data.price >= 20000000) tags.push('超级豪宅');
  
  return tags;
};
```

## 注意事项

### 数据存储

- 预览数据存储在浏览器的 localStorage 中
- 数据仅在当前会话中有效
- 刷新页面后数据仍然存在
- 关闭浏览器后数据会丢失

### 图片处理

- 上传的图片会创建本地 URL 用于预览
- 图片不会上传到服务器
- 预览页面关闭后图片 URL 会失效

### 浏览器兼容性

- 需要支持 localStorage 的现代浏览器
- 打印功能依赖浏览器的打印功能
- 分享功能优先使用 Web Share API，降级到复制链接

## 故障排除

### 预览页面显示默认数据

**原因**: localStorage 中没有表单数据
**解决**: 确保在表单页面点击"预览效果"按钮

### 图片无法显示

**原因**: 图片文件处理失败
**解决**: 检查图片文件格式，确保是有效的图片文件

### 预览按钮无法点击

**原因**: 表单验证未通过
**解决**: 检查必填字段是否已填写，确保表单验证通过

## 扩展功能

### 添加更多预览模板

可以创建不同的预览模板：

- `Expose_A4_Modern.tsx` - 现代风格模板
- `Expose_Mobile.tsx` - 移动端优化模板
- `Expose_Print.tsx` - 打印专用模板

### 集成真实地图

替换地图占位符为真实地图组件：

```typescript
import { GoogleMap } from '@/components/maps/GoogleMap';

// 在 MapSection 中使用
<GoogleMap 
  coordinates={previewData.coordinates}
  address={previewData.address}
/>
```

### 添加更多交互功能

- 图片轮播
- 3D 房屋展示
- 虚拟看房
- 在线咨询

## 总结

房源预览功能为用户提供了完整的 Exposé 页面预览体验，让用户可以在正式提交前查看最终效果，大大提升了用户体验和系统可用性。通过复用现有的 Design System 组件，确保了界面的一致性和专业性。
