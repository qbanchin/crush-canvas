
import React from 'react';
import PhotoManagementDialog from './PhotoManagementDialog';
import { usePhotoManagement } from '@/hooks/usePhotoManagement';

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
  );
};

export default PhotoManagement;
