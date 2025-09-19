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
        rows={18}
        style={{
          width: "100%",
          minHeight: "300px",
          background: "#18181b",
          color: "#f3f4f6",
          fontFamily: "Fira Mono, Menlo, Monaco, 'Courier New', monospace",
          fontSize: "15px",
          borderRadius: "0.5rem",
          border: "1px solid #d1d5db",
          padding: "1rem",
          outline: "none",
          resize: "vertical",
          lineHeight: "1.5",
          boxSizing: "border-box",
          tabSize: 2,
          caretColor: "#f59e42",
          transition: "border-color 0.2s",
        }}
        className="focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
        aria-label="Code editor"
        placeholder={`Paste your ${language.toUpperCase()} code here...`}
      />
      
      {/* Code stats */}
      <div className="absolute bottom-2 right-2 text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
        {value.length} characters, {lineNumbers.length} lines
      </div>
    </div>
  );
};

export default CodeEditor;
