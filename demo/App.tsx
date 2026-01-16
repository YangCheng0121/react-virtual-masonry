import React, { useState, createContext, useContext } from "react";
import VirtualMasonryDemo from "./VirtualMasonryDemo";
import EqualHeightDemo from "./EqualHeightDemo";
import DynamicDemo from "./DynamicDemo";
import { Language, translations } from "./i18n";

type DemoType = "waterfall" | "equalHeight" | "dynamic";

interface I18nContextType {
  language: Language;
  t: typeof translations.en;
}

const I18nContext = createContext<I18nContextType>({
  language: "en",
  t: translations.en,
});

export const useI18n = () => useContext(I18nContext);

export default function App() {
  const [activeDemo, setActiveDemo] = useState<DemoType>("waterfall");
  const [language, setLanguage] = useState<Language>("en");

  const t = translations[language];

  return (
    <I18nContext.Provider value={{ language, t }}>
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h1 style={{ margin: 0, fontSize: "24px" }}>{t.header.title}</h1>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => setLanguage("en")}
                style={{
                  padding: "6px 12px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  background: language === "en" ? "#3498db" : "white",
                  color: language === "en" ? "white" : "#666",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: language === "en" ? "600" : "400",
                }}
              >
                English
              </button>
              <button
                onClick={() => setLanguage("zh")}
                style={{
                  padding: "6px 12px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  background: language === "zh" ? "#3498db" : "white",
                  color: language === "zh" ? "white" : "#666",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: language === "zh" ? "600" : "400",
                }}
              >
                中文
              </button>
            </div>
          </div>
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
              {t.header.waterfall}
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
              {t.header.equalHeight}
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
              {t.header.dynamic}
            </button>
          </div>
        </header>

        <main style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto" }}>
          {activeDemo === "waterfall" && <VirtualMasonryDemo />}
          {activeDemo === "equalHeight" && <EqualHeightDemo />}
          {activeDemo === "dynamic" && <DynamicDemo />}
        </main>
      </div>
    </I18nContext.Provider>
  );
}