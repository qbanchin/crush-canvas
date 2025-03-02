
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

export interface PhotoManagementActions {
  handleOpenDialog: () => void;
  handleCloseDialog: (open: boolean) => void;
  handleChangeTab: (tab: string) => void;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemovePhoto: (index: number) => void;
  handleSavePhotos: () => void;
  handleDeleteExistingPhoto: (index: number) => void;
  handleDragStart: (index: number) => void;
  handleDragOver: (e: React.DragEvent, index: number) => void;
  handleDragEnd: () => void;
}
