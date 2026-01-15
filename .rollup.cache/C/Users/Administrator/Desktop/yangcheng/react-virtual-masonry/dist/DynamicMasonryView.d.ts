import React from "react";
/**
 * 视图类型枚举
 * 1 - 瀑布流(不等宽不等高)
 * 2 - 等高不等宽
 */
export declare enum ViewType {
    WATERFALL = 1,
    EQUAL_HEIGHT = 2
}
/**
 * 数据加载函数
 * 第一次调用时(page === 1)会返回布局类型
 * 后续调用不返回布局类型
 */
export type LoadDataFn<T = any> = (page: number, pageSize: number) => Promise<{
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
    mapSize?: (raw: any) => {
        width: number;
        height: number;
    };
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
/**
 * 动态瀑布流视图组件
 *
 * 支持两种视图模式:
 * 1. 瀑布流(不等宽不等高) - Pinterest 风格
 * 2. 等高不等宽 - Google Photos 风格
 */
export default function DynamicMasonryView<T = any>({ isMasonry: controlledIsMasonry, defaultIsMasonry, enableAnimation, waterfallConfig, equalHeightConfig, loadData, pageSize, renderItem, mapSize, renderInitialLoader, onLayoutTypeLoaded, onError, }: DynamicMasonryViewProps<T>): React.JSX.Element;
