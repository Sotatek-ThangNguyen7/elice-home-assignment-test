import pako from 'pako';

import {
  BINARY_FILE_TYPES,
  CENTRAL_FILE_HEADER_SIGNATURE,
  COMPRESSION_METHOD_DEFLATE,
  COMPRESSION_METHOD_STORE,
  DESCRIPTOR_BYTES_LENGTH,
  DIRECTORY_SIGNATURE,
  LOCAL_FILE_HEADER_SIGNATURE,
} from './constants';
import { IFileTree } from './types';
import { createAndDownloadFile, getMimeType } from './ultils';

export class ZipReader {
  private reader: FileReader;

  constructor() {
    this.reader = new FileReader();
  }

  /**
   * Reads a ZIP file and returns the file tree with contents.
   *
   * @param {File} zipFile - The ZIP file to read.
   * @returns {Promise<{ fileTree: IFileTree }>} - A promise resolving to the file tree with contents.
   * @throws {Error} - Throws an error if the ZIP file is invalid.
   */
  public async readZipFile(zipFile: File) {
    const reader = this.reader;

    const uint8Array = await new Promise<Uint8Array>((resolve, reject) => {
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          const arrayBuffer = event.target.result as ArrayBuffer;
          const uint8Array = new Uint8Array(arrayBuffer);
          resolve(uint8Array);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(zipFile);
    });
    if (new DataView(uint8Array.buffer, 0, 4).getUint32(0, true) === LOCAL_FILE_HEADER_SIGNATURE) {
      const fileTree = this.readFileTreeAndFileContents(uint8Array);

      if (document.getElementById('fileTree')) {
        document.getElementById('fileTree')!.innerText = JSON.stringify(fileTree, null, 2); // just for test
      }
      return {
        fileTree,
      };
    } else {
      throw Error('Invalid zip file');
    }
  }

  /**
   * Reads a ZIP file and returns the file tree without contents.
   *
   * @param {Uint8Array} zipData - The Uint8Array containing the ZIP file data.
   * @returns {any} - The file tree without contents.
   */
  public readZipFileTree(zipData: Uint8Array): any {
    const fileTree: any = {};

    let currentOffset = 0;

    // Find central directory file header signature
    while (currentOffset < zipData.length) {
      if (new DataView(zipData.buffer, currentOffset, 4).getUint32(0, true) === CENTRAL_FILE_HEADER_SIGNATURE) {
        break;
      }
      currentOffset++;
    }
    // Read central directory file header
    while (currentOffset < zipData.length) {
      const signature = new DataView(zipData.buffer, currentOffset, 4).getUint32(0, true);

      if (signature === CENTRAL_FILE_HEADER_SIGNATURE) {
        // const versionMadeBy = new DataView(zipData.buffer, currentOffset + 4, 2).getUint16(0, true);
        // const versionNeedTo = new DataView(zipData.buffer, currentOffset + 6, 2).getUint16(0, true);
        // const generalPurposeBitFlag = new DataView(zipData.buffer, currentOffset + 8, 2).getUint16(0, true);
        // const crc32 = new DataView(zipData.buffer, currentOffset + 16, 4).getUint32(0, true);
        // const realative = new DataView(zipData.buffer, currentOffset + 42, 4).getUint32(0, true);
        // const external = new DataView(zipData.buffer, currentOffset + 38, 4).getUint32(0, true);
        // const internal = new DataView(zipData.buffer, currentOffset + 36, 2).getUint16(0, true);

        const fileNameLength = new DataView(zipData.buffer, currentOffset + 28, 2).getUint16(0, true);
        const extraFieldLength = new DataView(zipData.buffer, currentOffset + 30, 2).getUint16(0, true);
        const fileCommentLength = new DataView(zipData.buffer, currentOffset + 32, 2).getUint16(0, true);
        const fileName = new TextDecoder('utf-8').decode(
          zipData.subarray(currentOffset + 46, currentOffset + 46 + fileNameLength),
        );
        const parts = fileName.split(DIRECTORY_SIGNATURE);
        let current = fileTree;

        parts.forEach((part) => {
          if (!current[part]) {
            current[part] = {};
          }
          current = current[part];
        });

        currentOffset += 46 + fileNameLength + extraFieldLength + fileCommentLength;
      } else {
        break;
      }
    }

    return fileTree;
  }

