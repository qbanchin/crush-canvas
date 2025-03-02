
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
    if (activeTab === "add") {
      if (selectedFiles.length === 0) {
        toast({
          title: "No photos selected",
          description: "Please select at least one photo to add.",
          variant: "destructive"
        });
        return;
      }

      if (onPhotosAdded) {
        onPhotosAdded(previewUrls);
        
        setSelectedFiles([]);
        setPreviewUrls([]);
        toast({
          title: "Photos added",
          description: `${selectedFiles.length} photo(s) added to your profile.`
        });
      } else {
        toast({
          title: "Error",
          description: "Photo upload handler not available",
          variant: "destructive"
        });
      }
    } else {
      if (onPhotosReordered) {
        onPhotosReordered(editablePhotos);
        toast({
          title: "Photos updated",
          description: "Your photo order has been updated."
        });
      } else {
        toast({
          title: "Error",
          description: "Photo reordering handler not available",
          variant: "destructive"
        });
      }
    }
    setIsDialogOpen(false);
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
    
    const newPhotos = [...editablePhotos];
    newPhotos.splice(index, 1);
    setEditablePhotos(newPhotos);
    
    if (onPhotoDeleted) {
      onPhotoDeleted(index);
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
