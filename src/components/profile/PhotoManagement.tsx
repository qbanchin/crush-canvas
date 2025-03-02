
import React, { useState } from 'react';
import { ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PhotoPreviewGrid from './PhotoPreviewGrid';
import DraggablePhotoGrid from './DraggablePhotoGrid';
import PhotoUploadArea from './PhotoUploadArea';

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

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex-1 gap-2" onClick={handleOpenDialog}>
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
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
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

export default PhotoManagement;
