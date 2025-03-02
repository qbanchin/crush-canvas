
import React from 'react';
import { Edit, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PhotoManagement from './PhotoManagement';

interface ActionButtonsProps {
  onEditProfile: () => void;
  userImages: string[];
  onPhotosAdded: (newPhotos: string[]) => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  onEditProfile, 
  userImages, 
  onPhotosAdded
}) => {
  return (
    <div className="flex gap-3 mb-8">
      <Button className="flex-1 gap-2" onClick={onEditProfile}>
        <Edit size={16} />
        Edit Profile
      </Button>
      <PhotoManagement 
        userImages={userImages}
        onPhotosAdded={onPhotosAdded}
      />
    </div>
  );
};

export default ActionButtons;
