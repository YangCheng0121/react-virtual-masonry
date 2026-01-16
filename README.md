# React Virtual Masonry

[English](./README.md) | [简体中文](./README.zh-CN.md)

A high-performance React virtual scrolling masonry layout library with support for waterfall and equal-height layouts.

## 🎮 Live Demo

**[View Live Demo](https://cleverbamboo.github.io/react-virtual-masonry/)**

Experience all three layout modes with interactive examples and code snippets.

## ✨ Features

- 🚀 **High-Performance Virtual Scrolling** - Only renders visible elements, supports massive datasets
- 📐 **Multiple Layout Modes**
  - Waterfall Layout (Pinterest Style) - Variable width and height, automatically finds shortest column
  - Equal Height Layout (Google Photos Style) - Same height per row, width adapts to original aspect ratio
  - Dynamic Layout - Supports switching layout types based on API response
- 🎯 **Smart Preloading** - Infinite scroll based on IntersectionObserver with customizable preload distance
- 🎨 **Fully Customizable** - Custom render functions, loading states, spacing, and more
- 📱 **Responsive Design** - Automatically adapts to container width changes using ResizeObserver
- ⚡ **RAF Optimized** - Uses requestAnimationFrame for smooth scrolling performance
- 🔧 **TypeScript Support** - Complete TypeScript type definitions
- 🪶 **Zero Dependencies** - No external dependencies except React

## 📦 Installation

```bash
npm install react-virtual-masonry
# or
yarn add react-virtual-masonry
# or
pnpm add react-virtual-masonry
```

## 🎯 Quick Start

### 1. Waterfall Layout (Pinterest Style)

Perfect for image galleries, product listings, etc.

```tsx
import { VirtualMasonry } from 'react-virtual-masonry';

function ImageGallery() {
  // Data loading function
  const loadData = async (page: number, pageSize: number) => {
    const response = await fetch(`/api/images?page=${page}&size=${pageSize}`);
    const data = await response.json();
    return {
      data: data.items,      // Data array
      hasMore: data.hasMore, // Whether there's more data
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

### 2. Equal Height Layout (Google Photos Style)

Perfect for photo albums, media galleries, etc.

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

### 3. Dynamic Layout

Automatically switches between waterfall and equal-height layouts based on API response.

```tsx
import { DynamicMasonryView } from 'react-virtual-masonry';

function Gallery() {
  const loadData = async (page: number, pageSize: number) => {
    const response = await fetch(`/api/gallery?page=${page}&size=${pageSize}`);
    const data = await response.json();

    // First request returns layout type
    if (page === 1) {
      return {
        data: data.items,
        hasMore: data.hasMore,
        isMasonry: data.layoutType === 'waterfall', // true for waterfall, false for equal-height
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

## 📖 API Documentation

### VirtualMasonry (Waterfall Layout)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `loadData` | `(page: number, pageSize: number) => Promise<{data: any[], hasMore: boolean}>` | Required | Data loading function |
| `renderItem` | `(item: any, index: number) => React.ReactNode` | Required | Item render function |
| `pageSize` | `number` | `50` | Items per page |
| `minColumnWidth` | `number` | `200` | Minimum column width |
| `maxColumnWidth` | `number` | - | Maximum column width |
| `gap` | `number` | `16` | Gap between items |
| `buffer` | `number` | `1500` | Buffer size (px) |
| `loadMoreThreshold` | `number` | `800` | Preload threshold (px) |
| `mapSize` | `(raw: any) => {width: number, height: number}` | - | Map data to dimensions |
| `enableAnimation` | `boolean` | `true` | Enable animations |

### FullWidthEqualHeightMasonry (Equal Height Layout)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `loadData` | `(page: number, pageSize: number) => Promise<{data: any[], hasMore: boolean}>` | Required | Data loading function |
| `renderItem` | `(item: any, index: number) => React.ReactNode` | Required | Item render function |
| `pageSize` | `number` | `50` | Items per page |
| `targetRowHeight` | `number` | `245` | Target row height |
| `sizeRange` | `[number, number]` | `[230, 260]` | Row height range |
| `maxItemWidth` | `number` | `975` | Maximum item width |
| `maxStretchRatio` | `number` | `1.5` | Maximum stretch ratio |
| `gap` | `number` | `8` | Gap between items |
| `buffer` | `number` | `1500` | Buffer size (px) |
| `loadMoreThreshold` | `number` | `500` | Preload threshold (px) |
| `mapSize` | `(raw: any) => {width: number, height: number}` | - | Map data to dimensions |
| `enableAnimation` | `boolean` | `true` | Enable animations |

### DynamicMasonryView (Dynamic Layout)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `isMasonry` | `boolean` | - | Controlled mode: whether to use waterfall layout |
| `defaultIsMasonry` | `boolean` | `true` | Uncontrolled mode: default layout type |
| `enableAnimation` | `boolean` | `true` | Enable animations |
| `loadData` | `LoadDataFn` | Required | Data loading function (can return isMasonry on first call) |
| `renderItem` | `(item: any, index: number, isMasonry: boolean) => React.ReactNode` | Required | Render function, isMasonry indicates current layout |
| `waterfallConfig` | `WaterfallConfig` | `{}` | Waterfall config (minColumnWidth, maxColumnWidth, gap, buffer) |
| `equalHeightConfig` | `EqualHeightConfig` | `{}` | Equal-height config (targetRowHeight, sizeRange, maxItemWidth, maxStretchRatio, gap, buffer) |
| `pageSize` | `number` | `50` | Items per page |
| `mapSize` | `(raw: any) => {width: number, height: number}` | - | Map dimensions |
| `renderInitialLoader` | `() => React.ReactNode` | - | Initial loading state (shown before layout type is determined) |
| `onLayoutTypeLoaded` | `(isMasonry: boolean) => void` | - | Layout type loaded callback |
| `onError` | `(error: Error) => void` | - | Error callback |

## 🎨 Custom Styling

### Custom Item Rendering

```tsx
<VirtualMasonry
  // ... other props
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
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '12px',
        background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
        color: 'white',
      }}>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </div>
    </div>
  )}
/>
```

## 🔧 Advanced Usage

### Data Mapping

If your data structure doesn't have `width` and `height` fields, use `mapSize`:

```tsx
<VirtualMasonry
  // ... other props
  mapSize={(item) => ({
    width: item.imageWidth,
    height: item.imageHeight,
  })}
/>
```

### Controlled Dynamic Layout

```tsx
function App() {
  const [isMasonry, setIsMasonry] = useState(true);

  return (
    <>
      <button onClick={() => setIsMasonry(!isMasonry)}>
        Switch Layout
      </button>
      <DynamicMasonryView
        isMasonry={isMasonry}
        // ... other props
      />
    </>
  );
}
```

## 🎯 Use Cases

- 📷 **Image Galleries** - Photo albums, image search results
- 🛍️ **E-commerce** - Product listings, shopping galleries
- 📰 **Content Feeds** - News feeds, blog posts, social media
- 🎨 **Portfolio Sites** - Design portfolios, artwork showcases
- 📱 **Media Libraries** - Video thumbnails, media collections

## 🚀 Performance

- **Virtual Scrolling**: Only renders visible items, handles 10,000+ items smoothly
- **Smart Preloading**: Loads next page before reaching the end
- **RAF Optimization**: Smooth 60fps scrolling
- **Responsive**: Automatically adapts to window resize
- **Memory Efficient**: Minimal memory footprint

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Inspired by:
- Pinterest's waterfall layout
- Google Photos' justified layout
- React Virtualized

---

Made with ❤️ by [Your Name]
