
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export interface PhotoManagementState {
  isOpen: boolean;
  activeTab: string;
  editablePhotos: string[];
  selectedFiles: File[];
  previewUrls: string[];
  draggedIndex: number | null;
}

export interface PhotoManagementHandlers {
  onPhotosAdded?: (newPhotos: string[]) => void;
  onPhotosReordered?: (reorderedPhotos: string[]) => void;
  onPhotoDeleted?: (index: number) => void;
}

export function usePhotoManagement(
  userImages: string[],
  handlers: PhotoManagementHandlers
) {
  const { toast } = useToast();
  const [state, setState] = useState<PhotoManagementState>({
    isOpen: false,
    activeTab: "edit",
    editablePhotos: [],
    selectedFiles: [],
    previewUrls: [],
    draggedIndex: null
  });

  // Destructure state for easier access
  const { 
    isOpen, 
    activeTab, 
    editablePhotos, 
    selectedFiles, 
    previewUrls, 
    draggedIndex 
  } = state;

  // Destructure handlers
  const { onPhotosAdded, onPhotosReordered, onPhotoDeleted } = handlers;

  // Log the handlers with detailed information
  console.log('usePhotoManagement hook with handlers:', {
    hasAddHandler: !!onPhotosAdded,
    hasReorderHandler: !!onPhotosReordered,
    hasDeleteHandler: !!onPhotoDeleted,
    userImagesCount: userImages?.length || 0
  });

  const handleOpenDialog = () => {
    setState(prev => ({
      ...prev,
      editablePhotos: [...userImages],
      selectedFiles: [],
      previewUrls: [],
      activeTab: "edit",
      isOpen: true
    }));
  };

  const handleCloseDialog = () => {
    setState(prev => ({
      ...prev,
      isOpen: false
    }));
  };

  const handleChangeTab = (tab: string) => {
    setState(prev => ({
      ...prev,
      activeTab: tab
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      
      setState(prev => {
        const updatedFiles = [...prev.selectedFiles, ...newFiles];
        const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
        const updatedPreviewUrls = [...prev.previewUrls, ...newPreviewUrls];
        
        return {
          ...prev,
          selectedFiles: updatedFiles,
          previewUrls: updatedPreviewUrls
        };
      });
    }
  };

  const handleRemovePhoto = (index: number) => {
    setState(prev => {
      // Revoke object URL to prevent memory leaks
      if (prev.previewUrls[index]) {
        URL.revokeObjectURL(prev.previewUrls[index]);
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
  };

  const handleSavePhotos = () => {
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
        onPhotosAdded(previewUrls);
        
        // Clean up object URLs and reset state
        previewUrls.forEach(url => URL.revokeObjectURL(url));
        
        setState(prev => ({
          ...prev,
          isOpen: false,
          selectedFiles: [],
          previewUrls: []
        }));
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
  };

  const handleDeleteExistingPhoto = (index: number) => {
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
  };

  const handleDragStart = (index: number) => {
    setState(prev => ({
      ...prev,
      draggedIndex: index
    }));
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === index) return;
    
    setState(prev => {
      const newPhotos = [...prev.editablePhotos];
      const draggedPhoto = newPhotos[prev.draggedIndex!];
      newPhotos.splice(prev.draggedIndex!, 1);
      newPhotos.splice(index, 0, draggedPhoto);
      
      return {
        ...prev,
        editablePhotos: newPhotos,
        draggedIndex: index
      };
    });
  };

  const handleDragEnd = () => {
    setState(prev => ({
      ...prev,
      draggedIndex: null
    }));
  };

  return {
    state,
    handlers: {
      handleOpenDialog,
      handleCloseDialog,
      handleChangeTab,
      handleFileSelect,
      handleRemovePhoto,
      handleSavePhotos,
      handleDeleteExistingPhoto,
      handleDragStart,
      handleDragOver,
      handleDragEnd
    }
  };
}
