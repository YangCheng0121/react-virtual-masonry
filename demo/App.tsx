import React, { useState } from "react";
import VirtualMasonryDemo from "./VirtualMasonryDemo";
import EqualHeightDemo from "./EqualHeightDemo";
import DynamicDemo from "./DynamicDemo";

type DemoType = "waterfall" | "equalHeight" | "dynamic";

export default function App() {
  const [activeDemo, setActiveDemo] = useState<DemoType>("waterfall");

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      <header
        style={{
          position: "sticky",
          top: 0,
          background: "white",
          borderBottom: "1px solid #e0e0e0",
          zIndex: 1000,
          padding: "20px",
        }}
      >
        <h1 style={{ margin: "0 0 20px 0", fontSize: "24px" }}>
          React Virtual Masonry Gallery
        </h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => setActiveDemo("waterfall")}
            style={{
              padding: "10px 20px",
              border: "1px solid #3498db",
              borderRadius: "5px",
              background: activeDemo === "waterfall" ? "#3498db" : "white",
              color: activeDemo === "waterfall" ? "white" : "#3498db",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            瀑布流布局
          </button>
          <button
            onClick={() => setActiveDemo("equalHeight")}
            style={{
              padding: "10px 20px",
              border: "1px solid #3498db",
              borderRadius: "5px",
              background: activeDemo === "equalHeight" ? "#3498db" : "white",
              color: activeDemo === "equalHeight" ? "white" : "#3498db",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            等高布局
          </button>
          <button
            onClick={() => setActiveDemo("dynamic")}
            style={{
              padding: "10px 20px",
              border: "1px solid #3498db",
              borderRadius: "5px",
              background: activeDemo === "dynamic" ? "#3498db" : "white",
              color: activeDemo === "dynamic" ? "white" : "#3498db",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            动态布局
          </button>
        </div>
      </header>

      <main style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto" }}>
        {activeDemo === "waterfall" && <VirtualMasonryDemo />}
        {activeDemo === "equalHeight" && <EqualHeightDemo />}
        {activeDemo === "dynamic" && <DynamicDemo />}
      </main>
    </div>
  );
}