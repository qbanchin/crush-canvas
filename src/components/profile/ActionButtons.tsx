
import React from 'react';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PhotoManagement from './PhotoManagement';

interface ActionButtonsProps {
  onEditProfile: () => void;
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
  // Log the handlers to verify they're being passed correctly
  console.log("ActionButtons - Handlers received:", {
    hasAddHandler: !!onPhotosAdded,
    hasReorderHandler: !!onPhotosReordered,
    hasDeleteHandler: !!onPhotoDeleted
  });
  
  return (
    <div className="flex gap-3 mb-8">
      <Button className="flex-1 gap-2" onClick={onEditProfile}>
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
