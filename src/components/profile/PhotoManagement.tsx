
import React from 'react';
import PhotoManagementDialog from './PhotoManagementDialog';
import { usePhotoManagement } from '@/hooks/usePhotoManagement';
import { Button } from '@/components/ui/button';
import { ImageIcon } from 'lucide-react';

interface PhotoManagementProps {
  userImages: string[];
  onPhotosAdded?: (newPhotos: string[]) => void;
  onPhotosReordered?: (reorderedPhotos: string[]) => void;
  onPhotoDeleted?: (index: number) => void;
}

const PhotoManagement: React.FC<PhotoManagementProps> = ({
  userImages,
  onPhotosAdded,
  onPhotosReordered,
  onPhotoDeleted
}) => {
  // Log to help with debugging
  console.log('PhotoManagement received handlers:', { 
    hasAddHandler: typeof onPhotosAdded === 'function',
    hasReorderHandler: typeof onPhotosReordered === 'function',
    hasDeleteHandler: typeof onPhotoDeleted === 'function'
  });

  const {
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
  } = usePhotoManagement({
    userImages,
    onPhotosAdded,
    onPhotosReordered,
    onPhotoDeleted
  });

  return (
    <>
      <Button variant="outline" className="flex-1 gap-2" onClick={handleOpenDialog}>
        <ImageIcon size={16} />
        Edit Photos
      </Button>
      
      <PhotoManagementDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        userImages={userImages}
        onSave={handleSavePhotos}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        editablePhotos={editablePhotos}
        previewUrls={previewUrls}
        onDeleteExistingPhoto={handleDeleteExistingPhoto}
        draggedIndex={draggedIndex}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onFileSelect={handleFileSelect}
        onRemovePhoto={handleRemovePhoto}
      />
    </>
  );
};

export default PhotoManagement;
