import React, { useEffect, useRef } from 'react';
import { EditorView, basicSetup } from '@codemirror/basic-setup';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';

const CodeEditor = ({ value, onChange, language = 'html' }) => {
  const editorRef = useRef();
  const viewRef = useRef();

  useEffect(() => {
    if (!editorRef.current) return;

    // Choose language extension
    let langExt;
    if (language === 'css') langExt = css();
    else if (language === 'javascript' || language === 'js') langExt = javascript();
    else langExt = html();

    // Destroy previous view if exists
    if (viewRef.current) viewRef.current.destroy();

    viewRef.current = new EditorView({
      doc: value,
      extensions: [
        basicSetup,
        langExt,
        EditorView.updateListener.of(update => {
          if (update.docChanged) {
            onChange && onChange(update.state.doc.toString());
          }
        }),
        EditorView.theme({
          "&": { height: "400px", background: "#1e1e1e", color: "#fff", fontSize: "14px" }
        })
      ],
      parent: editorRef.current
    });

    return () => {
      if (viewRef.current) viewRef.current.destroy();
    };
  }, [editorRef, language]);

  // Update value if changed from outside
  useEffect(() => {
    if (viewRef.current && value !== viewRef.current.state.doc.toString()) {
      viewRef.current.dispatch({
        changes: { from: 0, to: viewRef.current.state.doc.length, insert: value }
      });
    }
  }, [value]);

  return <div ref={editorRef} />;
};

export default CodeEditor;
