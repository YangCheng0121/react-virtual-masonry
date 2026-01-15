import { useState } from "react";
import FullWidthEqualHeightMasonry from "../src/FullWidthEqualHeightMasonry";
import { loadImageData } from "./imageData";

export default function EqualHeightDemo() {
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

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
        <h2 style={{margin: "0 0 10px 0", fontSize: "18px"}}>
          等高布局 (Google Photos 风格)
        </h2>
        <p style={{margin: 0, color: "#666", fontSize: "14px"}}>
          每行高度相同,宽度根据原始比例自动调整以填满整行
        </p>
      </div>

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
