import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useLayoutEffect,
  useCallback,
} from "react";

type VirtualMasonryCoreProps = {
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  onLoadMore?: () => void;
  minColumnWidth?: number;
  maxColumnWidth?: number;
  gap?: number;
  buffer?: number;
  hasMore?: boolean;
  loading?: boolean;
  loadMoreThreshold?: number;
};

// RAF 节流 Hook - 使用 requestAnimationFrame 优化滚动性能
function useRafThrottle<T>(value: T): T {
  const [throttledValue, setThrottledValue] = useState(value);
  const rafRef = useRef<number | null>(null);
  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;

    if (rafRef.current !== null) {
      return;
    }

    rafRef.current = requestAnimationFrame(() => {
      setThrottledValue(valueRef.current);
      rafRef.current = null;
    });

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [value]);

  return throttledValue;
}

// ==================== 布局算法 Hook ====================
function useMasonryLayout(
  items: any[],
  containerWidth: number,
  minColumnWidth = 200,
  maxColumnWidth?: number,
  gap = 16,
) {
  const columnCount = useMemo(() => {
    let cols = Math.max(1, Math.floor(containerWidth / minColumnWidth));

    if (maxColumnWidth) {
      const calculatedWidth = (containerWidth - gap * (cols - 1)) / cols;
      while (calculatedWidth > maxColumnWidth && cols < 20) {
        cols++;
        const newWidth = (containerWidth - gap * (cols - 1)) / cols;
        if (newWidth <= maxColumnWidth) break;
      }
    }

    return cols;
  }, [containerWidth, minColumnWidth, maxColumnWidth, gap]);

  const layout = useMemo(() => {
    if (!containerWidth) return [];
    const columnHeights = Array(columnCount).fill(0);
    let columnWidth = (containerWidth - gap * (columnCount - 1)) / columnCount;

    if (maxColumnWidth && columnWidth > maxColumnWidth) {
      columnWidth = maxColumnWidth;
    }

    return items.map((item) => {
      const minCol = columnHeights.indexOf(Math.min(...columnHeights));
      const x = (columnWidth + gap) * minCol;
      const y = columnHeights[minCol];

      const aspectRatio = item.height / item.width;
      const scaledHeight = columnWidth * aspectRatio;

      columnHeights[minCol] += scaledHeight + gap;

      return {
        ...item,
        x,
        y,
        width: columnWidth,
        height: scaledHeight,
      };
    });
  }, [items, columnCount, containerWidth, maxColumnWidth, gap]);

  const totalHeight = useMemo(() => {
    if (layout.length === 0) return 0;
    const columnHeights = Array(columnCount).fill(0);
    layout.forEach((item) => {
      const colIndex = Math.round(
        item.x /
          ((containerWidth - gap * (columnCount - 1)) / columnCount + gap),
      );
      columnHeights[colIndex] = Math.max(
        columnHeights[colIndex],
        item.y + item.height,
      );
    });
    return Math.max(...columnHeights);
  }, [layout, columnCount, containerWidth, gap]);

  return { layout, totalHeight, columnCount };
}

