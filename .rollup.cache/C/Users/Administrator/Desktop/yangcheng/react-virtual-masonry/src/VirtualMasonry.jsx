import { __assign, __spreadArray } from "tslib";
import React, { useState, useEffect, useRef, useMemo, useLayoutEffect, useCallback, } from "react";
// RAF 节流 Hook - 使用 requestAnimationFrame 优化滚动性能
function useRafThrottle(value) {
    var _a = useState(value), throttledValue = _a[0], setThrottledValue = _a[1];
    var rafRef = useRef(null);
    var valueRef = useRef(value);
    useEffect(function () {
        valueRef.current = value;
        if (rafRef.current !== null) {
            return;
        }
        rafRef.current = requestAnimationFrame(function () {
            setThrottledValue(valueRef.current);
            rafRef.current = null;
        });
        return function () {
            if (rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
        };
    }, [value]);
    return throttledValue;
}
// ==================== 布局算法 Hook ====================
function useMasonryLayout(items, containerWidth, minColumnWidth, maxColumnWidth, gap) {
    if (minColumnWidth === void 0) { minColumnWidth = 200; }
    if (gap === void 0) { gap = 16; }
    var columnCount = useMemo(function () {
        var cols = Math.max(1, Math.floor(containerWidth / minColumnWidth));
        if (maxColumnWidth) {
            var calculatedWidth = (containerWidth - gap * (cols - 1)) / cols;
            while (calculatedWidth > maxColumnWidth && cols < 20) {
                cols++;
                var newWidth = (containerWidth - gap * (cols - 1)) / cols;
                if (newWidth <= maxColumnWidth)
                    break;
            }
        }
        return cols;
    }, [containerWidth, minColumnWidth, maxColumnWidth, gap]);
    var layout = useMemo(function () {
        if (!containerWidth)
            return [];
        var columnHeights = Array(columnCount).fill(0);
        var columnWidth = (containerWidth - gap * (columnCount - 1)) / columnCount;
        if (maxColumnWidth && columnWidth > maxColumnWidth) {
            columnWidth = maxColumnWidth;
        }
        return items.map(function (item) {
            var minCol = columnHeights.indexOf(Math.min.apply(Math, columnHeights));
            var x = (columnWidth + gap) * minCol;
            var y = columnHeights[minCol];
            var aspectRatio = item.height / item.width;
            var scaledHeight = columnWidth * aspectRatio;
            columnHeights[minCol] += scaledHeight + gap;
            return __assign(__assign({}, item), { x: x, y: y, width: columnWidth, height: scaledHeight });
        });
    }, [items, columnCount, containerWidth, maxColumnWidth, gap]);
    var totalHeight = useMemo(function () {
        if (layout.length === 0)
            return 0;
        var columnHeights = Array(columnCount).fill(0);
        layout.forEach(function (item) {
            var colIndex = Math.round(item.x /
                ((containerWidth - gap * (columnCount - 1)) / columnCount + gap));
            columnHeights[colIndex] = Math.max(columnHeights[colIndex], item.y + item.height);
        });
        return Math.max.apply(Math, columnHeights);
    }, [layout, columnCount, containerWidth, gap]);
    return { layout: layout, totalHeight: totalHeight, columnCount: columnCount };
}
// ==================== 主组件 ====================
export function VirtualMasonryCore(_a) {
    var items = _a.items, renderItem = _a.renderItem, onLoadMore = _a.onLoadMore, _b = _a.minColumnWidth, minColumnWidth = _b === void 0 ? 200 : _b, maxColumnWidth = _a.maxColumnWidth, _c = _a.gap, gap = _c === void 0 ? 16 : _c, _d = _a.buffer, buffer = _d === void 0 ? 300 : _d, _e = _a.hasMore, hasMore = _e === void 0 ? true : _e, _f = _a.loading, loading = _f === void 0 ? false : _f, _g = _a.loadMoreThreshold, loadMoreThreshold = _g === void 0 ? 500 : _g;
    var _h = useState(0), containerWidth = _h[0], setContainerWidth = _h[1];
    var _j = useState(0), scrollTop = _j[0], setScrollTop = _j[1];
    var containerRef = useRef(null);
    var loadMoreTriggerRef = useRef(null);
    var throttledScrollTop = useRafThrottle(scrollTop);
    useLayoutEffect(function () {
        var container = containerRef.current;
        if (!container)
            return;
        var resizeObserver = new ResizeObserver(function () {
            setContainerWidth(container.clientWidth);
        });
        resizeObserver.observe(container);
        setContainerWidth(container.clientWidth);
        return function () { return resizeObserver.disconnect(); };
    }, []);
    var _k = useMasonryLayout(items, containerWidth, minColumnWidth, maxColumnWidth, gap), layout = _k.layout, totalHeight = _k.totalHeight;
    var handleScroll = useCallback(function () {
        if (!containerRef.current)
            return;
        // 使用 getBoundingClientRect 获取准确的容器位置
        var rect = containerRef.current.getBoundingClientRect();
        // rect.top 为负数表示容器顶部已滚出视口，取其绝对值即为已滚动距离
        var scrollTop = Math.max(0, -rect.top);
        setScrollTop(scrollTop);
    }, []);
    useEffect(function () {
        window.addEventListener("scroll", handleScroll, { passive: true });
        return function () { return window.removeEventListener("scroll", handleScroll); };
    }, [handleScroll]);
    useEffect(function () {
        if (!onLoadMore || !hasMore || loading)
            return;
        var trigger = loadMoreTriggerRef.current;
        if (!trigger)
            return;
        var observer = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting) {
                onLoadMore();
            }
        }, { rootMargin: "".concat(loadMoreThreshold, "px") });
        observer.observe(trigger);
        return function () { return observer.disconnect(); };
    }, [onLoadMore, hasMore, loading, loadMoreThreshold]);
    var visibleItems = useMemo(function () {
        return layout.filter(function (item) {
            var viewTop = throttledScrollTop - buffer;
            var viewBottom = throttledScrollTop + window.innerHeight + buffer;
            return item.y + item.height >= viewTop && item.y <= viewBottom;
        });
    }, [layout, throttledScrollTop, buffer]);
    return (<div ref={containerRef} style={{
            position: "relative",
            width: "100%",
            minHeight: totalHeight,
        }}>
      {visibleItems.map(function (item, index) { return renderItem(item, index); })}

      {onLoadMore && (<div ref={loadMoreTriggerRef} style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 1,
                pointerEvents: "none",
            }}/>)}
    </div>);
}
export default function VirtualMasonry(_a) {
    var mapSize = _a.mapSize, renderItem = _a.renderItem, loadData = _a.loadData, _b = _a.pageSize, pageSize = _b === void 0 ? 50 : _b, _c = _a.minColumnWidth, minColumnWidth = _c === void 0 ? 200 : _c, maxColumnWidth = _a.maxColumnWidth, _d = _a.gap, gap = _d === void 0 ? 16 : _d, _e = _a.buffer, buffer = _e === void 0 ? 1500 : _e, _f = _a.loadMoreThreshold, loadMoreThreshold = _f === void 0 ? 800 : _f;
    var _g = useState([]), items = _g[0], setItems = _g[1];
    var _h = useState(true), loading = _h[0], setLoading = _h[1]; // 初始设为 true，立即显示 Loader
    var _j = useState(true), hasMore = _j[0], setHasMore = _j[1];
    var _k = useState(1), page = _k[0], setPage = _k[1];
    // 防止重复初始加载
    var initialLoadRef = useRef(false);
    var defaultMapSize = function (d) {
        var _a, _b, _c, _d;
        return ({
            width: (_b = (_a = d.width) !== null && _a !== void 0 ? _a : d.w) !== null && _b !== void 0 ? _b : d.imgW,
            height: (_d = (_c = d.height) !== null && _c !== void 0 ? _c : d.h) !== null && _d !== void 0 ? _d : d.imgH,
        });
    };
    // 使用 ref 存储最新的函数引用，避免依赖变化
    var loadDataRef = useRef(loadData);
    var mapSizeRef = useRef(mapSize);
    useEffect(function () {
        loadDataRef.current = loadData;
        mapSizeRef.current = mapSize;
    }, [loadData, mapSize]);
    var handleLoadMore = useCallback(function (force) {
        if (force === void 0) { force = false; }
        // force 参数用于初始加载时跳过 loading 检查
        if (!force && loading)
            return;
        setLoading(true);
        if (loadDataRef.current) {
            loadDataRef
                .current(page, pageSize)
                .then(function (_a) {
                var _b;
                var data = _a.data, more = _a.hasMore;
                var effectiveMapSize = (_b = mapSizeRef.current) !== null && _b !== void 0 ? _b : defaultMapSize;
                setItems(function (prev) { return __spreadArray(__spreadArray([], prev, true), data.map(function (d) {
                    var _a = effectiveMapSize(d), width = _a.width, height = _a.height;
                    return __assign(__assign({}, d), { width: width, height: height, widthRatio: width / height });
                }), true); });
                setHasMore(more);
                setPage(function (prev) { return prev + 1; });
            })
                .catch(function (error) {
                console.error("Failed to load data:", error);
            })
                .finally(function () {
                setLoading(false);
            });
        }
    }, [loading, page, pageSize]);
    // 初始加载 - 使用 ref 防止重复调用
    useEffect(function () {
        if (!initialLoadRef.current && items.length === 0) {
            initialLoadRef.current = true;
            handleLoadMore(true); // 传入 force = true，跳过 loading 检查
        }
    }, [handleLoadMore, items.length]);
    return (<VirtualMasonryCore items={items} renderItem={renderItem} onLoadMore={handleLoadMore} minColumnWidth={minColumnWidth} maxColumnWidth={maxColumnWidth} gap={gap} buffer={buffer} hasMore={hasMore} loading={loading} loadMoreThreshold={loadMoreThreshold}/>);
}
//# sourceMappingURL=VirtualMasonry.jsx.map