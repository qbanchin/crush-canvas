import { PhotoManagementState } from '../types/photoManagementTypes';

export function handleFileSelect(
  e: React.ChangeEvent<HTMLInputElement>,
  setState: React.Dispatch<React.SetStateAction<PhotoManagementState>>
) {
  try {
    if (!e.target.files || e.target.files.length === 0) {
      console.log("No files selected");
      return;
    }
    
    const newFiles = Array.from(e.target.files);
    
    // Validate file types
    const validFiles = newFiles.filter(file => {
      if (!file.type.startsWith('image/')) {
        console.error(`Invalid file type: ${file.type} for file ${file.name}`);
        return false;
      }
      return true;
    });
    
    if (validFiles.length === 0) {
      console.error("No valid image files were selected");
      return;
    }
    
    // Create object URLs for the new files
    const newPreviewUrls = validFiles.map(file => {
      try {
        const url = URL.createObjectURL(file);
        console.log(`Created object URL for file: ${file.name}`, url);
        return url;
      } catch (error) {
        console.error(`Failed to create object URL for ${file.name}:`, error);
        return null;
      }
    }).filter(Boolean) as string[]; // Filter out nulls
    
    setState(prev => {
      const updatedFiles = [...prev.selectedFiles, ...validFiles];
      const updatedPreviewUrls = [...prev.previewUrls, ...newPreviewUrls];
      
      console.log("Updated preview URLs:", updatedPreviewUrls);
      
      return {
        ...prev,
        selectedFiles: updatedFiles,
        previewUrls: updatedPreviewUrls
      };
    });
  } catch (error) {
    console.error("Error handling file selection:", error);
    // Don't update state if there's an error
  }
}

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

// Helper function to convert blob URLs to base64
export async function convertBlobToBase64(blobUrl: string): Promise<string> {
  try {
    // Check if it's already a base64 string
    if (blobUrl.startsWith('data:')) {
      return blobUrl;
    }
    
    // Check if it's a valid URL
    if (!blobUrl.startsWith('blob:') && !blobUrl.startsWith('http')) {
      console.error("Invalid blob URL format:", blobUrl.substring(0, 50) + "...");
      throw new Error("Invalid image URL format");
    }
    
    const response = await fetch(blobUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    
    const blob = await response.blob();
    
    if (!blob.type.startsWith('image/')) {
      throw new Error(`Invalid file type: ${blob.type}`);
    }
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const result = reader.result as string;
        if (!result || typeof result !== 'string') {
          reject(new Error("Failed to convert image to base64"));
          return;
        }
        resolve(result);
      };
      
      reader.onerror = () => {
        reject(new Error("Error reading file"));
      };
      
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting blob to base64:", error);
    // Return original URL if it's a normal http/https URL
    if (blobUrl.startsWith('http')) {
      return blobUrl;
    }
    throw new Error("Failed to process image");
  }
}
