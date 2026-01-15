import { __assign, __spreadArray } from "tslib";
import React, { useState, useEffect, useMemo, useRef, useLayoutEffect, useCallback, } from "react";
var GAP = 8;
// RAF 节流 Hook
function useRafThrottle(value) {
    var _a = useState(value), throttledValue = _a[0], setThrottledValue = _a[1];
    var rafRef = useRef();
    useEffect(function () {
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
        }
        rafRef.current = requestAnimationFrame(function () {
            setThrottledValue(value);
        });
        return function () {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [value]);
    return throttledValue;
}
// ==================== 布局算法 Hook ====================
function useFullWidthFillMasonry(items, containerWidth, targetRowHeight, gap, sizeRange, maxItemWidth, maxStretchRatio) {
    if (targetRowHeight === void 0) { targetRowHeight = 245; }
    if (gap === void 0) { gap = GAP; }
    if (sizeRange === void 0) { sizeRange = [230, 260]; }
    if (maxItemWidth === void 0) { maxItemWidth = 975; }
    if (maxStretchRatio === void 0) { maxStretchRatio = 1.5; }
    var layout = useMemo(function () {
        if (!containerWidth || items.length === 0)
            return [];
        var positioned = [];
        var minHeight = sizeRange[0], maxHeight = sizeRange[1];
        var y = 0;
        var i = 0;
        var _loop_1 = function () {
            var currentRow = [];
            var effectiveTargetRowHeight = targetRowHeight;
            if (i < items.length) {
                currentRow.push(items[i]);
                i++;
            }
            var isLastItem = i >= items.length;
            if (!isLastItem && currentRow.length === 1) {
                var firstItem = currentRow[0];
                var secondItem = items[i];
                var firstWidth = firstItem.widthRatio * targetRowHeight;
                var secondWidth = secondItem.widthRatio * targetRowHeight;
                var totalWidth = firstWidth + secondWidth + gap;
                if (totalWidth > containerWidth) {
                    effectiveTargetRowHeight =
                        (containerWidth - gap) /
                            (firstItem.widthRatio + secondItem.widthRatio);
                    effectiveTargetRowHeight = Math.min(effectiveTargetRowHeight, targetRowHeight);
                }
            }
            while (i < items.length) {
                var item = items[i];
                var idealWidth = item.widthRatio * effectiveTargetRowHeight;
                if (currentRow.length === 1) {
                    currentRow.push(item);
                    i++;
                }
                else {
                    var currentRowWidth = currentRow.reduce(function (sum, rowItem) {
                        return sum + rowItem.widthRatio * effectiveTargetRowHeight;
                    }, 0);
                    var totalWidthWithNew = currentRowWidth + idealWidth;
                    var totalGaps_1 = currentRow.length * gap;
                    var requiredWidth = totalWidthWithNew + totalGaps_1;
                    var currentTotalWidth = currentRowWidth + (currentRow.length - 1) * gap;
                    if (requiredWidth <= containerWidth) {
                        currentRow.push(item);
                        i++;
                    }
                    else {
                        var scaleWithNew = containerWidth / (totalWidthWithNew + totalGaps_1);
                        var scaleCurrent = containerWidth / currentTotalWidth;
                        if (Math.abs(scaleWithNew - 1) < Math.abs(scaleCurrent - 1) &&
                            scaleWithNew <= maxStretchRatio) {
                            currentRow.push(item);
                            i++;
                        }
                        break;
                    }
                }
            }
            var isLastRow = i >= items.length;
            var totalGaps = (currentRow.length - 1) * gap;
            var availableWidth = containerWidth - totalGaps;
            var idealTotalWidthForScale = currentRow.reduce(function (sum, item) {
                return sum + item.widthRatio * effectiveTargetRowHeight;
            }, 0);
            var scale = availableWidth / idealTotalWidthForScale;
            var adjustedRowHeight = effectiveTargetRowHeight * scale;
            if (isLastRow) {
                adjustedRowHeight = Math.min(Math.max(adjustedRowHeight, minHeight), targetRowHeight);
            }
            else {
                if (scale > maxStretchRatio) {
                    if (currentRow.length > 2) {
                        i--;
                        currentRow.pop();
                        var newTotalGaps = (currentRow.length - 1) * gap;
                        var newAvailableWidth = containerWidth - newTotalGaps;
                        var newIdealWidth = currentRow.reduce(function (sum, item) {
                            return sum + item.widthRatio * effectiveTargetRowHeight;
                        }, 0);
                        scale = newAvailableWidth / newIdealWidth;
                        adjustedRowHeight = effectiveTargetRowHeight * scale;
                    }
                }
                adjustedRowHeight = Math.min(Math.max(adjustedRowHeight, minHeight), maxHeight);
            }
            var x = 0;
            var idealWidths = currentRow.map(function (item) { return item.widthRatio * adjustedRowHeight; });
            var idealTotalWidth = idealWidths.reduce(function (sum, w) { return sum + w; }, 0);
            if (isLastRow) {
                var totalGapsWidth = (currentRow.length - 1) * gap;
                var totalRequiredWidth = idealTotalWidth + totalGapsWidth;
                if (totalRequiredWidth > containerWidth) {
                    var scale_1 = (containerWidth - totalGapsWidth) / idealTotalWidth;
                    var remainingWidth_1 = containerWidth;
                    currentRow.forEach(function (item, index) {
                        var isLast = index === currentRow.length - 1;
                        var finalWidth;
                        if (isLast) {
                            finalWidth = remainingWidth_1;
                        }
                        else {
                            finalWidth = Math.round(idealWidths[index] * scale_1);
                            finalWidth = Math.min(finalWidth, maxItemWidth);
                        }
                        positioned.push(__assign(__assign({}, item), { x: x, y: y, width: finalWidth, height: Math.round(adjustedRowHeight) }));
                        x += finalWidth + gap;
                        remainingWidth_1 -= finalWidth + gap;
                    });
                }
                else {
                    currentRow.forEach(function (item, index) {
                        var idealWidth = idealWidths[index];
                        var finalWidth = Math.min(Math.round(idealWidth), maxItemWidth);
                        positioned.push(__assign(__assign({}, item), { x: x, y: y, width: finalWidth, height: Math.round(adjustedRowHeight) }));
                        x += finalWidth + gap;
                    });
                }
            }
            else {
                var remainingWidth_2 = containerWidth;
                var accumulatedIdealWidth_1 = 0;
                currentRow.forEach(function (item, index) {
                    var isLast = index === currentRow.length - 1;
                    var finalWidth;
                    if (isLast) {
                        finalWidth = remainingWidth_2;
                    }
                    else {
                        var currentIdealWidth = idealWidths[index];
                        accumulatedIdealWidth_1 += currentIdealWidth;
                        var targetX = (accumulatedIdealWidth_1 / idealTotalWidth) * containerWidth -
                            index * gap;
                        finalWidth = Math.round(targetX - x);
                        finalWidth = Math.min(finalWidth, maxItemWidth);
                    }
                    positioned.push(__assign(__assign({}, item), { x: x, y: y, width: finalWidth, height: Math.round(adjustedRowHeight) }));
                    x += finalWidth + gap;
                    remainingWidth_2 -= finalWidth + gap;
                });
            }
            y += Math.round(adjustedRowHeight) + gap;
        };
        while (i < items.length) {
            _loop_1();
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
    var totalHeight = useMemo(function () {
        if (layout.length === 0)
            return 0;
        return layout.reduce(function (max, item) { return Math.max(max, item.y + item.height); }, 0);
    }, [layout]);
    return { layout: layout, totalHeight: totalHeight };
}
// ==================== 主组件 ====================
export function FullWidthEqualHeightMasonryCore(_a) {
    var items = _a.items, renderItem = _a.renderItem, onLoadMore = _a.onLoadMore, _b = _a.targetRowHeight, targetRowHeight = _b === void 0 ? 245 : _b, _c = _a.gap, gap = _c === void 0 ? GAP : _c, _d = _a.buffer, buffer = _d === void 0 ? 1000 : _d, _e = _a.hasMore, hasMore = _e === void 0 ? true : _e, _f = _a.loading, loading = _f === void 0 ? false : _f, _g = _a.sizeRange, sizeRange = _g === void 0 ? [230, 260] : _g, _h = _a.maxItemWidth, maxItemWidth = _h === void 0 ? 975 : _h, _j = _a.maxStretchRatio, maxStretchRatio = _j === void 0 ? 1.5 : _j, _k = _a.loadMoreThreshold, loadMoreThreshold = _k === void 0 ? 800 : _k;
    var _l = useState(0), containerWidth = _l[0], setContainerWidth = _l[1];
    var _m = useState(0), scrollTop = _m[0], setScrollTop = _m[1];
    var containerRef = useRef(null);
    var loadMoreTriggerRef = useRef(null);
    var _o = useState(0), containerOffsetTop = _o[0], setContainerOffsetTop = _o[1];
    var throttledScrollTop = useRafThrottle(scrollTop);
    useLayoutEffect(function () {
        if (!containerRef.current)
            return;
        setContainerOffsetTop(containerRef.current.offsetTop);
        var ro = new ResizeObserver(function () {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.clientWidth);
            }
        });
        ro.observe(containerRef.current);
        setContainerWidth(containerRef.current.clientWidth);
        return function () { return ro.disconnect(); };
    }, []);
    var _p = useFullWidthFillMasonry(items, containerWidth, targetRowHeight, gap, sizeRange, maxItemWidth, maxStretchRatio), layout = _p.layout, totalHeight = _p.totalHeight;
    var handleScroll = useCallback(function () {
        var scrollY = window.scrollY || window.pageYOffset;
        setScrollTop(Math.max(0, scrollY - containerOffsetTop));
    }, [containerOffsetTop]);
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
        return layout
            .map(function (item, originalIndex) { return (__assign(__assign({}, item), { originalIndex: originalIndex })); })
            .filter(function (item) {
            var viewTop = throttledScrollTop - buffer;
            var viewBottom = throttledScrollTop + window.innerHeight + buffer;
            return item.y + item.height >= viewTop && item.y <= viewBottom;
        });
    }, [layout, throttledScrollTop, buffer]);
    return (React.createElement("div", { ref: containerRef, style: {
            position: "relative",
            width: "100%",
            minHeight: totalHeight,
        } },
        visibleItems.map(function (item) { return (React.createElement(React.Fragment, { key: item.originalIndex }, renderItem(item, item.originalIndex))); }),
        onLoadMore && (React.createElement("div", { ref: loadMoreTriggerRef, style: {
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 1,
                pointerEvents: "none",
            } }))));
}
export default function FullWidthEqualHeightMasonry(_a) {
    var mapSize = _a.mapSize, renderItem = _a.renderItem, _b = _a.enableAnimation, _enableAnimation = _b === void 0 ? true : _b, loadData = _a.loadData, _c = _a.pageSize, pageSize = _c === void 0 ? 50 : _c, _d = _a.targetRowHeight, targetRowHeight = _d === void 0 ? 245 : _d, _e = _a.sizeRange, sizeRange = _e === void 0 ? [230, 260] : _e, _f = _a.maxItemWidth, maxItemWidth = _f === void 0 ? 975 : _f, _g = _a.maxStretchRatio, maxStretchRatio = _g === void 0 ? 1.5 : _g, _h = _a.gap, gap = _h === void 0 ? GAP : _h, _j = _a.buffer, buffer = _j === void 0 ? 1500 : _j, _k = _a.loadMoreThreshold, loadMoreThreshold = _k === void 0 ? 500 : _k;
    var _l = useState([]), items = _l[0], setItems = _l[1];
    var _m = useState(true), loading = _m[0], setLoading = _m[1]; // 初始设为 true，立即显示 Loader
    var _o = useState(true), hasMore = _o[0], setHasMore = _o[1];
    var _p = useState(1), page = _p[0], setPage = _p[1];
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
    return (React.createElement(FullWidthEqualHeightMasonryCore, { items: items, renderItem: renderItem, onLoadMore: handleLoadMore, targetRowHeight: targetRowHeight, sizeRange: sizeRange, maxItemWidth: maxItemWidth, maxStretchRatio: maxStretchRatio, gap: gap, buffer: buffer, hasMore: hasMore, loading: loading, loadMoreThreshold: loadMoreThreshold }));
}
//# sourceMappingURL=FullWidthEqualHeightMasonry.js.map