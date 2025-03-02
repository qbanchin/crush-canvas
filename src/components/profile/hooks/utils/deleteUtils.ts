
import { PhotoManagementState } from '../types/photoManagementTypes';

export function handleDeleteExistingPhoto(
  index: number,
  editablePhotos: string[],
  onPhotoDeleted: ((index: number) => void) | undefined,
  setState: React.Dispatch<React.SetStateAction<PhotoManagementState>>,
  toast: any
) {
  if (editablePhotos.length <= 1) {
    toast({
      title: "Cannot delete image",
      description: "You must have at least one profile photo.",
      variant: "destructive"
    });
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
    toast({
      title: "Photo deletion currently unavailable",
      description: "Please try again later.",
      variant: "destructive"
    });
  }
}
