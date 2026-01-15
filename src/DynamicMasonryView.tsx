import React, { useState, useEffect, useCallback } from "react";
import VirtualMasonry from "./VirtualMasonry";
import FullWidthEqualHeightMasonry from "./FullWidthEqualHeightMasonry";

// ==================== 类型定义 ====================

/**
 * 视图类型枚举
 * 1 - 瀑布流(不等宽不等高)
 * 2 - 等高不等宽
 */
export enum ViewType {
  WATERFALL = 1,
  EQUAL_HEIGHT = 2,
}

/**
 * 数据加载函数
 * 第一次调用时(page === 1)会返回布局类型
 * 后续调用不返回布局类型
 */
export type LoadDataFn<T = any> = (
  page: number,
  pageSize: number,
) => Promise<{
  data: T[];
  hasMore: boolean;
  isMasonry?: boolean;
}>;

/**
 * 组件 Props
 */
export interface DynamicMasonryViewProps<T = any> {
  /**
   * 是否使用瀑布流布局(受控模式)
   */
  isMasonry?: boolean;

  /**
   * 默认是否使用瀑布流布局(非受控模式)
   */
  defaultIsMasonry?: boolean;

  /**
   * 是否启用动画
   */
  enableAnimation?: boolean;

  /**
   * 映射宽高
   */
  mapSize?: (raw: any) => { width: number; height: number };

  /**
   * 瀑布流配置
   */
  waterfallConfig?: {
    minColumnWidth?: number;
    maxColumnWidth?: number;
    gap?: number;
    buffer?: number;
  };

  /**
   * 等高不等宽配置
   */
  equalHeightConfig?: {
    targetRowHeight?: number;
    sizeRange?: [number, number];
    maxItemWidth?: number;
    maxStretchRatio?: number;
    gap?: number;
    buffer?: number;
  };

  /**
   * 自定义初始加载状态
   */
  renderInitialLoader?: () => React.ReactNode;

  /**
   * 自定义数据加载函数
   */
  loadData?: LoadDataFn<T>;

  /**
   * 每页数据条数
   */
  pageSize?: number;

  /**
   * 自定义渲染项
   */
  renderItem: (item: any, index: number, isMasonry: boolean) => React.ReactNode;

  /**
   * 布局类型加载完成回调
   */
  onLayoutTypeLoaded?: (isMasonry: boolean) => void;

  /**
   * 数据加载错误回调
   */
  onError?: (error: Error) => void;
}

// ==================== 主组件 ====================

/**
 * 动态瀑布流视图组件
 *
 * 支持两种视图模式:
 * 1. 瀑布流(不等宽不等高) - Pinterest 风格
 * 2. 等高不等宽 - Google Photos 风格
 */
