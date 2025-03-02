
/**
 * Main file utilities module that re-exports all photo-related functions
 */
import { handleFileSelect } from './photoSelection';
import { handleRemovePhoto } from './photoManagement';
import { convertBlobToBase64 } from './fileConversion';
import { compressImage } from './imageCompression';

// Re-export all functions
export {
  handleFileSelect,
  handleRemovePhoto,
  convertBlobToBase64,
  compressImage
};
