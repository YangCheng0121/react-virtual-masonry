import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export default function CodeBlock({ code, language = "tsx" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        position: "relative",
        background: "#1e1e1e",
        borderRadius: "8px",
        overflow: "hidden",
        marginBottom: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 16px",
          background: "#2d2d2d",
          borderBottom: "1px solid #3e3e3e",
        }}
      >
        <span style={{ color: "#858585", fontSize: "12px", fontWeight: "500" }}>
          {language}
        </span>
        <button
          onClick={handleCopy}
          style={{
            padding: "4px 12px",
            background: copied ? "#4caf50" : "#3e3e3e",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px",
            transition: "all 0.2s",
          }}
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: "16px",
          background: "#1e1e1e",
          fontSize: "13px",
          maxHeight: "400px",
          overflow: "auto",
        }}
        codeTagProps={{
          style: {
            fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
            lineHeight: "1.6",
          },
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}