
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

export interface SettingToggleProps {
  title: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
  showSeparator?: boolean;
}

const SettingToggle: React.FC<SettingToggleProps> = ({
  title,
  description,
  checked,
  onToggle,
  showSeparator = true
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
      {showSeparator && <Separator className="my-4" />}
    </>
  );
};

export default SettingToggle;
