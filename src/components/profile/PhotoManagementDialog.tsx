import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PhotoUploadArea from './PhotoUploadArea';
import PhotoPreviewGrid from './PhotoPreviewGrid';
import DraggablePhotoGrid from './DraggablePhotoGrid';
import { PhotoManagementState } from './hooks/types/photoManagementTypes';

interface PhotoManagementDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  state: Omit<PhotoManagementState, 'isOpen'>;
  handlers: {
    handleChangeTab: (tab: string) => void;
    handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleRemovePhoto: (index: number) => void;
    handleSavePhotos: () => void;
    handleDeleteExistingPhoto: (index: number) => void;
    handleDragStart: (index: number) => void;
    handleDragOver: (e: React.DragEvent, index: number) => void;
    handleDragEnd: () => void;
  };
}

const PhotoManagementDialog: React.FC<PhotoManagementDialogProps> = ({
  isOpen,
  onOpenChange,
  state,
  handlers
}) => {
  const { activeTab, editablePhotos, previewUrls, draggedIndex } = state;
  const {
    handleChangeTab,
    handleFileSelect,
    handleRemovePhoto,
    handleSavePhotos,
    handleDeleteExistingPhoto,
    handleDragStart,
    handleDragOver,
    handleDragEnd
  } = handlers;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Photos</DialogTitle>
          <DialogDescription>
            Add, remove, or reorder your profile photos.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={handleChangeTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit">Edit Existing</TabsTrigger>
            <TabsTrigger value="add">Add New</TabsTrigger>
          </TabsList>
          
          <TabsContent value="edit" className="space-y-4 py-4">
            <DraggablePhotoGrid 
              photos={editablePhotos}
              draggedIndex={draggedIndex}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              onDeletePhoto={handleDeleteExistingPhoto}
            />
          </TabsContent>
          
          <TabsContent value="add" className="space-y-4 py-4">
            <PhotoUploadArea onFileSelect={handleFileSelect} />
            <PhotoPreviewGrid 
              previewUrls={previewUrls}
              onRemovePhoto={handleRemovePhoto}
            />
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSavePhotos}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoManagementDialog;
