
import React from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useProfileContext } from '@/contexts/ProfileContext';

const PhotoManagementHandlers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const { user, setUser, setCurrentImageIndex } = useProfileContext();

  const handlePhotosAdded = async (newPhotos: string[]) => {
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
      
      const updatedImages = [...user.images, ...newPhotos];
      
      const { error } = await supabase
        .from('cards')
        .update({ images: updatedImages })
        .eq('id', authUser.id);
      
      if (error) throw error;
      
      setUser({
        ...user,
        images: updatedImages
      });
      
      toast({
        title: "Photos added",
        description: `${newPhotos.length} photo(s) added to your profile.`
      });
    } catch (error: any) {
      console.error("Error adding photos:", error);
      toast({
        title: "Error adding photos",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handlePhotosReordered = async (reorderedPhotos: string[]) => {
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
        .update({ images: reorderedPhotos })
        .eq('id', authUser.id);
      
      if (error) throw error;
      
      setUser({
        ...user,
        images: reorderedPhotos
      });
      
      setCurrentImageIndex(0);
      
      toast({
        title: "Photos reordered",
        description: "Your profile photos have been reordered successfully."
      });
    } catch (error: any) {
      console.error("Error reordering photos:", error);
      toast({
        title: "Error reordering photos",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handlePhotoDeleted = async (index: number) => {
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
      
      const updatedImages = [...user.images];
      updatedImages.splice(index, 1);
      
      const { error } = await supabase
        .from('cards')
        .update({ images: updatedImages })
        .eq('id', authUser.id);
      
      if (error) throw error;
      
      setUser({
        ...user,
        images: updatedImages
      });
      
      setCurrentImageIndex(0);
      
      toast({
        title: "Photo deleted",
        description: "Your profile photo has been deleted successfully."
      });
    } catch (error: any) {
      console.error("Error deleting photo:", error);
      toast({
        title: "Error deleting photo",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Make sure we explicitly pass these handlers to all children
  return (
    <>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            onPhotosAdded: handlePhotosAdded,
            onPhotosReordered: handlePhotosReordered,
            onPhotoDeleted: handlePhotoDeleted
          } as any);
        }
        return child;
      })}
    </>
  );
};

export default PhotoManagementHandlers;
