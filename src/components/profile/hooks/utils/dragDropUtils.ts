
import { PhotoManagementState } from '../types/photoManagementTypes';

export function handleDragStart(
  index: number,
  setState: React.Dispatch<React.SetStateAction<PhotoManagementState>>
) {
  setState(prev => ({
    ...prev,
    draggedIndex: index
  }));
}

export function handleDragOver(
  e: React.DragEvent,
  index: number,
  state: PhotoManagementState,
  setState: React.Dispatch<React.SetStateAction<PhotoManagementState>>
) {
  e.preventDefault();
  
  if (state.draggedIndex === null || state.draggedIndex === index) return;
  
  setState(prev => {
    const newPhotos = [...prev.editablePhotos];
    const draggedPhoto = newPhotos[prev.draggedIndex as number];
    newPhotos.splice(prev.draggedIndex as number, 1);
    newPhotos.splice(index, 0, draggedPhoto);
    
    return {
      ...prev,
      editablePhotos: newPhotos,
      draggedIndex: index
    };
  });
}

export function handleDragEnd(
  setState: React.Dispatch<React.SetStateAction<PhotoManagementState>>
) {
  setState(prev => ({
    ...prev,
    draggedIndex: null
  }));
}