export default function DynamicMasonryView<T = any>({
  isMasonry: controlledIsMasonry,
  defaultIsMasonry = true,
  enableAnimation = true,
  waterfallConfig = {},
  equalHeightConfig = {},
  loadData,
  pageSize = 50,
  renderItem,
  mapSize,
  renderInitialLoader,
  onLayoutTypeLoaded,
  onError,
}: DynamicMasonryViewProps<T>) {
  // ==================== 状态管理 ====================

  const [isMasonry, setIsMasonry] = useState<boolean | null>(
    controlledIsMasonry ?? null,
  );
  const [layoutTypeLoading, setLayoutTypeLoading] = useState(
    controlledIsMasonry === undefined,
  );
  const [firstPageData, setFirstPageData] = useState<{
    data: T[];
    hasMore: boolean;
  } | null>(null);

  const loadDataRef = React.useRef(loadData);
  const onLayoutTypeLoadedRef = React.useRef(onLayoutTypeLoaded);
  const onErrorRef = React.useRef(onError);

  React.useEffect(() => {
    loadDataRef.current = loadData;
    onLayoutTypeLoadedRef.current = onLayoutTypeLoaded;
    onErrorRef.current = onError;
  }, [loadData, onLayoutTypeLoaded, onError]);

  // ==================== 包装的数据加载函数 ====================

  const wrappedLoadData = useCallback(
    async (page: number, size: number) => {
      if (!loadDataRef.current) {
        return { data: [], hasMore: false };
      }

      if (page === 1 && firstPageData) {
        const cached = firstPageData;
        setFirstPageData(null);
        return cached;
      }

      const result = await loadDataRef.current(page, size);

      return {
        data: result.data,
        hasMore: result.hasMore,
      };
    },
    [firstPageData],
  );

  // ==================== 初始化布局类型 ====================

  useEffect(() => {
    if (controlledIsMasonry !== undefined) {
      setIsMasonry(controlledIsMasonry);
      setLayoutTypeLoading(false);
      onLayoutTypeLoadedRef.current?.(controlledIsMasonry);
    }
  }, [controlledIsMasonry]);

  const initializedRef = React.useRef(false);

  useEffect(() => {
    if (controlledIsMasonry !== undefined) {
      return;
    }

    if (initializedRef.current) {
      return;
    }

    const initializeLayoutType = async () => {
      try {
        setLayoutTypeLoading(true);
        initializedRef.current = true;

        if (loadDataRef.current) {
          const result = await loadDataRef.current(1, pageSize);

          setFirstPageData({
            data: result.data,
            hasMore: result.hasMore,
          });

          if (result.isMasonry !== undefined) {
            setIsMasonry(result.isMasonry);
            onLayoutTypeLoadedRef.current?.(result.isMasonry);
          } else {
            setIsMasonry(defaultIsMasonry);
            onLayoutTypeLoadedRef.current?.(defaultIsMasonry);
          }
        } else {
          setIsMasonry(defaultIsMasonry);
          onLayoutTypeLoadedRef.current?.(defaultIsMasonry);
        }
      } catch (error) {
        console.error("Failed to load layout type:", error);
        onErrorRef.current?.(error as Error);
        setIsMasonry(defaultIsMasonry);
      } finally {
        setLayoutTypeLoading(false);
      }
    };

    initializeLayoutType();
    // 只在 controlledIsMasonry, pageSize 变化时重新初始化
    // 移除 defaultIsMasonry 依赖，避免接口返回后更新 layoutType 导致重复初始化
    // loadData 等函数通过 ref 访问，不需要作为依赖项
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlledIsMasonry, pageSize]);

  // ==================== 渲染逻辑 ====================

  if (layoutTypeLoading || isMasonry === null) {
    // 使用自定义初始加载状态，或使用默认占位符
    if (renderInitialLoader) {
      return <>{renderInitialLoader()}</>;
    }
    // 默认占位符
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      />
    );
  }

  if (isMasonry) {
    return (
      <VirtualMasonry
        renderItem={(item, index) => renderItem(item, index, true)}
        enableAnimation={enableAnimation}
        loadData={wrappedLoadData}
        pageSize={pageSize}
        minColumnWidth={waterfallConfig.minColumnWidth}
        maxColumnWidth={waterfallConfig.maxColumnWidth}
        gap={waterfallConfig.gap}
        buffer={waterfallConfig.buffer}
        mapSize={mapSize}
      />
    );
  }

  return (
    <FullWidthEqualHeightMasonry
      renderItem={(item, index) => renderItem(item, index, false)}
      enableAnimation={enableAnimation}
      loadData={wrappedLoadData}
      pageSize={pageSize}
      targetRowHeight={equalHeightConfig.targetRowHeight}
      sizeRange={equalHeightConfig.sizeRange}
      maxItemWidth={equalHeightConfig.maxItemWidth}
      maxStretchRatio={equalHeightConfig.maxStretchRatio}
      gap={equalHeightConfig.gap}
      buffer={equalHeightConfig.buffer}
      mapSize={mapSize}
    />
  );
}