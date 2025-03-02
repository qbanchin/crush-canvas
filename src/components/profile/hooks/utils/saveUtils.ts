
import { PhotoManagementState, PhotoManagementHandlers } from '../types/photoManagementTypes';
import { convertBlobToBase64 } from './fileUtils';

export async function handleSavePhotos(
  state: PhotoManagementState,
  handlers: PhotoManagementHandlers,
  setState: React.Dispatch<React.SetStateAction<PhotoManagementState>>,
  toast: any
) {
  const { activeTab, editablePhotos, previewUrls } = state;
  const { onPhotosAdded, onPhotosReordered, onPhotoDeleted } = handlers;

  console.log("handleSavePhotos - Active Tab:", activeTab);
  console.log("handleSavePhotos - Handlers:", { 
    onPhotosAdded: !!onPhotosAdded, 
    onPhotosReordered: !!onPhotosReordered,
    onPhotoDeleted: !!onPhotoDeleted
  });
  console.log("handleSavePhotos - Photos Data:", { 
    editablePhotos: editablePhotos?.length, 
    previewUrls: previewUrls?.length 
  });

  if (activeTab === "add") {
    if (previewUrls.length === 0) {
      toast({
        title: "No photos selected",
        description: "Please select at least one photo to add.",
        variant: "destructive"
      });
      return;
    }

    if (typeof onPhotosAdded === 'function') {
      try {
        // Convert all blob URLs to base64
        console.log("Processing images for upload, count:", previewUrls.length);
        const processedImages: string[] = [];
        
        for (let i = 0; i < previewUrls.length; i++) {
          try {
            const base64Image = await convertBlobToBase64(previewUrls[i]);
            processedImages.push(base64Image);
            console.log(`Successfully processed image ${i+1}/${previewUrls.length}`);
          } catch (error) {
            console.error(`Error processing image ${i+1}:`, error);
            toast({
              title: `Error processing image ${i+1}`,
              description: "Skipping this image. Please try with a different one.",
              variant: "destructive"
            });
          }
        }
        
        if (processedImages.length === 0) {
          throw new Error("Failed to process any of the selected images");
        }
        
        // Make sure we're passing the processed URLs to the handler
        console.log("Calling onPhotosAdded with processed images:", processedImages.length);
        onPhotosAdded(processedImages);
        
        // Clean up object URLs after successful upload
        setTimeout(() => {
          previewUrls.forEach(url => {
            try {
              if (url.startsWith('blob:')) {
                URL.revokeObjectURL(url);
              }
            } catch (e) {
              console.error("Error revoking URL:", e);
            }
          });
        }, 1000);
        
        setState(prev => ({
          ...prev,
          isOpen: false,
          selectedFiles: [],
          previewUrls: []
        }));
      } catch (error) {
        console.error("Error processing images:", error);
        toast({
          title: "Error processing images",
          description: "Failed to process images for upload.",
          variant: "destructive"
        });
      }
    } else {
      console.error("Photo upload handler not available");
      toast({
        title: "Photo upload currently unavailable",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  } else if (activeTab === "edit") {
    if (typeof onPhotosReordered === 'function') {
      console.log("Calling onPhotosReordered with:", editablePhotos);
      onPhotosReordered(editablePhotos);
      
      setState(prev => ({
        ...prev,
        isOpen: false
      }));
    } else {
      console.error("Photo reorder handler not available");
      toast({
        title: "Photo reordering currently unavailable",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  }
}
