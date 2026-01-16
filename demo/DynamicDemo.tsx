import { useState } from "react";
import DynamicMasonryView from "../src/DynamicMasonryView";
import { loadImageData } from "./imageData";
import CodeBlock from "./CodeBlock";
import { useI18n } from "./App";
import React from "react";

const codeExample = `import { DynamicMasonryView } from 'react-virtual-masonry';

function Gallery() {
  const [layoutType, setLayoutType] = useState(true); // true=waterfall, false=equal-height

  const loadData = async (page: number, pageSize: number) => {
    const response = await fetch(\`/api/gallery?page=\${page}&size=\${pageSize}\`);
    const data = await response.json();

    // First request returns layout type
    if (page === 1) {
      return {
        data: data.items,
        hasMore: data.hasMore,
        isMasonry: layoutType,
      };
    }

    return {
      data: data.items,
      hasMore: data.hasMore,
    };
  };

  return (
    <DynamicMasonryView
      isMasonry={layoutType}
      loadData={loadData}
      pageSize={30}
      waterfallConfig={{
        minColumnWidth: 200,
        maxColumnWidth: 350,
        gap: 16,
      }}
      equalHeightConfig={{
        targetRowHeight: 245,
        sizeRange: [230, 260],
        gap: 8,
      }}
      renderItem={(item, index, isMasonry) => (
        <div
          style={{
            position: 'absolute',
            left: item.x,
            top: item.y,
            width: item.width,
            height: item.height,
          }}
        >
          <img src={item.url} alt={item.title} />
        </div>
      )}
    />
  );
}`;

export default function DynamicDemo() {
  const [layoutType, setLayoutType] = useState<boolean>(true); // true=瀑布流, false=等高
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [showCode, setShowCode] = useState(false);
  const {t} = useI18n();

  const loadData = async (page: number, pageSize: number) => {
    const result = await loadImageData(page, pageSize);

    // 第一次加载时返回布局类型
    if (page === 1) {
      return {...result, isMasonry: layoutType};
    }

    return result;
  };

  const handleImageError = (id: number) => {
    setImageErrors((prev) => new Set(prev).add(id));
  };

  return (
    <div>
      <div
        style={{
          background: "#f5f5f5",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "15px",
          }}
        >
          <div>
            <h2 style={{margin: "0 0 10px 0", fontSize: "18px"}}>
              {t.dynamic.title}
            </h2>
            <p style={{margin: "0 0 15px 0", color: "#666", fontSize: "14px"}}>
              {t.dynamic.description}
            </p>
          </div>
          <button
            onClick={() => setShowCode(!showCode)}
            style={{
              padding: "8px 16px",
              background: showCode ? "#2c3e50" : "#3498db",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              whiteSpace: "nowrap",
            }}
          >
            {showCode ? t.dynamic.hideCode : t.dynamic.showCode}
          </button>
        </div>

        <div style={{display: "flex", gap: "10px", alignItems: "center"}}>
          <span style={{fontWeight: "500"}}>{t.dynamic.currentLayout}</span>
          <button
            onClick={() => setLayoutType(true)}
            style={{
              padding: "8px 16px",
              border: "1px solid #3498db",
              borderRadius: "4px",
              background: layoutType ? "#3498db" : "white",
              color: layoutType ? "white" : "#3498db",
              cursor: "pointer",
            }}
          >
            {t.dynamic.waterfallBtn}
          </button>
          <button
            onClick={() => setLayoutType(false)}
            style={{
              padding: "8px 16px",
              border: "1px solid #3498db",
              borderRadius: "4px",
              background: !layoutType ? "#3498db" : "white",
              color: !layoutType ? "white" : "#3498db",
              cursor: "pointer",
            }}
          >
            {t.dynamic.equalHeightBtn}
          </button>
        </div>
      </div>

      {showCode && <CodeBlock code={codeExample}/>}

      <DynamicMasonryView
        key={layoutType ? "masonry" : "equal"}
        isMasonry={layoutType}
        loadData={loadData}
        pageSize={30}
        waterfallConfig={{
          minColumnWidth: 200,
          maxColumnWidth: 350,
          gap: 16,
        }}
        equalHeightConfig={{
          targetRowHeight: 245,
          sizeRange: [230, 260],
          gap: 8,
        }}
        renderItem={(item, index, isMasonry) => (
          <div
            key={item.id}
            style={{
              position: "absolute",
              left: item.x,
              top: item.y,
              width: item.width,
              height: item.height,
              borderRadius: isMasonry ? "8px" : "4px",
              overflow: "hidden",
              boxShadow: isMasonry
                ? "0 2px 8px rgba(0,0,0,0.1)"
                : "0 1px 4px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              if (isMasonry) {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.2)";
              } else {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = isMasonry
                ? "0 2px 8px rgba(0,0,0,0.1)"
                : "0 1px 4px rgba(0,0,0,0.1)";
            }}
          >
            {!imageErrors.has(item.id) ? (
              <>
                <img
                  src={item.url}
                  alt={item.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                  onError={() => handleImageError(item.id)}
                  loading="lazy"
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                    padding: "30px 12px 12px",
                    color: "white",
                    opacity: 0,
                    transition: "opacity 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "0";
                  }}
                >
                  <div style={{fontSize: isMasonry ? "14px" : "13px", fontWeight: "600"}}>
                    {item.title}
                  </div>
                  <div style={{fontSize: isMasonry ? "12px" : "11px", opacity: 0.9, marginTop: "4px"}}>
                    by {item.author}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      marginTop: "6px",
                      padding: "3px 8px",
                      background: "rgba(255,255,255,0.2)",
                      borderRadius: "3px",
                      display: "inline-block",
                    }}
                  >
                    {isMasonry ? t.dynamic.waterfallBtn : t.dynamic.equalHeightBtn}
                  </div>
                </div>
              </>
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: isMasonry
                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    : "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  padding: "20px",
                  textAlign: "center",
                }}
              >
                <div style={{fontSize: isMasonry ? "40px" : "32px", marginBottom: "10px"}}>
                  {isMasonry ? "📷" : "🖼️"}
                </div>
                <div style={{fontSize: isMasonry ? "14px" : "13px", fontWeight: "600"}}>
                  {item.title}
                </div>
                <div style={{fontSize: isMasonry ? "12px" : "11px", opacity: 0.9, marginTop: "4px"}}>
                  by {item.author}
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    marginTop: "8px",
                    padding: "3px 8px",
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: "3px",
                  }}
                >
                  {isMasonry ? t.dynamic.waterfallBtn : t.dynamic.equalHeightBtn}
                </div>
              </div>
            )}
          </div>
        )}
      />
    </div>
  );
}
