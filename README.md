# React Virtual Masonry

一个高性能的 React 虚拟滚动瀑布流布局库,支持瀑布流和等高布局两种模式。

## ✨ 特性

- 🚀 **高性能虚拟滚动** - 只渲染可视区域内的元素,支持海量数据
- 📐 **多种布局模式**
  - 瀑布流布局(Pinterest 风格) - 不等宽不等高
  - 等高布局(Google Photos 风格) - 每行高度相同,宽度自适应
  - 动态布局 - 支持根据数据动态切换布局类型
- 🎯 **智能预加载** - IntersectionObserver 实现的无限滚动
- 🎨 **完全可定制** - 支持自定义渲染、加载状态、间距等
- 📱 **响应式设计** - 自动适配不同屏幕尺寸
- ⚡ **RAF 优化** - 使用 requestAnimationFrame 优化滚动性能
- 🔧 **TypeScript 支持** - 完整的类型定义
- 🪶 **零依赖** - 除了 React 不依赖任何第三方库

## 📦 安装

```bash
npm install react-virtual-masonry
# 或者
yarn add react-virtual-masonry
# 或者
pnpm add react-virtual-masonry
```

## 🎯 快速开始

### 1. 瀑布流布局 (Pinterest 风格)

```tsx
import { VirtualMasonry } from 'react-virtual-masonry';

function App() {
  const loadData = async (page: number, pageSize: number) => {
    const response = await fetch(`/api/images?page=${page}&size=${pageSize}`);
    const data = await response.json();
    return {
      data: data.items,
      hasMore: data.hasMore,
    };
  };

  return (
    <VirtualMasonry
      loadData={loadData}
      pageSize={30}
      minColumnWidth={200}
      maxColumnWidth={350}
      gap={16}
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

### 2. 等高布局 (Google Photos 风格)

```tsx
import { FullWidthEqualHeightMasonry } from 'react-virtual-masonry';

