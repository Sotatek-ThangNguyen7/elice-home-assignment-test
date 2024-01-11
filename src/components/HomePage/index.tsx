import { useRef, useState } from 'react';
import styled from 'styled-components';

import { IFileTree } from '../../utility/zip/types';
import { ZipReader, ZipWriter } from '../../utility/zip';
import { selectedTabIsImage } from '../../utility/common';

import MonacoEditor from '../MonacoEditor';
import FileTreeDisplay from '../FileTree';

const Container = styled.div`
  background-color: #292a2d;
  height: 100vh;
  width: 100%;
  display: flex;
  overflow-y: hidden;
`;

const TabFeatures = styled.div``;
const TabContent = styled.div`
  width: 100%;
`;
const WrapIconFeature = styled.div`
  display: flex;
  gap: 16px;
  width: 300px;
  border-bottom: 1px solid #502c2c;
  border-right: 1px solid #502c2c;
  height: 50px;
  align-items: center;
  margin-left: 16px;
`;
const StyleImg = styled.img`
  opacity: 0.5;
`;
const DropdownFile = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px;
  cursor: pointer;
`;
const Text = styled.div`
  color: #f8f8f8;
  font-size: 16px;
`;
const WrapTreeFile = styled.div`
  border-right: 1px solid #502c2c;
  height: 100%;
  overflow: auto;
`;
const WrapTabContent = styled.div`
  background-color: #254d50;
  height: 50px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const StyleIconFile = styled.div`
  width: 50px;
  height: 50px;
  background-color: #449297;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const FileSource = styled.div`
  display: flex;
  gap: 16px;
  padding-left: 16px;
  height: 50px;
  align-items: center;
  cursor: pointer;
`;

const StyleTabContent = styled.div`
  height: 42px;
  min-width: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  gap: 10px;
  & > .icon {
    color: transparent;
  }
  &:hover {
    & > .icon {
      color: #778181;
    }
  }
`;
const StyleLabel = styled.label`
  position: relative;
  &:hover {
    & > div {
      display: block;
    }
  }
`;

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
`;

interface IProps {}

