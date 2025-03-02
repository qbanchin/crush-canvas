
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface SettingsLinkProps {
  title: string;
  to?: string;
  onClick?: () => void;
}

export const SettingsLink: React.FC<SettingsLinkProps> = ({ title, to, onClick }) => {
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
  
  if (onClick) {
    return (
      <div 
        className="flex justify-between items-center p-3 rounded-lg hover:bg-muted/30 cursor-pointer transition-colors"
        onClick={onClick}
      >
        <span>{title}</span>
        <ChevronRight size={18} className="text-muted-foreground" />
      </div>
    );
  }
  
  return (
    <div className="flex justify-between items-center p-3 rounded-lg hover:bg-muted/30 cursor-pointer transition-colors">
      <span>{title}</span>
      <ChevronRight size={18} className="text-muted-foreground" />
    </div>
  );
};

const PasswordChangeForm = ({ onCancel }: { onCancel: () => void }) => {
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validation
    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation don't match",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    // Here you would normally call an API to change the password
    setTimeout(() => {
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully"
      });
      setIsLoading(false);
      onCancel();
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div>
        <label htmlFor="current-password" className="text-sm font-medium block mb-1">
          Current Password
        </label>
        <Input
          id="current-password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          placeholder="Enter your current password"
        />
      </div>
      
      <div>
        <label htmlFor="new-password" className="text-sm font-medium block mb-1">
          New Password
        </label>
        <Input
          id="new-password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          placeholder="Enter your new password"
        />
      </div>
      
      <div>
        <label htmlFor="confirm-password" className="text-sm font-medium block mb-1">
          Confirm New Password
        </label>
        <Input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          placeholder="Confirm your new password"
        />
      </div>
      
      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="outline" 
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Password"}
        </Button>
      </div>
    </form>
  );
};

const ProfileSettings: React.FC = () => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  return (
    <div className="space-y-4">
      <SettingsLink title="Explore Settings" to="/settings/explore" />
      <SettingsLink title="Notification Settings" />
      <SettingsLink title="Privacy Settings" />
      <SettingsLink 
        title="Change Password" 
        onClick={() => setShowPasswordForm(true)} 
      />
      <SettingsLink title="Help & Support" />
      
      {showPasswordForm && (
        <>
          <Separator className="my-4" />
          <PasswordChangeForm onCancel={() => setShowPasswordForm(false)} />
        </>
      )}
    </div>
  );
};

export default ProfileSettings;
