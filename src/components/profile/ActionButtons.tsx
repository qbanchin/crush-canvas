
import React from 'react';
import { Edit, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  onEditProfile: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onEditProfile }) => {
  return (
    <div className="flex gap-3 mb-8">
      <Button className="flex-1 gap-2" onClick={onEditProfile}>
        <Edit size={16} />
        Edit Profile
      </Button>
    </div>
  );
};

export default ActionButtons;
