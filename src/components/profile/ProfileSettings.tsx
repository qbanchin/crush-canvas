
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

interface SettingsLinkProps {
  title: string;
  to?: string;
}

export const SettingsLink: React.FC<SettingsLinkProps> = ({ title, to }) => {
  if (to) {
    return (
      <Link to={to} className="block">
        <div className="flex justify-between items-center p-3 rounded-lg hover:bg-muted/30 cursor-pointer transition-colors">
          <span>{title}</span>
          <ChevronRight size={18} className="text-muted-foreground" />
        </div>
      </Link>
    );
  }
  
  return (
    <div className="flex justify-between items-center p-3 rounded-lg hover:bg-muted/30 cursor-pointer transition-colors">
      <span>{title}</span>
      <ChevronRight size={18} className="text-muted-foreground" />
    </div>
  );
};

const ProfileSettings: React.FC = () => {
  return (
    <div className="space-y-4">
      <SettingsLink title="Explore Settings" to="/settings/explore" />
      <SettingsLink title="Notification Settings" />
      <SettingsLink title="Privacy Settings" />
      <SettingsLink title="Help & Support" />
    </div>
  );
};

export default ProfileSettings;
