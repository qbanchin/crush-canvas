
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
        const base64Images = await Promise.all(
          previewUrls.map(url => convertBlobToBase64(url))
        );
        
        // Make sure we're passing the processed URLs to the handler
        console.log("Calling onPhotosAdded with processed images");
        onPhotosAdded(base64Images);
        
        // Clean up object URLs after successful upload
        setTimeout(() => {
          previewUrls.forEach(url => {
            try {
              URL.revokeObjectURL(url);
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
