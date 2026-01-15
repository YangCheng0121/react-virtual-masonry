import { __awaiter, __generator } from "tslib";
import React, { useState, useEffect, useCallback } from "react";
import VirtualMasonry from "./VirtualMasonry";
import FullWidthEqualHeightMasonry from "./FullWidthEqualHeightMasonry";
// ==================== 类型定义 ====================
/**
 * 视图类型枚举
 * 1 - 瀑布流(不等宽不等高)
 * 2 - 等高不等宽
 */
export var ViewType;
(function (ViewType) {
    ViewType[ViewType["WATERFALL"] = 1] = "WATERFALL";
    ViewType[ViewType["EQUAL_HEIGHT"] = 2] = "EQUAL_HEIGHT";
})(ViewType || (ViewType = {}));
// ==================== 主组件 ====================
/**
 * 动态瀑布流视图组件
 *
 * 支持两种视图模式:
 * 1. 瀑布流(不等宽不等高) - Pinterest 风格
 * 2. 等高不等宽 - Google Photos 风格
 */
export default function DynamicMasonryView(_a) {
    // ==================== 状态管理 ====================
    var _this = this;
    var controlledIsMasonry = _a.isMasonry, _b = _a.defaultIsMasonry, defaultIsMasonry = _b === void 0 ? true : _b, _c = _a.enableAnimation, enableAnimation = _c === void 0 ? true : _c, _d = _a.waterfallConfig, waterfallConfig = _d === void 0 ? {} : _d, _e = _a.equalHeightConfig, equalHeightConfig = _e === void 0 ? {} : _e, loadData = _a.loadData, _f = _a.pageSize, pageSize = _f === void 0 ? 50 : _f, renderItem = _a.renderItem, mapSize = _a.mapSize, renderInitialLoader = _a.renderInitialLoader, onLayoutTypeLoaded = _a.onLayoutTypeLoaded, onError = _a.onError;
    var _g = useState(controlledIsMasonry !== null && controlledIsMasonry !== void 0 ? controlledIsMasonry : null), isMasonry = _g[0], setIsMasonry = _g[1];
    var _h = useState(controlledIsMasonry === undefined), layoutTypeLoading = _h[0], setLayoutTypeLoading = _h[1];
    var _j = useState(null), firstPageData = _j[0], setFirstPageData = _j[1];
    var loadDataRef = React.useRef(loadData);
    var onLayoutTypeLoadedRef = React.useRef(onLayoutTypeLoaded);
    var onErrorRef = React.useRef(onError);
    React.useEffect(function () {
        loadDataRef.current = loadData;
        onLayoutTypeLoadedRef.current = onLayoutTypeLoaded;
        onErrorRef.current = onError;
    }, [loadData, onLayoutTypeLoaded, onError]);
    // ==================== 包装的数据加载函数 ====================
    var wrappedLoadData = useCallback(function (page, size) { return __awaiter(_this, void 0, void 0, function () {
        var cached, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!loadDataRef.current) {
                        return [2 /*return*/, { data: [], hasMore: false }];
                    }
                    if (page === 1 && firstPageData) {
                        cached = firstPageData;
                        setFirstPageData(null);
                        return [2 /*return*/, cached];
                    }
                    return [4 /*yield*/, loadDataRef.current(page, size)];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, {
                            data: result.data,
                            hasMore: result.hasMore,
                        }];
            }
        });
    }); }, [firstPageData]);
    // ==================== 初始化布局类型 ====================
    useEffect(function () {
        var _a;
        if (controlledIsMasonry !== undefined) {
            setIsMasonry(controlledIsMasonry);
            setLayoutTypeLoading(false);
            (_a = onLayoutTypeLoadedRef.current) === null || _a === void 0 ? void 0 : _a.call(onLayoutTypeLoadedRef, controlledIsMasonry);
        }
    }, [controlledIsMasonry]);
    var initializedRef = React.useRef(false);
    useEffect(function () {
        if (controlledIsMasonry !== undefined) {
            return;
        }
        if (initializedRef.current) {
            return;
        }
        var initializeLayoutType = function () { return __awaiter(_this, void 0, void 0, function () {
            var result, error_1;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 4, 5, 6]);
                        setLayoutTypeLoading(true);
                        initializedRef.current = true;
                        if (!loadDataRef.current) return [3 /*break*/, 2];
                        return [4 /*yield*/, loadDataRef.current(1, pageSize)];
                    case 1:
                        result = _e.sent();
                        setFirstPageData({
                            data: result.data,
                            hasMore: result.hasMore,
                        });
                        if (result.isMasonry !== undefined) {
                            setIsMasonry(result.isMasonry);
                            (_a = onLayoutTypeLoadedRef.current) === null || _a === void 0 ? void 0 : _a.call(onLayoutTypeLoadedRef, result.isMasonry);
                        }
                        else {
                            setIsMasonry(defaultIsMasonry);
                            (_b = onLayoutTypeLoadedRef.current) === null || _b === void 0 ? void 0 : _b.call(onLayoutTypeLoadedRef, defaultIsMasonry);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        setIsMasonry(defaultIsMasonry);
                        (_c = onLayoutTypeLoadedRef.current) === null || _c === void 0 ? void 0 : _c.call(onLayoutTypeLoadedRef, defaultIsMasonry);
                        _e.label = 3;
                    case 3: return [3 /*break*/, 6];
                    case 4:
                        error_1 = _e.sent();
                        console.error("Failed to load layout type:", error_1);
                        (_d = onErrorRef.current) === null || _d === void 0 ? void 0 : _d.call(onErrorRef, error_1);
                        setIsMasonry(defaultIsMasonry);
                        return [3 /*break*/, 6];
                    case 5:
                        setLayoutTypeLoading(false);
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        }); };
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
        return (<div style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}/>);
    }
    if (isMasonry) {
        return (<VirtualMasonry renderItem={function (item, index) { return renderItem(item, index, true); }} enableAnimation={enableAnimation} loadData={wrappedLoadData} pageSize={pageSize} minColumnWidth={waterfallConfig.minColumnWidth} maxColumnWidth={waterfallConfig.maxColumnWidth} gap={waterfallConfig.gap} buffer={waterfallConfig.buffer} mapSize={mapSize}/>);
    }
    return (<FullWidthEqualHeightMasonry renderItem={function (item, index) { return renderItem(item, index, false); }} enableAnimation={enableAnimation} loadData={wrappedLoadData} pageSize={pageSize} targetRowHeight={equalHeightConfig.targetRowHeight} sizeRange={equalHeightConfig.sizeRange} maxItemWidth={equalHeightConfig.maxItemWidth} maxStretchRatio={equalHeightConfig.maxStretchRatio} gap={equalHeightConfig.gap} buffer={equalHeightConfig.buffer} mapSize={mapSize}/>);
}
//# sourceMappingURL=DynamicMasonryView.jsx.map