
import React, { useRef, useState } from 'react';
import { Camera, Upload, Trash2, ImageIcon, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PhotoManagementProps {
  userImages: string[];
  onPhotosAdded: (newPhotos: string[]) => void;
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("add");
  const [editablePhotos, setEditablePhotos] = useState<string[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Initialize editable photos when dialog opens
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

      onPhotosAdded(previewUrls);

      setSelectedFiles([]);
      setPreviewUrls([]);
      toast({
        title: "Photos added",
        description: `${selectedFiles.length} photo(s) added to your profile.`
      });
    } else {
      // Handle saving reordered photos
      if (onPhotosReordered) {
        onPhotosReordered(editablePhotos);
        toast({
          title: "Photos updated",
          description: "Your photo order has been updated."
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
    
    // Notify parent component
    if (onPhotoDeleted) {
      onPhotoDeleted(index);
    }
  };

  const handleTriggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    // Reorder the photos
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
            {editablePhotos.length > 0 ? (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Your Photos ({editablePhotos.length})</h4>
                <p className="text-xs text-muted-foreground mb-2">Drag photos to reorder. Your first photo will be your main profile photo.</p>
                <div className="grid grid-cols-3 gap-2">
                  {editablePhotos.map((url, index) => (
                    <div 
                      key={index} 
                      className={`relative aspect-square rounded-md overflow-hidden bg-muted cursor-move border-2 ${
                        draggedIndex === index ? 'border-primary' : 'border-transparent'
                      }`}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                    >
                      <img 
                        src={url} 
                        alt={`Photo ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 left-1 bg-black/50 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {index + 1}
                      </div>
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => handleDeleteExistingPhoto(index)}
                      >
                        <Trash2 size={14} />
                      </Button>
                      <Move className="absolute bottom-1 right-1 h-5 w-5 text-white opacity-75" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-4 border border-dashed rounded-md">
                <ImageIcon size={48} className="text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No photos to edit</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="add" className="space-y-4 py-4">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
            />
            
            <Button 
              variant="outline" 
              className="w-full h-20 flex flex-col justify-center items-center gap-2"
              onClick={handleTriggerFileInput}
            >
              <Upload size={24} />
              <span>Select Photos</span>
            </Button>
            
            {previewUrls.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Selected Photos ({previewUrls.length})</h4>
                <div className="grid grid-cols-3 gap-2">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative aspect-square rounded-md overflow-hidden bg-muted">
                      <img 
                        src={url} 
                        alt={`Preview ${index}`} 
                        className="w-full h-full object-cover"
                      />
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => handleRemovePhoto(index)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
