import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";

type FullWidthEqualHeightMasonryCoreProps = {
  items: any[];
  renderItem: (
    item: {
      x: number;
      y: number;
      width: number;
      height: number;
      [key: string]: any;
    },
    index: number,
  ) => React.ReactNode;
  onLoadMore?: () => void;
  targetRowHeight?: number;
  gap?: number;
  buffer?: number;
  hasMore?: boolean;
  loading?: boolean;
  sizeRange?: [number, number];
  maxItemWidth?: number;
  maxStretchRatio?: number;
  loadMoreThreshold?: number;
};

const GAP = 8;

// RAF 节流 Hook
function useRafThrottle<T>(value: T): T {
  const [throttledValue, setThrottledValue] = useState(value);
  const rafRef = useRef<number>();

  useEffect(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      setThrottledValue(value);
    });

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [value]);

  return throttledValue;
}

// ==================== 布局算法 Hook ====================
function useFullWidthFillMasonry(
  items: any[],
  containerWidth: number,
  targetRowHeight = 245,
  gap = GAP,
  sizeRange: [number, number] = [230, 260],
  maxItemWidth = 975,
  maxStretchRatio = 1.5,
) {
  const layout = useMemo(() => {
    if (!containerWidth || items.length === 0) return [];

    const positioned: any[] = [];
    const [minHeight, maxHeight] = sizeRange;
    let y = 0;

    let i = 0;

    while (i < items.length) {
      let currentRow: any[] = [];

      let effectiveTargetRowHeight = targetRowHeight;

      if (i < items.length) {
        currentRow.push(items[i]);
        i++;
      }

      const isLastItem = i >= items.length;
      if (!isLastItem && currentRow.length === 1) {
        const firstItem = currentRow[0];
        const secondItem = items[i];

        let firstWidth = firstItem.widthRatio * targetRowHeight;
        let secondWidth = secondItem.widthRatio * targetRowHeight;
        let totalWidth = firstWidth + secondWidth + gap;

        if (totalWidth > containerWidth) {
          effectiveTargetRowHeight =
            (containerWidth - gap) /
            (firstItem.widthRatio + secondItem.widthRatio);

          effectiveTargetRowHeight = Math.min(
            effectiveTargetRowHeight,
            targetRowHeight,
          );
        }
      }

      while (i < items.length) {
        const item = items[i];
        const idealWidth = item.widthRatio * effectiveTargetRowHeight;

        if (currentRow.length === 1) {
          currentRow.push(item);
          i++;
        } else {
          const currentRowWidth = currentRow.reduce((sum, rowItem) => {
            return sum + rowItem.widthRatio * effectiveTargetRowHeight;
          }, 0);

          const totalWidthWithNew = currentRowWidth + idealWidth;
          const totalGaps = currentRow.length * gap;

          const requiredWidth = totalWidthWithNew + totalGaps;

          const currentTotalWidth =
            currentRowWidth + (currentRow.length - 1) * gap;

          if (requiredWidth <= containerWidth) {
            currentRow.push(item);
            i++;
          } else {
            const scaleWithNew =
              containerWidth / (totalWidthWithNew + totalGaps);
            const scaleCurrent = containerWidth / currentTotalWidth;

            if (
              Math.abs(scaleWithNew - 1) < Math.abs(scaleCurrent - 1) &&
              scaleWithNew <= maxStretchRatio
            ) {
              currentRow.push(item);
              i++;
            }
            break;
          }
        }
      }

      const isLastRow = i >= items.length;
      const totalGaps = (currentRow.length - 1) * gap;
      const availableWidth = containerWidth - totalGaps;

      const idealTotalWidthForScale = currentRow.reduce((sum, item) => {
        return sum + item.widthRatio * effectiveTargetRowHeight;
      }, 0);

      let scale = availableWidth / idealTotalWidthForScale;

      let adjustedRowHeight = effectiveTargetRowHeight * scale;

      if (isLastRow) {
        adjustedRowHeight = Math.min(
          Math.max(adjustedRowHeight, minHeight),
          targetRowHeight,
        );
      } else {
        if (scale > maxStretchRatio) {
          if (currentRow.length > 2) {
            i--;
            currentRow.pop();

            const newTotalGaps = (currentRow.length - 1) * gap;
            const newAvailableWidth = containerWidth - newTotalGaps;
            const newIdealWidth = currentRow.reduce((sum, item) => {
              return sum + item.widthRatio * effectiveTargetRowHeight;
            }, 0);
            scale = newAvailableWidth / newIdealWidth;
            adjustedRowHeight = effectiveTargetRowHeight * scale;
          }
        }

        adjustedRowHeight = Math.min(
          Math.max(adjustedRowHeight, minHeight),
          maxHeight,
        );
      }

      let x = 0;

      const idealWidths = currentRow.map(
        (item) => item.widthRatio * adjustedRowHeight,
      );

      const idealTotalWidth = idealWidths.reduce((sum, w) => sum + w, 0);

      if (isLastRow) {
        const totalGapsWidth = (currentRow.length - 1) * gap;
        const totalRequiredWidth = idealTotalWidth + totalGapsWidth;

        if (totalRequiredWidth > containerWidth) {
          const scale = (containerWidth - totalGapsWidth) / idealTotalWidth;
          let remainingWidth = containerWidth;

          currentRow.forEach((item, index) => {
            const isLast = index === currentRow.length - 1;
            let finalWidth: number;

            if (isLast) {
              finalWidth = remainingWidth;
            } else {
              finalWidth = Math.round(idealWidths[index] * scale);
              finalWidth = Math.min(finalWidth, maxItemWidth);
            }

            positioned.push({
              ...item,
              x,
              y,
              width: finalWidth,
              height: Math.round(adjustedRowHeight),
            });

            x += finalWidth + gap;
            remainingWidth -= finalWidth + gap;
          });
        } else {
          currentRow.forEach((item, index) => {
            const idealWidth = idealWidths[index];
            const finalWidth = Math.min(Math.round(idealWidth), maxItemWidth);

            positioned.push({
              ...item,
              x,
              y,
              width: finalWidth,
              height: Math.round(adjustedRowHeight),
            });

            x += finalWidth + gap;
          });
        }
      } else {
        let remainingWidth = containerWidth;
        let accumulatedIdealWidth = 0;

        currentRow.forEach((item, index) => {
          const isLast = index === currentRow.length - 1;
          let finalWidth: number;

          if (isLast) {
            finalWidth = remainingWidth;
          } else {
            const currentIdealWidth = idealWidths[index];
            accumulatedIdealWidth += currentIdealWidth;

            const targetX =
              (accumulatedIdealWidth / idealTotalWidth) * containerWidth -
              index * gap;

            finalWidth = Math.round(targetX - x);

            finalWidth = Math.min(finalWidth, maxItemWidth);
          }

          positioned.push({
            ...item,
            x,
            y,
            width: finalWidth,
            height: Math.round(adjustedRowHeight),
          });

          x += finalWidth + gap;
          remainingWidth -= finalWidth + gap;
        });
      }

      y += Math.round(adjustedRowHeight) + gap;
    }

    return positioned;
  }, [
    items,
    containerWidth,
    targetRowHeight,
    gap,
    sizeRange,
    maxItemWidth,
    maxStretchRatio,
  ]);

  const totalHeight = useMemo(() => {
    if (layout.length === 0) return 0;
    return layout.reduce((max, item) => Math.max(max, item.y + item.height), 0);
  }, [layout]);

  return { layout, totalHeight };
}

