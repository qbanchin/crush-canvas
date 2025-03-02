
import React, { useRef, useState } from 'react';
import { Camera, Upload, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface PhotoManagementProps {
  userImages: string[];
  onPhotosAdded: (newPhotos: string[]) => void;
}

const PhotoManagement: React.FC<PhotoManagementProps> = ({
  userImages,
  onPhotosAdded
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isAddingPhotos, setIsAddingPhotos] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

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
    setIsAddingPhotos(false);

    toast({
      title: "Photos added",
      description: `${selectedFiles.length} photo(s) added to your profile.`
    });
  };

  const handleTriggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Dialog open={isAddingPhotos} onOpenChange={setIsAddingPhotos}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex-1 gap-2">
          <Camera size={16} />
          Add Photos
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Photos</DialogTitle>
          <DialogDescription>
            Add new photos to your profile. Choose high-quality images to make a great impression.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
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
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsAddingPhotos(false)}>
            Cancel
          </Button>
          <Button onClick={handleSavePhotos}>
            Add to Profile
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoManagement;