// ==================== 主组件 ====================
export function VirtualMasonryCore({
  items,
  renderItem,
  onLoadMore,
  minColumnWidth = 200,
  maxColumnWidth,
  gap = 16,
  buffer = 300,
  hasMore = true,
  loading = false,
  loadMoreThreshold = 500,
}: VirtualMasonryCoreProps) {
  const [containerWidth, setContainerWidth] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);

  const throttledScrollTop = useRafThrottle(scrollTop);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      setContainerWidth(container.clientWidth);
    });
    resizeObserver.observe(container);
    setContainerWidth(container.clientWidth);

    return () => resizeObserver.disconnect();
  }, []);

  const { layout, totalHeight } = useMasonryLayout(
    items,
    containerWidth,
    minColumnWidth,
    maxColumnWidth,
    gap,
  );

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    // 使用 getBoundingClientRect 获取准确的容器位置
    const rect = containerRef.current.getBoundingClientRect();
    // rect.top 为负数表示容器顶部已滚出视口，取其绝对值即为已滚动距离
    const scrollTop = Math.max(0, -rect.top);
    setScrollTop(scrollTop);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (!onLoadMore || !hasMore || loading) return;

    const trigger = loadMoreTriggerRef.current;
    if (!trigger) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { rootMargin: `${loadMoreThreshold}px` },
    );

    observer.observe(trigger);
    return () => observer.disconnect();
  }, [onLoadMore, hasMore, loading, loadMoreThreshold]);

  const visibleItems = useMemo(() => {
    return layout.filter((item) => {
      const viewTop = throttledScrollTop - buffer;
      const viewBottom = throttledScrollTop + window.innerHeight + buffer;
      return item.y + item.height >= viewTop && item.y <= viewBottom;
    });
  }, [layout, throttledScrollTop, buffer]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        minHeight: totalHeight,
      }}
    >
      {visibleItems.map((item, index) => renderItem(item, index))}

      {onLoadMore && (
        <div
          ref={loadMoreTriggerRef}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 1,
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}

export type VirtualMasonryProps = {
  mapSize?: (raw: any) => { width: number; height: number };
  renderItem: (item: any, index: number) => React.ReactNode;
  enableAnimation?: boolean;
  loadData?: (
    page: number,
    pageSize: number,
  ) => Promise<{
    data: any[];
    hasMore: boolean;
  }>;
  pageSize?: number;
  minColumnWidth?: number;
  maxColumnWidth?: number;
  gap?: number;
  buffer?: number;
  loadMoreThreshold?: number;
};

export default function VirtualMasonry({
  mapSize,
  renderItem,
  loadData,
  pageSize = 50,
  minColumnWidth = 200,
  maxColumnWidth,
  gap = 16,
  buffer = 1500,
  loadMoreThreshold = 800,
}: VirtualMasonryProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // 初始设为 true，立即显示 Loader
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  // 防止重复初始加载
  const initialLoadRef = useRef(false);

  const defaultMapSize = (d: any) => ({
    width: d.width ?? d.w ?? d.imgW,
    height: d.height ?? d.h ?? d.imgH,
  });

  // 使用 ref 存储最新的函数引用，避免依赖变化
  const loadDataRef = useRef(loadData);
  const mapSizeRef = useRef(mapSize);

  useEffect(() => {
    loadDataRef.current = loadData;
    mapSizeRef.current = mapSize;
  }, [loadData, mapSize]);

  const handleLoadMore = useCallback(
    (force = false) => {
      // force 参数用于初始加载时跳过 loading 检查
      if (!force && loading) return;

      setLoading(true);

      if (loadDataRef.current) {
        loadDataRef
          .current(page, pageSize)
          .then(({ data, hasMore: more }) => {
            const effectiveMapSize = mapSizeRef.current ?? defaultMapSize;

            setItems((prev) => [
              ...prev,
              ...data.map((d) => {
                const { width, height } = effectiveMapSize(d);
                return {
                  ...d,
                  width,
                  height,
                  widthRatio: width / height,
                };
              }),
            ]);
            setHasMore(more);
            setPage((prev) => prev + 1);
          })
          .catch((error) => {
            console.error("Failed to load data:", error);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    },
    [loading, page, pageSize],
  );

  // 初始加载 - 使用 ref 防止重复调用
  useEffect(() => {
    if (!initialLoadRef.current && items.length === 0) {
      initialLoadRef.current = true;
      handleLoadMore(true); // 传入 force = true，跳过 loading 检查
    }
  }, [handleLoadMore, items.length]);

  return (
    <VirtualMasonryCore
      items={items}
      renderItem={renderItem}
      onLoadMore={handleLoadMore}
      minColumnWidth={minColumnWidth}
      maxColumnWidth={maxColumnWidth}
      gap={gap}
      buffer={buffer}
      hasMore={hasMore}
      loading={loading}
      loadMoreThreshold={loadMoreThreshold}
    />
  );
}