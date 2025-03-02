
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

interface UsePhotoManagementProps {
  userImages: string[];
  onPhotosAdded?: (newPhotos: string[]) => void;
  onPhotosReordered?: (reorderedPhotos: string[]) => void;
  onPhotoDeleted?: (index: number) => void;
}

export const usePhotoManagement = ({
  userImages,
  onPhotosAdded,
  onPhotosReordered,
  onPhotoDeleted
}: UsePhotoManagementProps) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("edit");
  const [editablePhotos, setEditablePhotos] = useState<string[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Log info about the handlers to help with debugging
  console.log('usePhotoManagement received handlers:', {
    hasAddHandler: typeof onPhotosAdded === 'function',
    hasReorderHandler: typeof onPhotosReordered === 'function',
    hasDeleteHandler: typeof onPhotoDeleted === 'function'
  });

  const handleOpenDialog = () => {
    setEditablePhotos([...userImages]);
    setSelectedFiles([]);
    setPreviewUrls([]);
    setActiveTab("edit");
    setIsDialogOpen(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles([...selectedFiles, ...newFiles]);
      
      const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls([...previewUrls, ...newPreviewUrls]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    
    const newPreviewUrls = [...previewUrls];
    newPreviewUrls.splice(index, 1);
    setPreviewUrls(newPreviewUrls);
    
    const newSelectedFiles = [...selectedFiles];
    newSelectedFiles.splice(index, 1);
    setSelectedFiles(newSelectedFiles);
  };

  const handleSavePhotos = () => {
    // Check the tab we're in
    if (activeTab === "add") {
      // For Add tab
      if (selectedFiles.length === 0) {
        toast({
          title: "No photos selected",
          description: "Please select at least one photo to add.",
          variant: "destructive"
        });
        return;
      }

      if (typeof onPhotosAdded !== 'function') {
        // When handler is missing, show error but don't close dialog so user can try another action
        console.error("Photo upload handler not available");
        toast({
          title: "Photo upload currently unavailable",
          description: "Please try again later or contact support.",
          variant: "destructive"
        });
        return;
      }
      
      // Execute the handler directly
      onPhotosAdded(previewUrls);
      
      // Clean up
      setSelectedFiles([]);
      setPreviewUrls([]);
      toast({
        title: "Photos added",
        description: `${selectedFiles.length} photo(s) added to your profile.`
      });
      setIsDialogOpen(false);
    } else {
      // For Edit tab
      if (typeof onPhotosReordered !== 'function') {
        // When handler is missing, show error but don't close dialog so user can try another action
        console.error("Photo reorder handler not available");
        toast({
          title: "Photo reordering currently unavailable",
          description: "Please try again later or contact support.",
          variant: "destructive"
        });
        return;
      }
      
      // Execute the handler directly
      onPhotosReordered(editablePhotos);
      toast({
        title: "Photos updated",
        description: "Your photo order has been updated."
      });
      setIsDialogOpen(false);
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
      // Execute delete directly and update local state
      onPhotoDeleted(index);
      
      // Also update local state for immediate UI feedback
      const newPhotos = [...editablePhotos];
      newPhotos.splice(index, 1);
      setEditablePhotos(newPhotos);
    } else {
      console.error("Photo delete handler not available");
      toast({
        title: "Photo deletion currently unavailable",
        description: "Changes will not be saved. Please try again later.",
        variant: "destructive"
      });
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newPhotos = [...editablePhotos];
    const draggedPhoto = newPhotos[draggedIndex];
    newPhotos.splice(draggedIndex, 1);
    newPhotos.splice(index, 0, draggedPhoto);
    
    setEditablePhotos(newPhotos);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    activeTab,
    setActiveTab,
    editablePhotos,
    previewUrls,
    draggedIndex,
    handleOpenDialog,
    handleFileSelect,
    handleRemovePhoto,
    handleSavePhotos,
    handleDeleteExistingPhoto,
    handleDragStart,
    handleDragOver,
    handleDragEnd
  };
};
