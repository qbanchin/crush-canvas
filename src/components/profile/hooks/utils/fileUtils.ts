
import { PhotoManagementState } from '../types/photoManagementTypes';

export function handleFileSelect(
  e: React.ChangeEvent<HTMLInputElement>,
  setState: React.Dispatch<React.SetStateAction<PhotoManagementState>>
) {
  if (e.target.files && e.target.files.length > 0) {
    const newFiles = Array.from(e.target.files);
    
    // Create object URLs for the new files
    const newPreviewUrls = newFiles.map(file => {
      const url = URL.createObjectURL(file);
      console.log(`Created object URL for file: ${file.name}`, url);
      return url;
    });
    
    setState(prev => {
      const updatedFiles = [...prev.selectedFiles, ...newFiles];
      const updatedPreviewUrls = [...prev.previewUrls, ...newPreviewUrls];
      
      console.log("Updated preview URLs:", updatedPreviewUrls);
      
      return {
        ...prev,
        selectedFiles: updatedFiles,
        previewUrls: updatedPreviewUrls
      };
    });
  }
}

export function handleRemovePhoto(
  index: number,
  setState: React.Dispatch<React.SetStateAction<PhotoManagementState>>
) {
  setState(prev => {
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
}

// New helper function to convert blob URLs to base64
export async function convertBlobToBase64(blobUrl: string): Promise<string> {
  try {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting blob to base64:", error);
    return blobUrl; // Return original URL if conversion fails
  }
}