  /**
   * Reads the contents of a ZIP file and constructs a hierarchical file tree with file contents.
   *
   * @param {Uint8Array} zipData - The Uint8Array containing the ZIP file data.
   * @returns {IFileTree} - The hierarchical file tree with file contents.
   */
  public readFileTreeAndFileContents(zipData: Uint8Array): IFileTree {
    const result: IFileTree = {};

    let currentOffset = 0;
    // Data descriptor signature
    const dataDescriptorSignature = new Uint8Array([0x50, 0x4b, 0x07, 0x08]);

    while (currentOffset < zipData.length) {
      if (new DataView(zipData.buffer, currentOffset, 4).getUint32(0, true) === LOCAL_FILE_HEADER_SIGNATURE) {
        const fileNameLength = new DataView(zipData.buffer, currentOffset + 26, 2).getUint16(0, true);
        const extraFieldLength = new DataView(zipData.buffer, currentOffset + 28, 2).getUint16(0, true);

        const fileNameBytes = zipData.subarray(currentOffset + 30, currentOffset + 30 + fileNameLength);
        const fileName = new TextDecoder('utf-8').decode(fileNameBytes);
        const compressionMethod = new DataView(zipData.buffer, currentOffset + 8, 2).getUint16(0, true);

        if (!fileName.endsWith(DIRECTORY_SIGNATURE)) {
          const contentOffset = currentOffset + 30 + fileNameLength + extraFieldLength;

          // Check for Data Descriptor
          const dataDescriptorIndex = this.indexOfSignature(zipData, dataDescriptorSignature, contentOffset);
          // Read compressed size
          const compressedSizeFieldOffset = currentOffset + 18;
          let compressedSize = new DataView(zipData.buffer, compressedSizeFieldOffset, 4).getUint32(0, true);

          if (dataDescriptorIndex !== -1) {
            compressedSize = new DataView(zipData.buffer, dataDescriptorIndex + 8, 4).getUint32(0, true);
          }

          try {
            // Decompress the data
            const compressedData = zipData.subarray(contentOffset, contentOffset + compressedSize);
            const decompressedData = this.decompressData(compressedData, compressionMethod);

            const parts = fileName.split('/');
            let current = result;

            parts.forEach((part: string, index: number) => {
              if (!current[part]) {
                if (index === parts.length - 1) {
                  current[part] = this.decode(fileName, decompressedData);
                } else {
                  current[part] = {};
                }
              }
              if (index < parts.length - 1) {
                current = current[part] as IFileTree;
              }
            });
          } catch (error) {
            console.error(`Error decompressing ${fileName}:`, error);
            // Handle the error appropriately in your code
          }

          // Update: Use compressedSize for the offset
          currentOffset +=
            30 +
            fileNameLength +
            extraFieldLength +
            compressedSize +
            (dataDescriptorIndex > -1 ? DESCRIPTOR_BYTES_LENGTH : 0);
        } else {
          // Skip folders
          currentOffset += 30 + fileNameLength + extraFieldLength;
        }
      } else {
        const signature = new DataView(zipData.buffer, currentOffset, 4).getUint32(0, true);
        if (signature === CENTRAL_FILE_HEADER_SIGNATURE) {
          break;
        }
        currentOffset += 1;
      }
    }

    return result;
  }

  private findSignatureIndex(buffer: Uint8Array, signature: number): number {
    for (let i = buffer.length - 4; i >= 0; i--) {
      const testSignature = buffer[i] | (buffer[i + 1] << 8) | (buffer[i + 2] << 16) | (buffer[i + 3] << 24);
      if (testSignature === signature) {
        return i;
      }
    }
    return -1;
  }

  private decompressData(compressedData: Uint8Array, compressionMethod: number): Uint8Array {
    switch (compressionMethod) {
      case COMPRESSION_METHOD_STORE: // No compression
        return compressedData;

      case COMPRESSION_METHOD_DEFLATE: // DEFLATE compression
        return pako.inflateRaw(compressedData);

      // Handle other compression methods as needed
      case 1: // Shrunk
        // Implement decompression logic for the "Shrunk" method
        break;

      case 6: // Implode
        // Implement decompression logic for the "Implode" method
        break;

      case 12: // BZIP2 compression
        // Implement decompression logic for the "BZIP2" method
        break;

      case 14: // LZMA compression
        // Implement decompression logic for the "LZMA" method
        break;

      // Add cases for additional compression methods

      default:
        console.error(`Unsupported compression method: ${compressionMethod}`);
        return compressedData;

        break;
    }

    // Default: return the original compressed data
    return compressedData;
  }

  private indexOfSignature(zipData: Uint8Array, signature: Uint8Array, offset: number): number {
    for (let i = offset; i < zipData.length - signature.length + 1; i++) {
      const isMatch = signature.every((byte, index) => zipData[i + index] === byte);
      if (isMatch) {
        return i;
      }
    }

    return -1;
  }

  private decode(fileName: string, data: Uint8Array) {
    if (BINARY_FILE_TYPES.test(fileName)) {
      const blob = URL.createObjectURL(new Blob([data], { type: getMimeType(fileName) }));
      return {
        blob,
        content: data,
      };
    }
    return {
      content: new TextDecoder('utf-8').decode(data),
    };
  }
}