// ==================== 主组件 ====================
export function FullWidthEqualHeightMasonryCore({
  items,
  renderItem,
  onLoadMore,
  targetRowHeight = 245,
  gap = GAP,
  buffer = 1000,
  hasMore = true,
  loading = false,
  sizeRange = [230, 260],
  maxItemWidth = 975,
  maxStretchRatio = 1.5,
  loadMoreThreshold = 800,
}: FullWidthEqualHeightMasonryCoreProps) {
  const [containerWidth, setContainerWidth] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);
  const [containerOffsetTop, setContainerOffsetTop] = useState(0);

  const throttledScrollTop = useRafThrottle(scrollTop);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    setContainerOffsetTop(containerRef.current.offsetTop);

    const ro = new ResizeObserver(() => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    });

    ro.observe(containerRef.current);
    setContainerWidth(containerRef.current.clientWidth);

    return () => ro.disconnect();
  }, []);

  const { layout, totalHeight } = useFullWidthFillMasonry(
    items,
    containerWidth,
    targetRowHeight,
    gap,
    sizeRange,
    maxItemWidth,
    maxStretchRatio,
  );

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY || window.pageYOffset;
    setScrollTop(Math.max(0, scrollY - containerOffsetTop));
  }, [containerOffsetTop]);

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
    return layout
      .map((item, originalIndex) => ({ ...item, originalIndex }))
      .filter((item) => {
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
      {visibleItems.map((item) => (
        <React.Fragment key={item.originalIndex}>
          {renderItem(item, item.originalIndex)}
        </React.Fragment>
      ))}

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

// ==================== Props 类型定义 ====================
type FullWidthEqualHeightMasonryProps = {
  mapSize?: (raw: any) => { width: number; height: number };
  renderItem: (
    item: {
      x: number;
      y: number;
      width: number;
      height: number;
      [key: string]: any;
    },
    index: number,
  ) => React.ReactNode;
  enableAnimation?: boolean;
  loadData?: (
    page: number,
    pageSize: number,
  ) => Promise<{
    data: any[];
    hasMore: boolean;
  }>;
  pageSize?: number;
  targetRowHeight?: number;
  sizeRange?: [number, number];
  maxItemWidth?: number;
  maxStretchRatio?: number;
  gap?: number;
  buffer?: number;
  loadMoreThreshold?: number;
};

export default function FullWidthEqualHeightMasonry({
  mapSize,
  renderItem,
  enableAnimation: _enableAnimation = true,
  loadData,
  pageSize = 50,
  targetRowHeight = 245,
  sizeRange = [230, 260],
  maxItemWidth = 975,
  maxStretchRatio = 1.5,
  gap = GAP,
  buffer = 1500,
  loadMoreThreshold = 500,
}: FullWidthEqualHeightMasonryProps) {
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
    <FullWidthEqualHeightMasonryCore
      items={items}
      renderItem={renderItem}
      onLoadMore={handleLoadMore}
      targetRowHeight={targetRowHeight}
      sizeRange={sizeRange}
      maxItemWidth={maxItemWidth}
      maxStretchRatio={maxStretchRatio}
      gap={gap}
      buffer={buffer}
      hasMore={hasMore}
      loading={loading}
      loadMoreThreshold={loadMoreThreshold}
    />
  );
}