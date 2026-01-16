export type Language = "en" | "zh";

export interface Translations {
  header: {
    title: string;
    waterfall: string;
    equalHeight: string;
    dynamic: string;
  };
  waterfall: {
    title: string;
    description: string;
    showCode: string;
    hideCode: string;
  };
  equalHeight: {
    title: string;
    description: string;
    showCode: string;
    hideCode: string;
  };
  dynamic: {
    title: string;
    description: string;
    currentLayout: string;
    waterfallBtn: string;
    equalHeightBtn: string;
    showCode: string;
    hideCode: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    header: {
      title: "React Virtual Masonry Gallery",
      waterfall: "Waterfall Layout",
      equalHeight: "Equal Height Layout",
      dynamic: "Dynamic Layout",
    },
    waterfall: {
      title: "Waterfall Layout (Pinterest Style)",
      description:
        "Variable width and height waterfall layout with virtual scrolling and infinite loading",
      showCode: "Show Code",
      hideCode: "Hide Code",
    },
    equalHeight: {
      title: "Equal Height Layout (Google Photos Style)",
      description:
        "Same height per row, width adapts to original aspect ratio to fill the entire row",
      showCode: "Show Code",
      hideCode: "Hide Code",
    },
    dynamic: {
      title: "Dynamic Layout Switching",
      description:
        "Automatically switch layout types based on API response, or manually control",
      currentLayout: "Current Layout:",
      waterfallBtn: "Waterfall",
      equalHeightBtn: "Equal Height",
      showCode: "Show Code",
      hideCode: "Hide Code",
    },
  },
  zh: {
    header: {
      title: "React Virtual Masonry 图片画廊",
      waterfall: "瀑布流布局",
      equalHeight: "等高布局",
      dynamic: "动态布局",
    },
    waterfall: {
      title: "瀑布流布局 (Pinterest 风格)",
      description: "不等宽不等高的瀑布流布局,支持虚拟滚动和无限加载",
      showCode: "显示代码",
      hideCode: "隐藏代码",
    },
    equalHeight: {
      title: "等高布局 (Google Photos 风格)",
      description: "每行高度相同,宽度根据原始比例自动调整以填满整行",
      showCode: "显示代码",
      hideCode: "隐藏代码",
    },
    dynamic: {
      title: "动态布局切换",
      description: "可以根据接口返回的数据自动切换布局类型,也可以手动控制",
      currentLayout: "当前布局:",
      waterfallBtn: "瀑布流",
      equalHeightBtn: "等高布局",
      showCode: "显示代码",
      hideCode: "隐藏代码",
    },
  },
};