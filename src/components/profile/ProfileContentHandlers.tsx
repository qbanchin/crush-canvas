
import React from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useProfileContext } from '@/contexts/ProfileContext';

interface PhotoHandlerProps {
  onPhotosAdded?: (newPhotos: string[]) => void;
  onPhotosReordered?: (reorderedPhotos: string[]) => void;
  onPhotoDeleted?: (index: number) => void;
}

const ProfileContentHandlers: React.FC<{ 
  children: React.ReactNode;
  onPhotosAdded?: (newPhotos: string[]) => void;
  onPhotosReordered?: (reorderedPhotos: string[]) => void;
  onPhotoDeleted?: (index: number) => void;
}> = ({ 
  children,
  onPhotosAdded,
  onPhotosReordered,
  onPhotoDeleted
}) => {
  const { toast } = useToast();
  const { user, setUser, setIsEditProfileOpen, setEditForm } = useProfileContext();

  // Log to verify handlers are received at this level
  console.log("ProfileContentHandlers - Handlers received:", {
    onPhotosAdded: !!onPhotosAdded,
    onPhotosReordered: !!onPhotosReordered,
    onPhotoDeleted: !!onPhotoDeleted
  });

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
            onEditProfile: handleEditProfile,
            onPhotosAdded: onPhotosAdded,
            onPhotosReordered: onPhotosReordered,
            onPhotoDeleted: onPhotoDeleted
          } as any);
        }
        return child;
      })}
    </div>
  );
};

export default ProfileContentHandlers;
