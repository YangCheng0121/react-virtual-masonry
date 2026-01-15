import React from "react";
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
export declare function VirtualMasonryCore({ items, renderItem, onLoadMore, minColumnWidth, maxColumnWidth, gap, buffer, hasMore, loading, loadMoreThreshold, }: VirtualMasonryCoreProps): React.JSX.Element;
export type VirtualMasonryProps = {
    mapSize?: (raw: any) => {
        width: number;
        height: number;
    };
    renderItem: (item: any, index: number) => React.ReactNode;
    enableAnimation?: boolean;
    loadData?: (page: number, pageSize: number) => Promise<{
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
export default function VirtualMasonry({ mapSize, renderItem, loadData, pageSize, minColumnWidth, maxColumnWidth, gap, buffer, loadMoreThreshold, }: VirtualMasonryProps): React.JSX.Element;
export {};
