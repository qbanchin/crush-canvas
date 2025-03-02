
import { PhotoManagementState } from '../types/photoManagementTypes';

export function handleDeleteExistingPhoto(
  index: number,
  state: PhotoManagementState,
  handlers: { onPhotoDeleted?: (index: number) => void },
  setState: React.Dispatch<React.SetStateAction<PhotoManagementState>>,
  toast?: any
) {
  const { editablePhotos } = state;
  const { onPhotoDeleted } = handlers;
  
  if (editablePhotos.length <= 1) {
    if (toast) {
      toast({
        title: "Cannot delete image",
        description: "You must have at least one profile photo.",
        variant: "destructive"
      });
    }
    return;
  }
  
  if (typeof onPhotoDeleted === 'function') {
    onPhotoDeleted(index);
    
    setState(prev => {
      const newPhotos = [...prev.editablePhotos];
      newPhotos.splice(index, 1);
      
      return {
        ...prev,
        editablePhotos: newPhotos
      };
    });
  } else {
    console.error("Photo delete handler not available");
    if (toast) {
      toast({
        title: "Photo deletion currently unavailable",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  }
}