function App() {
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
      targetRowHeight={245}
      sizeRange={[230, 260]}
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

```tsx
import { DynamicMasonryView } from 'react-virtual-masonry';

function App() {
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

    return {
      data: data.items,
      hasMore: data.hasMore,
    };
  };

  return (
    <DynamicMasonryView
      loadData={loadData}
      pageSize={30}
      waterfallConfig={{
        minColumnWidth: 200,
        maxColumnWidth: 350,
        gap: 16,
      }}
      equalHeightConfig={{
        targetRowHeight: 245,
        sizeRange: [230, 260],
        gap: 8,
      }}
      renderItem={(item, index, isMasonry) => (
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

## 📖 API 文档

### VirtualMasonry Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `loadData` | `(page: number, pageSize: number) => Promise<{data: any[], hasMore: boolean}>` | 必填 | 数据加载函数 |
| `renderItem` | `(item: any, index: number) => React.ReactNode` | 必填 | 渲染每个项目的函数 |
| `pageSize` | `number` | `50` | 每页加载的数据量 |
| `minColumnWidth` | `number` | `200` | 最小列宽 |
| `maxColumnWidth` | `number` | - | 最大列宽 |
| `gap` | `number` | `16` | 间距 |
| `buffer` | `number` | `1500` | 缓冲区大小(px) |
| `loadMoreThreshold` | `number` | `800` | 预加载阈值(px) |
| `mapSize` | `(raw: any) => {width: number, height: number}` | - | 映射数据的宽高 |
| `enableAnimation` | `boolean` | `true` | 是否启用动画 |

### FullWidthEqualHeightMasonry Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `loadData` | `(page: number, pageSize: number) => Promise<{data: any[], hasMore: boolean}>` | 必填 | 数据加载函数 |
| `renderItem` | `(item: any, index: number) => React.ReactNode` | 必填 | 渲染每个项目的函数 |
| `pageSize` | `number` | `50` | 每页加载的数据量 |
| `targetRowHeight` | `number` | `245` | 目标行高 |
| `sizeRange` | `[number, number]` | `[230, 260]` | 行高范围 |
| `maxItemWidth` | `number` | `975` | 单个项目最大宽度 |
| `maxStretchRatio` | `number` | `1.5` | 最大拉伸比例 |
| `gap` | `number` | `8` | 间距 |
| `buffer` | `number` | `1500` | 缓冲区大小(px) |
| `loadMoreThreshold` | `number` | `500` | 预加载阈值(px) |
| `mapSize` | `(raw: any) => {width: number, height: number}` | - | 映射数据的宽高 |
| `enableAnimation` | `boolean` | `true` | 是否启用动画 |

### DynamicMasonryView Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `isMasonry` | `boolean` | - | 受控模式:是否使用瀑布流布局 |
| `defaultIsMasonry` | `boolean` | `true` | 非受控模式:默认布局类型 |
| `enableAnimation` | `boolean` | `true` | 是否启用动画 |
| `loadData` | `LoadDataFn` | 必填 | 数据加载函数(第一次调用时可返回isMasonry字段) |
| `renderItem` | `(item: any, index: number, isMasonry: boolean) => React.ReactNode` | 必填 | 渲染函数,isMasonry表示当前布局类型 |
| `waterfallConfig` | `WaterfallConfig` | `{}` | 瀑布流配置(minColumnWidth, maxColumnWidth, gap, buffer) |
| `equalHeightConfig` | `EqualHeightConfig` | `{}` | 等高布局配置(targetRowHeight, sizeRange, maxItemWidth, maxStretchRatio, gap, buffer) |
| `pageSize` | `number` | `50` | 每页数据量 |
| `mapSize` | `(raw: any) => {width: number, height: number}` | - | 映射宽高 |
| `renderInitialLoader` | `() => React.ReactNode` | - | 初始加载状态(确定布局类型前显示) |
| `onLayoutTypeLoaded` | `(isMasonry: boolean) => void` | - | 布局类型加载完成回调 |
| `onError` | `(error: Error) => void` | - | 错误回调 |

## 🎨 自定义样式

### 自定义项目渲染

```tsx
<VirtualMasonry
  // ... 其他 props
  renderItem={(item) => (
    <div
      style={{
        position: 'absolute',
        left: item.x,
        top: item.y,
        width: item.width,
        height: item.height,
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <img
        src={item.url}
        alt={item.title}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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

如果你的数据格式与默认不同,可以使用 `mapSize` 来映射:

```tsx
<VirtualMasonry
  // ... 其他 props
  mapSize={(item) => ({
    width: item.imageWidth,
    height: item.imageHeight,
  })}
/>
```

默认支持的字段名:
- `width` / `w` / `imgW`
- `height` / `h` / `imgH`

### 性能优化

1. **调整缓冲区大小**: `buffer` 属性控制可视区域外渲染的距离
2. **调整预加载阈值**: `loadMoreThreshold` 控制何时触发加载
3. **使用 React.memo**: 优化项目组件的渲染

```tsx
const MemoizedItem = React.memo(({ item }) => (
  <div
    style={{
      position: 'absolute',
      left: item.x,
      top: item.y,
      width: item.width,
      height: item.height,
    }}
  >
    {/* 你的内容 */}
  </div>
));

<VirtualMasonry
  renderItem={(item) => <MemoizedItem item={item} />}
/>
```

## 🏃 运行 Demo

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建库
npm run build
```

访问 `http://localhost:3000` 查看 demo。

## 📝 许可证

MIT

## 🤝 贡献

欢迎提交 Issue 和 Pull Request!

## 📮 联系方式

如果你有任何问题或建议,请通过以下方式联系我:

- GitHub Issues: [提交 Issue](https://github.com/yourusername/react-virtual-masonry/issues)
- Email: your.email@example.com

## 🙏 致谢

感谢所有贡献者的付出!