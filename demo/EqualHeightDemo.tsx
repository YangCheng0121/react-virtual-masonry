import { useState } from "react";
import FullWidthEqualHeightMasonry from "../src/FullWidthEqualHeightMasonry";
import { loadImageData } from "./imageData";
import CodeBlock from "./CodeBlock";
import { useI18n } from "./App";
import React from "react";

const codeExample = `import { FullWidthEqualHeightMasonry } from 'react-virtual-masonry';

function PhotoAlbum() {
  const loadData = async (page: number, pageSize: number) => {
    const response = await fetch(\`/api/photos?page=\${page}&size=\${pageSize}\`);
    const data = await response.json();
    return {
      data: data.items,
      hasMore: data.hasMore,
    };
  };

  return (
    <FullWidthEqualHeightMasonry
      loadData={loadData}
      pageSize={30}
      targetRowHeight={245}
      sizeRange={[230, 260]}
      gap={8}
      renderItem={(item) => (
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

export default function EqualHeightDemo() {
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [showCode, setShowCode] = useState(false);
  const { t } = useI18n();

  const loadData = async (page: number, pageSize: number) => {
    return loadImageData(page, pageSize);
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
            marginBottom: "10px",
          }}
        >
          <div>
            <h2 style={{ margin: "0 0 10px 0", fontSize: "18px" }}>
              {t.equalHeight.title}
            </h2>
            <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
              {t.equalHeight.description}
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
            {showCode ? t.equalHeight.hideCode : t.equalHeight.showCode}
          </button>
        </div>
      </div>

      {showCode && <CodeBlock code={codeExample} />}

      <FullWidthEqualHeightMasonry
        loadData={loadData}
        pageSize={30}
        targetRowHeight={245}
        sizeRange={[230, 260]}
        maxItemWidth={975}
        gap={8}
        renderItem={(item) => (
          <div
            key={item.id}
            style={{
              position: "absolute",
              left: item.x,
              top: item.y,
              width: item.width,
              height: item.height,
              borderRadius: "4px",
              overflow: "hidden",
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.1)";
              e.currentTarget.style.transform = "translateY(0)";
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
                  <div style={{fontSize: "13px", fontWeight: "600"}}>
                    {item.title}
                  </div>
                  <div style={{fontSize: "11px", opacity: 0.9, marginTop: "3px"}}>
                    by {item.author}
                  </div>
                </div>
              </>
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  padding: "20px",
                  textAlign: "center",
                }}
              >
                <div style={{fontSize: "32px", marginBottom: "8px"}}>🖼️</div>
                <div style={{fontSize: "13px", fontWeight: "600"}}>
                  {item.title}
                </div>
                <div style={{fontSize: "11px", opacity: 0.9, marginTop: "3px"}}>
                  by {item.author}
                </div>
              </div>
            )}
          </div>
        )}
      />
    </div>
  );
}
