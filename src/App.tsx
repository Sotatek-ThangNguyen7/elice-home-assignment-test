import React, { useState } from 'react';

import './App.css';

import { ZipReader, ZipWriter } from './utility/zip';
import { IFileTree } from './utility/zip/types';

import HomePageDecr from './components/HomePage';

function App() {
  const [fileTree, setFileTree] = useState<IFileTree>({});

  const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const zipFile = event.target.files[0];
      const zipReader = new ZipReader();
      const fileTree = await zipReader.readZipFile(zipFile);
      setFileTree(fileTree.fileTree);
      console.log('🚀 ~ file: App.tsx:13 ~ onChange ~ fileTree:', fileTree);
    }
  };

  const handleExport = async () => {
    if (Object.keys(fileTree).length > 0) {
      const zipWriter = new ZipWriter('export.zip');
      const rs = zipWriter.generateFromFileTree(fileTree);
      const zipReader = new ZipReader();
      const dt = zipReader.readZipFileTree(rs);
      const dt1 = zipReader.readFileTreeAndFileContents(rs);
      console.log('🚀 ~ handleExport ~ dt:', dt, dt1);
    }
  };

  return (
    <div className="App">
      {/* <input type="file" id="zipFileInput" accept=".zip" onChange={onChange} />
      <pre id="fileTree"></pre>
      <pre id="fileContent"></pre>
      {
        Object.keys(fileTree).length > 0 && (
          <button onClick={handleExport}>Export</button>
        )
      } */}

      <HomePageDecr />
    </div>
  );
}

export default App;
