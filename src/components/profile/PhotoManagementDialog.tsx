
import React from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { ImageIcon } from 'lucide-react';
import PhotoManagementTabs from './PhotoManagementTabs';

interface PhotoManagementDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userImages: string[];
  onSave: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  editablePhotos: string[];
  previewUrls: string[];
  onDeleteExistingPhoto: (index: number) => void;
  draggedIndex: number | null;
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemovePhoto: (index: number) => void;
}

const PhotoManagementDialog: React.FC<PhotoManagementDialogProps> = ({
  isOpen,
  onOpenChange,
  userImages,
  onSave,
  activeTab,
  setActiveTab,
  editablePhotos,
  previewUrls,
  onDeleteExistingPhoto,
  draggedIndex,
  onDragStart,
  onDragOver,
  onDragEnd,
  onFileSelect,
  onRemovePhoto
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex-1 gap-2">
          <ImageIcon size={16} />
          Edit Photos
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Photos</DialogTitle>
          <DialogDescription>
            Add, remove, or reorder your profile photos.
          </DialogDescription>
        </DialogHeader>
        
        <PhotoManagementTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          editablePhotos={editablePhotos}
          previewUrls={previewUrls}
          onDeleteExistingPhoto={onDeleteExistingPhoto}
          draggedIndex={draggedIndex}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
          onFileSelect={onFileSelect}
          onRemovePhoto={onRemovePhoto}
        />
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoManagementDialog;
