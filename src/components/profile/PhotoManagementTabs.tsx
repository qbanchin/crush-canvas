
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DraggablePhotoGrid from './DraggablePhotoGrid';
import PhotoUploadArea from './PhotoUploadArea';
import PhotoPreviewGrid from './PhotoPreviewGrid';

interface PhotoManagementTabsProps {
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

const PhotoManagementTabs: React.FC<PhotoManagementTabsProps> = ({
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
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="edit">Edit Existing</TabsTrigger>
        <TabsTrigger value="add">Add New</TabsTrigger>
      </TabsList>
      
      <TabsContent value="edit" className="space-y-4 py-4">
        <DraggablePhotoGrid 
          photos={editablePhotos}
          draggedIndex={draggedIndex}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
          onDeletePhoto={onDeleteExistingPhoto}
        />
      </TabsContent>
      
      <TabsContent value="add" className="space-y-4 py-4">
        <PhotoUploadArea onFileSelect={onFileSelect} />
        <PhotoPreviewGrid 
          previewUrls={previewUrls}
          onRemovePhoto={onRemovePhoto}
        />
      </TabsContent>
    </Tabs>
  );
};

export default PhotoManagementTabs;
