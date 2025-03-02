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
    console.log("Files selected:", newFiles.length);
    
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
    
    // Process files one by one with compression
    const processFiles = async () => {
      const compressedImages: string[] = [];
      
      for (const file of validFiles) {
        try {
          // Compress and get URL
          const compressedImageUrl = await compressImage(file);
          if (compressedImageUrl) {
            compressedImages.push(compressedImageUrl);
            console.log(`Successfully processed ${file.name}`);
          }
        } catch (error) {
          console.error(`Failed to process file ${file.name}:`, error);
        }
      }
      
      if (compressedImages.length === 0) {
        console.error("Failed to process any of the selected images");
        return;
      }
      
      // Update state with compressed images
      setState(prev => {
        console.log("Updated preview URLs with compressed images:", compressedImages);
        
        return {
          ...prev,
          selectedFiles: [...prev.selectedFiles, ...validFiles],
          previewUrls: [...prev.previewUrls, ...compressedImages]
        };
      });
    };
    
    // Start processing
    processFiles();
  } catch (error) {
    console.error("Error handling file selection:", error);
    // Don't update state if there's an error
  }
}

// Image compression function
export async function compressImage(
  file: File, 
  maxWidth = 1200, 
  maxHeight = 1200, 
  quality = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      console.log(`Compressing image: ${file.name} (${Math.round(file.size / 1024)}KB)`);
      
      // Create file reader
      const reader = new FileReader();
      
      reader.onload = (readerEvent) => {
        const img = new Image();
        
        img.onload = () => {
          try {
            // Calculate new dimensions while maintaining aspect ratio
            let width = img.width;
            let height = img.height;
            
            if (width > height) {
              if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
              }
            }
            
            // Create canvas for resizing
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            
            // Draw resized image on canvas
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              reject(new Error("Failed to get canvas context"));
              return;
            }
            
            ctx.drawImage(img, 0, 0, width, height);
            
            // Convert to blob with quality setting
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  reject(new Error("Failed to create blob from canvas"));
                  return;
                }
                
                // Create and return URL
                const url = URL.createObjectURL(blob);
                console.log(`Compressed image: ${Math.round(blob.size / 1024)}KB (original: ${Math.round(file.size / 1024)}KB)`);
                resolve(url);
              },
              file.type,
              quality
            );
          } catch (err) {
            console.error("Error during image compression:", err);
            // Fallback to original file if compression fails
            const fallbackUrl = URL.createObjectURL(file);
            resolve(fallbackUrl);
          }
        };
        
        img.onerror = () => {
          console.error("Failed to load image for compression");
          // Fallback to original file
          const fallbackUrl = URL.createObjectURL(file);
          resolve(fallbackUrl);
        };
        
        // Set image source from file reader
        if (typeof readerEvent.target?.result === 'string') {
          img.src = readerEvent.target.result;
        } else {
          reject(new Error("Failed to read file"));
        }
      };
      
      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };
      
      // Read file as data URL
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error in compression function:", error);
      // Fallback to creating a simple object URL without compression
      const fallbackUrl = URL.createObjectURL(file);
      resolve(fallbackUrl);
    }
  });
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
    
    console.log("Converting URL to base64:", blobUrl.substring(0, 30) + "...");
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
        console.log("Successfully converted to base64:", result.substring(0, 30) + "...");
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
