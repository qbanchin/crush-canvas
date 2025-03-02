
/**
 * Photo selection and validation utility functions
 */
import { PhotoManagementState } from '../types/photoManagementTypes';
import { compressImage } from './imageCompression';

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
        console.log("Current preview URLs:", prev.previewUrls.length);
        console.log("Adding compressed images:", compressedImages.length);
        
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
