
import React from 'react';
import { Button } from '@/components/ui/button';
import { ImageIcon } from 'lucide-react';
import PhotoManagementDialog from './PhotoManagementDialog';
import { usePhotoManagement } from './hooks/usePhotoManagement';

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
  console.log("PhotoManagement - Handlers defined:", {
    onPhotosAdded: !!onPhotosAdded,
    onPhotosReordered: !!onPhotosReordered,
    onPhotoDeleted: !!onPhotoDeleted
  });

  const { state, handlers } = usePhotoManagement(
    userImages,
    { onPhotosAdded, onPhotosReordered, onPhotoDeleted }
  );

  return (
    <>
      <Button 
        variant="outline" 
        className="flex-1 gap-2" 
        onClick={handlers.handleOpenDialog}
      >
        <ImageIcon size={16} />
        Edit Photos
      </Button>
      
      <PhotoManagementDialog 
        isOpen={state.isOpen}
        onOpenChange={handlers.handleCloseDialog}
        state={state}
        handlers={handlers}
      />
    </>
  );
};

export default PhotoManagement;
