// Maximum 32-bit value
export const MAX_32_BITS = 0xffffffff;

// Maximum 16-bit value
export const MAX_16_BITS = 0xffff;

// Compression methods
export const COMPRESSION_METHOD_DEFLATE = 0x08;
export const COMPRESSION_METHOD_STORE = 0x00;
export const COMPRESSION_METHOD_AES = 0x63;

// Signatures for various parts of the ZIP file
export const LOCAL_FILE_HEADER_SIGNATURE = 0x04034b50;
export const SPLIT_ZIP_FILE_SIGNATURE = 0x08074b50;
export const DATA_DESCRIPTOR_RECORD_SIGNATURE = SPLIT_ZIP_FILE_SIGNATURE;
export const CENTRAL_FILE_HEADER_SIGNATURE = 0x02014b50;
export const END_OF_CENTRAL_DIR_SIGNATURE = 0x06054b50;
export const ZIP64_END_OF_CENTRAL_DIR_SIGNATURE = 0x06064b50;
export const ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE = 0x07064b50;

// Lengths of various ZIP file sections
export const END_OF_CENTRAL_DIR_LENGTH = 22;
export const ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH = 20;
export const ZIP64_END_OF_CENTRAL_DIR_LENGTH = 56;
export const ZIP64_END_OF_CENTRAL_DIR_TOTAL_LENGTH =
  END_OF_CENTRAL_DIR_LENGTH + ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH + ZIP64_END_OF_CENTRAL_DIR_LENGTH;

// Extra field types
export const EXTRAFIELD_TYPE_ZIP64 = 0x0001;
export const EXTRAFIELD_TYPE_AES = 0x9901;
export const EXTRAFIELD_TYPE_NTFS = 0x000a;
export const EXTRAFIELD_TYPE_NTFS_TAG1 = 0x0001;
export const EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP = 0x5455;
export const EXTRAFIELD_TYPE_UNICODE_PATH = 0x7075;
export const EXTRAFIELD_TYPE_UNICODE_COMMENT = 0x6375;
export const EXTRAFIELD_TYPE_USDZ = 0x1986;

// Bit flags and attributes
export const BITFLAG_ENCRYPTED = 0x01;
export const BITFLAG_LEVEL = 0x06;
export const BITFLAG_DATA_DESCRIPTOR = 0x0008;
export const BITFLAG_LANG_ENCODING_FLAG = 0x0800;
export const FILE_ATTR_MSDOS_DIR_MASK = 0x10;
export const DESCRIPTOR_BYTES_LENGTH = 0x10;

// Versions
export const VERSION_DEFLATE = 0x14;
export const VERSION_ZIP64 = 0x2d;
export const VERSION_AES = 0x33;

// Directory separator
export const DIRECTORY_SIGNATURE = '/';

// Date range for ZIP file
export const MAX_DATE = new Date(2107, 11, 31);
export const MIN_DATE = new Date(1980, 0, 1);

// Undefined value and types
export const UNDEFINED_VALUE = undefined;
export const UNDEFINED_TYPE = 'undefined';
export const FUNCTION_TYPE = 'function';

// Regular expression for binary file types
export const BINARY_FILE_TYPES =
  /\.(jpeg|jpg|png|gif|bmp|mp3|wav|flac|mp4|avi|mkv|pdf|docx|xlsx|pptx|zip|rar|tar|exe|dll|sqlite|db|bin)$/i;

// External permission values for files and folders
export const EXTERNAL_PERMISSION_FILE = 2176057344; // rwx
export const EXTERNAL_PERMISSION_FOLDER = 1107099648; // rwx

// CRC32 generator polynomial
export const GENERATOR_POLYNOMIAL_CRC32 = 0xedb88320;
