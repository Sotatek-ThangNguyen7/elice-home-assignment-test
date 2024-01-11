import { useState } from 'react';
import styled from 'styled-components';

import { selectedTabIsImage } from '../../utility/common';
import { FileTreeDisplayProps, IFileTree } from '../../utility/zip/types';

const DropdownFile = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px;
  cursor: pointer;
`;

const StyleImg = styled.img`
  cursor: pointer;
`;

const Text = styled.div`
  color: #f8f8f8;
  font-size: 16px;
`;

const FileSource = styled.div`
  display: flex;
  gap: 16px;
  padding-left: 16px;
  height: 50px;
  align-items: center;
  cursor: pointer;
`;

const FileTreeDisplay: React.FC<FileTreeDisplayProps> = ({
  fileTree,
  setSelectedFile,
  setSelectedTab,
  tabs,
  setTabs,
}) => {
  const [hiddenItems, setHiddenItems] = useState<{ [key: string]: boolean }>({});

  const handleOpenFile = (currentPath: string) => {
    const pathParts = currentPath.split('/');

    let currentElement: any = fileTree.fileTree;

    for (const part of pathParts) {
      if (currentElement[part] && typeof currentElement[part] === 'object') {
        currentElement = currentElement[part] as IFileTree | { content: string | Uint8Array; blob?: string };
      } else {
        currentElement = null;
        break;
      }
    }

    if (currentElement) {
      setSelectedFile(currentElement);
      setSelectedTab(currentPath);
    }
    if (tabs.every((tab) => tab !== currentPath)) {
      setTabs([...tabs, currentPath]);
    }
  };

  const toggleVisibility = (key: string) => {
    setHiddenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderTree = (
    tree: IFileTree | { content: string | Uint8Array; blob?: string },
    path = '',
    depth: number = 0,
  ): JSX.Element[] => {
    return Object.keys(tree).map((key) => {
      const currentPath = path ? `${path}/${key}` : key;
      const isFile = key.includes('.');
      const item = (tree as IFileTree)[key];
      const style = { marginLeft: `${depth * 10}px` };

      if (typeof item === 'object' && item !== null && !isFile) {
        return (
          <div key={currentPath} style={style}>
            <DropdownFile onClick={() => toggleVisibility(currentPath)}>
              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                }}
              >
                <StyleImg src={'/icons/icon-folder.svg'} alt='' width={24} height={24} />
                <Text data-testid='text-test'>{key}</Text>
              </div>
              <StyleImg
                src={'/icons/icon-arrow.svg'}
                alt=''
                width={24}
                height={24}
                style={{
                  transform: hiddenItems[currentPath] ? '' : 'rotate(3.142rad)',
                }}
              />
            </DropdownFile>
            {!hiddenItems[currentPath] && renderTree(item as IFileTree, currentPath, depth + 1)}
          </div>
        );
      } else {
        return (
          <FileSource key={currentPath} onClick={() => handleOpenFile(currentPath)}>
            <StyleImg
              src={
                selectedTabIsImage(currentPath.split('/').pop() || '')
                  ? '/icons/icon-image.svg'
                  : '/icons/icon-file-code.svg'
              }
              alt=''
              width={24}
              height={24}
              style={style}
            />
            <Text>{key}</Text>
          </FileSource>
        );
      }
    });
  };

  const innerFileTree = fileTree['fileTree'] || {};
  return <div>{renderTree(innerFileTree)}</div>;
};

export default FileTreeDisplay;
