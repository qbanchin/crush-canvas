
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { PhotoManagementState, PhotoManagementHandlers } from './types/photoManagementTypes';
import { handleOpenDialog, handleCloseDialog, handleChangeTab } from './utils/dialogUtils';
import { handleFileSelect, handleRemovePhoto } from './utils/fileUtils';
import { handleSavePhotos } from './utils/saveUtils';
import { handleDeleteExistingPhoto } from './utils/deleteUtils';
import { handleDragStart, handleDragOver, handleDragEnd } from './utils/dragDropUtils';

export const usePhotoManagement = (
  userImages: string[],
  handlers: PhotoManagementHandlers
) => {
  const { toast } = useToast();
  const [state, setState] = useState<PhotoManagementState>({
    isOpen: false,
    activeTab: 'edit',
    editablePhotos: [...userImages],
    selectedFiles: [],
    previewUrls: [],
    draggedIndex: null
  });

  // Log to debug handlers
  console.log("usePhotoManagement - Handlers:", { 
    onPhotosAdded: !!handlers.onPhotosAdded, 
    onPhotosReordered: !!handlers.onPhotosReordered,
    onPhotoDeleted: !!handlers.onPhotoDeleted
  });

  // Dialog handlers
  const dialogOpenHandler = () => handleOpenDialog(setState);
  const dialogCloseHandler = (open: boolean) => handleCloseDialog(open, setState, userImages);
  const changeTabHandler = (tab: string) => handleChangeTab(tab, setState);

  // File handling
  const fileSelectHandler = (e: React.ChangeEvent<HTMLInputElement>) => 
    handleFileSelect(e, setState);
  const removePhotoHandler = (index: number) => 
    handleRemovePhoto(index, setState);

  // Save and delete handlers
  const savePhotosHandler = () => 
    handleSavePhotos(state, handlers, setState, toast);
  const deleteExistingPhotoHandler = (index: number) => 
    handleDeleteExistingPhoto(index, state, handlers, setState, toast);

  // Drag and drop handlers
  const dragStartHandler = (index: number) => 
    handleDragStart(index, setState);
  const dragOverHandler = (e: React.DragEvent, index: number) => 
    handleDragOver(e, index, state, setState);
  const dragEndHandler = () => 
    handleDragEnd(setState);

  return {
    state,
    handlers: {
      handleOpenDialog: dialogOpenHandler,
      handleCloseDialog: dialogCloseHandler,
      handleChangeTab: changeTabHandler,
      handleFileSelect: fileSelectHandler,
      handleRemovePhoto: removePhotoHandler,
      handleSavePhotos: savePhotosHandler,
      handleDeleteExistingPhoto: deleteExistingPhotoHandler,
      handleDragStart: dragStartHandler,
      handleDragOver: dragOverHandler,
      handleDragEnd: dragEndHandler
    }
  };
};
