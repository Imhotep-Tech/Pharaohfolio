import React, { useState, useEffect } from "react";

const CodeEditor = ({ value, onChange, language = "html" }) => {
  const [lineNumbers, setLineNumbers] = useState([]);

  // Generate line numbers based on content
  useEffect(() => {
    const lines = value.split('\n');
    setLineNumbers(lines.map((_, index) => index + 1));
  }, [value]);

  const handleKeyDown = (e) => {
    // Handle Tab key for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.target;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange && onChange(newValue);
      
      // Set cursor position after the inserted spaces
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div className="relative">
      {/* Code editor */}
      <textarea
        value={value}
        onChange={e => onChange && onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        rows={22}
        style={{
          width: "100%",
          minHeight: "380px",
          background: "#05070f",
          color: "#f3f4f6",
          fontFamily: "Fira Mono, Menlo, Monaco, 'Courier New', monospace",
          fontSize: "14px",
          borderRadius: "0.75rem",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "1rem",
          outline: "none",
          resize: "vertical",
          lineHeight: "1.6",
          boxSizing: "border-box",
          tabSize: 2,
          caretColor: "#fbcd3d",
          transition: "all 0.3s ease",
        }}
        className="focus:ring-2 focus:ring-gold-500 focus:border-transparent"
        aria-label="Code editor"
        placeholder={`Paste your ${language.toUpperCase()} code here...`}
      />
      
      {/* Code stats */}
      <div className="absolute bottom-3 right-3 text-[10px] text-gray-500 bg-obsidian-900/80 px-2 py-1 rounded-md border border-white/5 font-mono">
        {value.length} chars, {lineNumbers.length} lines
      </div>
    </div>
  );
};

export default CodeEditor;
