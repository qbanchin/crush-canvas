
import React from 'react';
import { Button } from '@/components/ui/button';
import { ImageIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useState } from 'react';
import PhotoUploadArea from './PhotoUploadArea';
import PhotoPreviewGrid from './PhotoPreviewGrid';
import DraggablePhotoGrid from './DraggablePhotoGrid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");
  const [editablePhotos, setEditablePhotos] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Log the handlers with more detailed information
  console.log('PhotoManagement component with handlers:', {
    hasAddHandler: !!onPhotosAdded,
    hasReorderHandler: !!onPhotosReordered,
    hasDeleteHandler: !!onPhotoDeleted,
    userImagesCount: userImages?.length || 0
  });

  const handleOpenDialog = () => {
    setEditablePhotos([...userImages]);
    setSelectedFiles([]);
    setPreviewUrls([]);
    setActiveTab("edit");
    setIsOpen(true);
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
    if (previewUrls[index]) {
      URL.revokeObjectURL(previewUrls[index]);
    }
    
    const newPreviewUrls = [...previewUrls];
    newPreviewUrls.splice(index, 1);
    setPreviewUrls(newPreviewUrls);
    
    const newSelectedFiles = [...selectedFiles];
    newSelectedFiles.splice(index, 1);
    setSelectedFiles(newSelectedFiles);
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
        setIsOpen(false);
        
        // Clean up object URLs
        previewUrls.forEach(url => URL.revokeObjectURL(url));
        setSelectedFiles([]);
        setPreviewUrls([]);
      } else {
        console.error("Photo upload handler not available");
        toast({
          title: "Photo upload currently unavailable",
          description: "Please try again later.",
          variant: "destructive"
        });
      }
    } else {
      if (typeof onPhotosReordered === 'function') {
        onPhotosReordered(editablePhotos);
        setIsOpen(false);
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
      
      const newPhotos = [...editablePhotos];
      newPhotos.splice(index, 1);
      setEditablePhotos(newPhotos);
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

  return (
    <>
      <Button variant="outline" className="flex-1 gap-2" onClick={handleOpenDialog}>
        <ImageIcon size={16} />
        Edit Photos
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Photos</DialogTitle>
            <DialogDescription>
              Add, remove, or reorder your profile photos.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePhotos}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PhotoManagement;
