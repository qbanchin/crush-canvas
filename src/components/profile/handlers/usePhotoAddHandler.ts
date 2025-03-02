
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/contexts/ProfileContext';

export const usePhotoAddHandler = (
  user: UserProfile,
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>
) => {
  const { toast } = useToast();

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
      
      console.log("Adding photos:", newPhotos);
      
      // Create a copy of existing images and add new ones
      const updatedImages = [...user.images];
      
      // Filter out placeholder image if it's the only one
      if (updatedImages.length === 1 && updatedImages[0] === '/placeholder.svg') {
        updatedImages.length = 0;
      }
      
      // Add new photos
      updatedImages.push(...newPhotos);
      
      // Update the database
      const { error } = await supabase
        .from('cards')
        .update({ images: updatedImages })
        .eq('id', authUser.id);
      
      if (error) {
        console.error("Supabase error updating images:", error);
        throw error;
      }
      
      // Update local state
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

  return { handlePhotosAdded };
};
