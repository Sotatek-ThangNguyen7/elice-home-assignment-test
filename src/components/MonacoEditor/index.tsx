import React, { useRef, useEffect } from 'react';
import * as monaco from 'monaco-editor';
import styled from 'styled-components';

type MonacoEditorProps = {
  code: string;
  language: string;
  theme: string;
  selectedTab: string;
  handleZipEditor: (content: string, file: string) => void;
};

const StyleTooltip = styled.div`
  position: absolute;
  width: fit-content;
  background-color: #292a2d;
  border-radius: 4px;
  color: white;
  font-size: 12px;
  text-align: center;
  padding: 6px;
  border: 1px solid white;
  white-space: nowrap;
  display: none;
  top: 32px;
  right: 16px;
  z-index: 10;
`;

const StyleLabel = styled.label`
  position: relative;
  &:hover {
    & > div {
      display: block;
    }
  }
`;

const MonacoEditor: React.FC<MonacoEditorProps> = ({ code, language, theme, selectedTab, handleZipEditor }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  let editorInstance: any;

  useEffect(() => {
    if (editorRef.current) {
      editorInstance = monaco.editor.create(editorRef.current, {
        value: code,
        language,
        theme,
      });

      return () => editorInstance.dispose();
    }
  }, [code, language, theme]);

  return (
    <>
      <StyleLabel htmlFor='file-upload'>
        <img
          src={'/icons/icon-download.svg'}
          alt=''
          width={24}
          height={24}
          style={{
            display: 'block',
            margin: '16px 16px 16px auto',
            cursor: 'pointer',
          }}
          onClick={() => handleZipEditor(editorInstance.getValue(), selectedTab)}
        />
        <StyleTooltip>Download zip file</StyleTooltip>
      </StyleLabel>

      <div ref={editorRef} style={{ height: '100%', width: '100%' }} />
    </>
  );
};

export default MonacoEditor;
