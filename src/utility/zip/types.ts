export interface IFileTree {
  [key: string]:
    | IFileTree
    | {
        content: string | Uint8Array;
        blob?: string;
      };
}

export interface ZipEntry {
  name: string;
  content: string | Uint8Array;
}

export interface FileTreeDisplayProps {
  fileTree: IFileTree;
  setSelectedFile: (
    value: React.SetStateAction<{
      content?: string | undefined;
      blob?: string | undefined;
    }>,
  ) => void;
  setSelectedTab: (value: React.SetStateAction<string>) => void;
  tabs: string[];
  setTabs: (value: React.SetStateAction<string[]>) => void;
}