const HomePageDecr: React.FC<IProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState<IFileTree>({});
  const [tabs, setTabs] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<{
    content?: string;
    blob?: string;
  }>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenTab = () => {
    setIsOpen(!isOpen);
  };

  const handleZipChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const zipFile = event.target.files[0];
      const zipReader = new ZipReader();
      const fileTree = await zipReader.readZipFile(zipFile);
      setFiles(fileTree);
      setTabs([]);
      setIsOpen(true);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleSelectTab = (tab: string) => {
    const pathParts = tab?.split('/');
    let currentElement: any = files.fileTree;
    if (pathParts) {
      for (const part of pathParts) {
        if (currentElement[part] && typeof currentElement[part] === 'object') {
          currentElement = currentElement[part] as IFileTree | { content: string | Uint8Array; blob?: string };
        } else {
          currentElement = null;
          break;
        }
      }

      if (currentElement && 'content' in currentElement) {
        setSelectedFile(currentElement);
      }
    } else {
      setSelectedFile({});
    }
  };

  const handleLanguage = (lang: string) => {
    switch (lang.split('.').pop()) {
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      case 'json':
        return 'json';
      case 'js':
        return 'javascript';
      case 'ts':
        return 'typescript';
      default:
        return '';
    }
  };

  const handleCloseTab = (tab: string) => {
    const newArray = tabs.filter((item) => item !== tab);
    setTabs(newArray);
    if (tab === selectedTab) {
      setSelectedTab(newArray[0]);
      handleSelectTab(newArray[0]);
    }
  };

  const handleZipEditor = (content: string, file: string) => {
    setFiles((prevFileTree) => {
      const parts = file.split('/');
      let currentLevel: any = {
        ...prevFileTree.fileTree,
      };

      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (!(part in currentLevel)) {
          return prevFileTree;
        }

        if (typeof currentLevel[part] === 'object' && currentLevel[part] !== null) {
          currentLevel[part] = { ...currentLevel[part] };
        }

        currentLevel = currentLevel[part] as IFileTree;
      }

      const lastPart = parts[parts.length - 1];
      if (typeof currentLevel[lastPart] === 'object' && currentLevel[lastPart] !== null) {
        (
          currentLevel[lastPart] as {
            content: string | Uint8Array;
            blob?: string;
          }
        ).content = content;
      }

      if (Object.keys({ ...prevFileTree }).length > 0) {
        const zipWriter = new ZipWriter('export.zip');
        const rs = zipWriter.generateFromFileTree(files);
        const zipReader = new ZipReader();
        const dt = zipReader.readZipFileTree(rs);
        const dt1 = zipReader.readFileTreeAndFileContents(rs);
      }

      return { ...prevFileTree };
    });
  };

  return (
    <Container data-testid='app-1'>
      <TabFeatures>
        <WrapIconFeature>
          <StyleImg src={'/icons/icon-add.svg'} alt='' width={24} height={24} />
          <StyleImg src={'/icons/icon-file.svg'} alt='' width={24} height={24} />
          <StyleLabel htmlFor='file-upload'>
            <StyleImg
              src={'/icons/icon-upload.svg'}
              alt=''
              width={24}
              height={24}
              onClick={handleImageClick}
              style={{ cursor: 'pointer', opacity: 1 }}
            />
            <input
              type='file'
              id='zipFileInput'
              accept='.zip'
              onChange={handleZipChange}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
            <StyleTooltip>Upload zip file</StyleTooltip>
          </StyleLabel>
        </WrapIconFeature>
        <WrapTreeFile>
          {isOpen && (
            <>
              <DropdownFile onClick={handleOpenTab}>
                <div
                  style={{
                    display: 'flex',
                    gap: '16px',
                  }}
                >
                  <StyleImg src={'/icons/icon-file-wrap.svg'} alt='' width={24} height={24} style={{ opacity: 1 }} />
                  <Text data-testid='text-test'>data</Text>
                </div>
                <StyleImg
                  src={'/icons/icon-arrow.svg'}
                  alt=''
                  width={24}
                  height={24}
                  style={{
                    transform: isOpen ? 'rotate(3.142rad)' : '',
                  }}
                />
              </DropdownFile>
              <div style={{ marginLeft: '10px' }}>
                <FileTreeDisplay
                  fileTree={files}
                  setSelectedFile={setSelectedFile}
                  setSelectedTab={setSelectedTab}
                  tabs={tabs}
                  setTabs={setTabs}
                />
              </div>
            </>
          )}
        </WrapTreeFile>
      </TabFeatures>
      <TabContent>
        <WrapTabContent>
          <div
            style={{
              display: 'flex',
              alignItems: 'end',
            }}
          >
            <div>
              <StyleIconFile>
                <StyleImg src={'/icons/icon-file-wrap.svg'} alt='' width={30} height={30} style={{ opacity: 1 }} />
              </StyleIconFile>
            </div>
            {tabs.map((item, index) => {
              return (
                <StyleTabContent
                  style={{
                    backgroundColor: selectedTab === item ? '#292a2d' : '#254d50',
                    color: selectedTab === item ? '#f8f8f8' : '#778181',
                  }}
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTab(item);
                    handleSelectTab(item);
                  }}
                  data-testid='tab-content'
                >
                  <div>{item.split('/').pop()}</div>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCloseTab(item);
                    }}
                    style={{
                      color: selectedTab === item ? 'white' : '',
                    }}
                    className='icon'
                  >
                    ✖
                  </div>
                </StyleTabContent>
              );
            })}
          </div>
          <div>
            <StyleImg src={'/icons/icon-reload.svg'} alt='' width={16} height={16} />
            <StyleImg
              src={'/icons/icon-menu.svg'}
              alt=''
              width={16}
              height={16}
              style={{
                margin: '0 16px',
              }}
            />
          </div>
        </WrapTabContent>
        {tabs.length ? (
          <>
            {selectedTabIsImage(selectedTab.split('/').pop() || '') ? (
              <div
                style={{
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <img style={{ maxHeight: '500px' }} src={selectedFile.blob} alt={selectedTab.split('/').pop()} />
              </div>
            ) : (
              <MonacoEditor
                code={selectedFile.content || ''}
                language={handleLanguage(selectedTab.split('/').pop() || '')}
                theme='vs-dark'
                selectedTab={selectedTab}
                handleZipEditor={(content, file) => handleZipEditor(content, file)}
              />
            )}
          </>
        ) : null}
      </TabContent>
    </Container>
  );
};

export default HomePageDecr;
