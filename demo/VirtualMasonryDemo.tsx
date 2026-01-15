import { useState } from "react";
import VirtualMasonry from "../src/VirtualMasonry";
import { loadImageData } from "./imageData";

export default function VirtualMasonryDemo() {
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
          瀑布流布局 (Pinterest 风格)
        </h2>
        <p style={{margin: 0, color: "#666", fontSize: "14px"}}>
          不等宽不等高的瀑布流布局,支持虚拟滚动和无限加载
        </p>
      </div>

      <VirtualMasonry
        loadData={loadData}
        pageSize={30}
        minColumnWidth={200}
        maxColumnWidth={350}
        gap={16}
        renderItem={(item) => (
          <div
            key={item.id}
            style={{
              position: "absolute",
              left: item.x,
              top: item.y,
              width: item.width,
              height: item.height,
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
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
                  <div style={{fontSize: "14px", fontWeight: "600"}}>
                    {item.title}
                  </div>
                  <div style={{fontSize: "12px", opacity: 0.9, marginTop: "4px"}}>
                    by {item.author}
                  </div>
                </div>
              </>
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  padding: "20px",
                  textAlign: "center",
                }}
              >
                <div style={{fontSize: "40px", marginBottom: "10px"}}>📷</div>
                <div style={{fontSize: "14px", fontWeight: "600"}}>
                  {item.title}
                </div>
                <div style={{fontSize: "12px", opacity: 0.9, marginTop: "4px"}}>
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
