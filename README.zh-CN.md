# React Virtual Masonry (中文文档)

[English](./README.md) | 简体中文

一个高性能的 React 虚拟滚动瀑布流布局库,支持瀑布流和等高布局两种模式。

## 🎮 在线演示

**[查看在线演示](https://cleverbamboo.github.io/react-virtual-masonry/)**

体验所有三种布局模式的交互式示例和代码片段。

## ✨ 特性

- 🚀 **高性能虚拟滚动** - 只渲染可视区域内的元素,支持海量数据展示
- 📐 **多种布局模式**
  - 瀑布流布局(Pinterest 风格) - 不等宽不等高,自动找到最短列放置
  - 等高布局(Google Photos 风格) - 每行高度相同,宽度按原始比例自适应填满整行
  - 动态布局 - 支持根据接口返回的数据动态切换布局类型
- 🎯 **智能预加载** - 基于 IntersectionObserver 实现的无限滚动,支持自定义预加载距离
- 🎨 **完全可定制** - 支持自定义渲染函数、加载状态、"没有更多"提示、间距等
- 📱 **响应式设计** - 使用 ResizeObserver 自动适配容器宽度变化
- ⚡ **RAF 优化** - 使用 requestAnimationFrame 优化滚动性能,避免卡顿
- 🔧 **TypeScript 支持** - 完整的 TypeScript 类型定义
- 🪶 **零外部依赖** - 除了 React 不依赖任何第三方库

## 📦 安装

```bash
npm install @cleverbamboo/react-virtual-masonry
# 或者
yarn add @cleverbamboo/react-virtual-masonry
# 或者
pnpm add @cleverbamboo/react-virtual-masonry
```

## 🎯 快速开始

### 1. 瀑布流布局 (Pinterest 风格)

适用于图片墙、商品列表等场景。

```tsx
import { VirtualMasonry } from 'react-virtual-masonry';

function ImageGallery() {
  // 数据加载函数
  const loadData = async (page: number, pageSize: number) => {
    const response = await fetch(`/api/images?page=${page}&size=${pageSize}`);
    const data = await response.json();
    return {
      data: data.items,      // 数据数组
      hasMore: data.hasMore, // 是否还有更多数据
    };
  };

  return (
    <VirtualMasonry
      loadData={loadData}
      pageSize={30}
      minColumnWidth={200}    // 最小列宽
      maxColumnWidth={350}    // 最大列宽(可选)
      gap={16}                // 间距
      renderItem={(item) => (
        <div
          style={{
            position: 'absolute',
            left: item.x,      // 组件会自动计算位置
            top: item.y,
            width: item.width,
            height: item.height,
          }}
        >
          <img src={item.url} alt={item.title} />
        </div>
      )}
    />
  );
}
```

### 2. 等高布局 (Google Photos 风格)

适用于相册、时间线等需要整齐对齐的场景。

```tsx
import { FullWidthEqualHeightMasonry } from 'react-virtual-masonry';

function PhotoAlbum() {
  const loadData = async (page: number, pageSize: number) => {
    const response = await fetch(`/api/photos?page=${page}&size=${pageSize}`);
    const data = await response.json();
    return {
      data: data.items,
      hasMore: data.hasMore,
    };
  };

  return (
    <FullWidthEqualHeightMasonry
      loadData={loadData}
      pageSize={30}
      targetRowHeight={245}      // 目标行高
      sizeRange={[230, 260]}     // 行高范围[最小, 最大]
      maxItemWidth={975}         // 单个项目最大宽度
      gap={8}
      renderItem={(item) => (
        <div
          style={{
            position: 'absolute',
            left: item.x,
            top: item.y,
            width: item.width,
            height: item.height,
          }}
        >
          <img src={item.url} alt={item.title} />
        </div>
      )}
    />
  );
}
```

### 3. 动态布局

根据接口返回的数据动态切换布局类型。

```tsx
import { DynamicMasonryView } from 'react-virtual-masonry';

function DynamicGallery() {
  const loadData = async (page: number, pageSize: number) => {
    const response = await fetch(`/api/content?page=${page}&size=${pageSize}`);
    const data = await response.json();

    // 第一次加载时返回布局类型
    if (page === 1) {
      return {
        data: data.items,
        hasMore: data.hasMore,
        isMasonry: data.layoutType === 'waterfall', // true=瀑布流, false=等高
      };
    }

    // 后续加载不需要返回布局类型
    return {
      data: data.items,
      hasMore: data.hasMore,
    };
  };

  return (
    <DynamicMasonryView
      loadData={loadData}
      pageSize={30}
      // 瀑布流配置
      waterfallConfig={{
        minColumnWidth: 200,
        maxColumnWidth: 350,
        gap: 16,
      }}
      // 等高布局配置
      equalHeightConfig={{
        targetRowHeight: 245,
        sizeRange: [230, 260],
        gap: 8,
      }}
      renderItem={(item, isMasonry) => (
        <div
          style={{
            position: 'absolute',
            left: item.x,
            top: item.y,
            width: item.width,
            height: item.height,
            borderRadius: isMasonry ? '8px' : '4px', // 可以根据布局类型调整样式
          }}
        >
          <img src={item.url} alt={item.title} />
        </div>
      )}
    />
  );
}
```

## 📖 API 文档

### VirtualMasonry

瀑布流布局组件,适合不等宽不等高的内容。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `loadData` | `(page: number, pageSize: number) => Promise<{data: any[], hasMore: boolean}>` | **必填** | 数据加载函数,返回 Promise |
| `renderItem` | `(item: any, index: number) => React.ReactNode` | **必填** | 渲染每个项目的函数 |
| `pageSize` | `number` | `50` | 每页加载的数据量 |
| `minColumnWidth` | `number` | `200` | 最小列宽(px) |
| `maxColumnWidth` | `number` | - | 最大列宽(px),不设置则不限制 |
| `gap` | `number` | `16` | 项目间距(px) |
| `buffer` | `number` | `1500` | 可视区域外的缓冲区大小(px),越大渲染的内容越多 |
| `loadMoreThreshold` | `number` | `800` | 预加载阈值(px),距离底部多远时触发加载 |
| `mapSize` | `(raw: any) => {width: number, height: number}` | - | 映射数据的宽高字段 |
| `renderLoader` | `(totalHeight: number) => React.ReactNode` | - | 自定义加载状态组件 |
| `renderNoMore` | `(totalHeight: number) => React.ReactNode` | - | 自定义"没有更多"提示组件 |

### FullWidthEqualHeightMasonry

等高布局组件,每行高度相同,宽度自适应。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `loadData` | `(page: number, pageSize: number) => Promise<{data: any[], hasMore: boolean}>` | **必填** | 数据加载函数 |
| `renderItem` | `(item: any) => React.ReactNode` | **必填** | 渲染函数,item 包含 x, y, width, height |
| `pageSize` | `number` | `50` | 每页数据量 |
| `targetRowHeight` | `number` | `245` | 目标行高,实际会在 sizeRange 范围内调整 |
| `sizeRange` | `[number, number]` | `[230, 260]` | 行高范围 [最小高度, 最大高度] |
| `maxItemWidth` | `number` | `975` | 单个项目的最大宽度,避免图片过宽 |
| `maxStretchRatio` | `number` | `1.5` | 最大拉伸比例,避免图片过度变形 |
| `gap` | `number` | `8` | 项目间距(px) |
| `buffer` | `number` | `1500` | 缓冲区大小(px) |
| `loadMoreThreshold` | `number` | `500` | 预加载阈值(px) |
| `mapSize` | `(raw: any) => {width: number, height: number}` | - | 映射数据的宽高字段 |
| `renderLoader` | `(totalHeight: number) => React.ReactNode` | - | 自定义加载状态 |
| `renderNoMore` | `(totalHeight: number) => React.ReactNode` | - | 自定义"没有更多"提示 |

### DynamicMasonryView

动态布局组件,可以根据数据动态切换瀑布流和等高布局。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `isMasonry` | `boolean` | - | 受控模式:是否使用瀑布流布局 |
| `defaultIsMasonry` | `boolean` | `true` | 非受控模式:默认布局类型 |
| `loadData` | `LoadDataFn` | **必填** | 数据加载函数,第一次可返回 isMasonry |
| `renderItem` | `(item: any, isMasonry: boolean) => React.ReactNode` | **必填** | 渲染函数,第二个参数表示当前布局类型 |
| `waterfallConfig` | `WaterfallConfig` | `{}` | 瀑布流配置对象 |
| `equalHeightConfig` | `EqualHeightConfig` | `{}` | 等高布局配置对象 |
| `pageSize` | `number` | `50` | 每页数据量 |
| `mapSize` | `(raw: any) => {width: number, height: number}` | - | 映射宽高字段 |
| `renderInitialLoader` | `() => React.ReactNode` | - | 初始加载状态(获取布局类型时) |
| `onLayoutTypeLoaded` | `(isMasonry: boolean) => void` | - | 布局类型加载完成回调 |
| `onError` | `(error: Error) => void` | - | 错误回调 |

#### LoadDataFn 类型

```typescript
type LoadDataFn<T = any> = (
  page: number,
  pageSize: number,
) => Promise<{
  data: T[];
  hasMore: boolean;
  isMasonry?: boolean; // 仅第一次调用时返回
}>;
```

## 🎨 自定义样式

### 自定义加载状态和"没有更多"提示

```tsx
<VirtualMasonry
  loadData={loadData}
  renderItem={renderItem}
  renderLoader={(totalHeight) => (
    <div
      style={{
        position: 'absolute',
        top: totalHeight,
        left: 0,
        right: 0,
        height: 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div className="custom-loader">加载中...</div>
    </div>
  )}
  renderNoMore={(totalHeight) => (
    <div
      style={{
        position: 'absolute',
        top: totalHeight,
        left: 0,
        right: 0,
        height: 50,
        textAlign: 'center',
        color: '#999',
        paddingTop: '20px',
      }}
    >
      - 没有更多数据了 -
    </div>
  )}
/>
```

### 自定义项目样式

```tsx
<VirtualMasonry
  loadData={loadData}
  renderItem={(item) => (
    <div
      className="gallery-item"
      style={{
        position: 'absolute',
        left: item.x,
        top: item.y,
        width: item.width,
        height: item.height,
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      }}
    >
      <img
        src={item.url}
        alt={item.title}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      <div className="overlay">
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </div>
    </div>
  )}
/>
```

## 🔧 高级用法

### 映射数据格式

如果你的数据格式与默认不同,可以使用 `mapSize` 来映射宽高字段:

```tsx
<VirtualMasonry
  loadData={loadData}
  mapSize={(item) => ({
    width: item.imageWidth,   // 自定义宽度字段名
    height: item.imageHeight, // 自定义高度字段名
  })}
  renderItem={renderItem}
/>
```

**默认支持的字段名:**
- 宽度: `width` / `w` / `imgW`
- 高度: `height` / `h` / `imgH`

### 性能优化建议

#### 1. 调整缓冲区大小

`buffer` 属性控制可视区域外渲染多少内容。值越大,滚动时越流畅,但内存占用越高。

```tsx
<VirtualMasonry
  buffer={1500}  // 默认值,可根据实际情况调整
  // ...
/>
```

#### 2. 调整预加载阈值

`loadMoreThreshold` 控制距离底部多远时开始加载下一页。

```tsx
<VirtualMasonry
  loadMoreThreshold={800}  // 距离底部 800px 时开始加载
  // ...
/>
```

#### 3. 使用 React.memo 优化渲染

```tsx
const GalleryItem = React.memo(({ item }) => (
  <div
    style={{
      position: 'absolute',
      left: item.x,
      top: item.y,
      width: item.width,
      height: item.height,
    }}
  >
    <img src={item.url} alt={item.title} />
  </div>
));

<VirtualMasonry
  renderItem={(item) => <GalleryItem item={item} />}
/>
```

#### 4. 图片懒加载

配合浏览器原生懒加载或第三方库:

```tsx
<VirtualMasonry
  renderItem={(item) => (
    <div style={{...}}>
      <img
        src={item.url}
        alt={item.title}
        loading="lazy"  // 浏览器原生懒加载
      />
    </div>
  )}
/>
```

## 🏃 运行 Demo

```bash
# 克隆仓库
git clone https://github.com/yourusername/react-virtual-masonry.git
cd react-virtual-masonry

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建库
npm run build
```

访问 `http://localhost:3000` 查看完整的 demo 示例。

## 📝 更新日志

### v1.0.0 (2025-01-XX)

- 🎉 首次发布
- ✨ 支持瀑布流布局
- ✨ 支持等高布局
- ✨ 支持动态布局切换
- 🚀 虚拟滚动优化
- 📖 完整的 TypeScript 类型

## 🤝 贡献指南

我们欢迎所有形式的贡献!

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 📄 许可证

本项目采用 [MIT](./LICENSE) 许可证。

## 📮 联系方式

如果你有任何问题或建议:

- 提交 Issue: [GitHub Issues](https://github.com/yourusername/react-virtual-masonry/issues)
- 发送邮件: your.email@example.com

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者!

---

如果这个项目对你有帮助,欢迎给个 ⭐️ Star!