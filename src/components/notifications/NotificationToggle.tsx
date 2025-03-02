
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

interface NotificationToggleProps {
  title: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
}

const NotificationToggle: React.FC<NotificationToggleProps> = ({
  title,
  description,
  checked,
  onToggle
}) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Switch 
          checked={checked} 
          onCheckedChange={onToggle} 
        />
      </div>
      <Separator className="my-4" />
    </>
  );
};

export default NotificationToggle;
