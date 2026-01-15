import React from "react";
type FullWidthEqualHeightMasonryCoreProps = {
    items: any[];
    renderItem: (item: {
        x: number;
        y: number;
        width: number;
        height: number;
        [key: string]: any;
    }, index: number) => React.ReactNode;
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
export declare function FullWidthEqualHeightMasonryCore({ items, renderItem, onLoadMore, targetRowHeight, gap, buffer, hasMore, loading, sizeRange, maxItemWidth, maxStretchRatio, loadMoreThreshold, }: FullWidthEqualHeightMasonryCoreProps): React.JSX.Element;
type FullWidthEqualHeightMasonryProps = {
    mapSize?: (raw: any) => {
        width: number;
        height: number;
    };
    renderItem: (item: {
        x: number;
        y: number;
        width: number;
        height: number;
        [key: string]: any;
    }, index: number) => React.ReactNode;
    enableAnimation?: boolean;
    loadData?: (page: number, pageSize: number) => Promise<{
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
export default function FullWidthEqualHeightMasonry({ mapSize, renderItem, enableAnimation: _enableAnimation, loadData, pageSize, targetRowHeight, sizeRange, maxItemWidth, maxStretchRatio, gap, buffer, loadMoreThreshold, }: FullWidthEqualHeightMasonryProps): React.JSX.Element;
export {};
