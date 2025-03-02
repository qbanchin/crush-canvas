/**
 * Photo management utility functions
 */
import { PhotoManagementState } from '../types/photoManagementTypes';

export function handleRemovePhoto(
  index: number,
  setState: React.Dispatch<React.SetStateAction<PhotoManagementState>>
) {
  try {
    setState(prev => {
      // Check for valid index
      if (index < 0 || index >= prev.previewUrls.length) {
        console.error(`Invalid index: ${index} for array of length ${prev.previewUrls.length}`);
        return prev; // Return unchanged state
      }
      
      // Revoke object URL to prevent memory leaks
      if (prev.previewUrls[index]) {
        try {
          URL.revokeObjectURL(prev.previewUrls[index]);
        } catch (e) {
          console.error("Error revoking URL:", e);
        }
      }
      
      const newPreviewUrls = [...prev.previewUrls];
      newPreviewUrls.splice(index, 1);
      
      const newSelectedFiles = [...prev.selectedFiles];
      newSelectedFiles.splice(index, 1);
      
      return {
        ...prev,
        previewUrls: newPreviewUrls,
        selectedFiles: newSelectedFiles
      };
    });
  } catch (error) {
    console.error("Error removing photo:", error);
    // State remains unchanged in case of error
  }
}
