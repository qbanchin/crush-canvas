
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import PhotoManagement from './PhotoManagement';

interface ActionButtonsProps {
  onEditProfile?: () => void;
  userImages: string[];
  onPhotosAdded?: (newPhotos: string[]) => void;
  onPhotosReordered?: (reorderedPhotos: string[]) => void;
  onPhotoDeleted?: (index: number) => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  onEditProfile,
  userImages,
  onPhotosAdded,
  onPhotosReordered,
  onPhotoDeleted
}) => {
  console.log("ActionButtons - Handlers defined:", {
    onPhotosAdded: !!onPhotosAdded,
    onPhotosReordered: !!onPhotosReordered,
    onPhotoDeleted: !!onPhotoDeleted
  });
  
  return (
    <div className="flex flex-row gap-4 my-4">
      <Button 
        variant="outline" 
        className="flex-1 gap-2" 
        onClick={onEditProfile}
      >
        <Edit size={16} />
        Edit Profile
      </Button>
      
      <PhotoManagement 
        userImages={userImages}
        onPhotosAdded={onPhotosAdded}
        onPhotosReordered={onPhotosReordered}
        onPhotoDeleted={onPhotoDeleted}
      />
    </div>
  );
};

export default ActionButtons;
