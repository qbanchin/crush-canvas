
import React from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useProfileContext } from '@/contexts/ProfileContext';

const ProfileContentHandlers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const { user, setUser, setIsEditProfileOpen, setEditForm } = useProfileContext();

  const handleBioSave = async (newBio: string) => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        toast({
          title: "Error",
          description: "You must be logged in to update your profile",
          variant: "destructive"
        });
        return;
      }
      
      const { error } = await supabase
        .from('cards')
        .update({ bio: newBio })
        .eq('id', authUser.id);
      
      if (error) throw error;
      
      setUser({ ...user, bio: newBio });
      
      toast({
        title: "Bio updated",
        description: "Your bio has been successfully updated."
      });
    } catch (error: any) {
      toast({
        title: "Error updating bio",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleInterestsSave = async (newInterests: string[]) => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        toast({
          title: "Error",
          description: "You must be logged in to update your profile",
          variant: "destructive"
        });
        return;
      }
      
      const { error } = await supabase
        .from('cards')
        .update({ tags: newInterests })
        .eq('id', authUser.id);
      
      if (error) throw error;
      
      setUser({ ...user, interests: newInterests });
      
      toast({
        title: "Interests updated",
        description: "Your interests have been successfully updated."
      });
    } catch (error: any) {
      toast({
        title: "Error updating interests",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleEditProfile = () => {
    setEditForm({
      name: user.name,
      age: user.age,
      location: user.location
    });
    setIsEditProfileOpen(true);
  };

  return (
    <div>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            onBioSave: handleBioSave,
            onInterestsSave: handleInterestsSave,
            onEditProfile: handleEditProfile
          } as any);
        }
        return child;
      })}
    </div>
  );
};

export default ProfileContentHandlers;
