import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/contexts/ProfileContext';

export const usePhotoAddHandler = (
  user: UserProfile,
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>
) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePhotosAdded = async (newPhotos: string[]) => {
    // Prevent multiple simultaneous uploads
    if (isProcessing) {
      toast({
        title: "Upload in progress",
        description: "Please wait for the current upload to complete.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsProcessing(true);

      if (!newPhotos || newPhotos.length === 0) {
        throw new Error("No photos provided for upload");
      }

      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        toast({
          title: "Error",
          description: "You must be logged in to update your profile",
          variant: "destructive"
        });
        return;
      }
      
      console.log("Adding photos:", newPhotos.length);
      
      // Create a copy of existing images and add new ones
      const updatedImages = [...user.images];
      
      // Filter out placeholder image if it's the only one
      if (updatedImages.length === 1 && updatedImages[0] === '/placeholder.svg') {
        updatedImages.length = 0;
      }
      
      // Validate each photo before adding
      for (const photo of newPhotos) {
        if (!photo || typeof photo !== 'string') {
          console.error("Invalid photo format detected", photo);
          continue; // Skip invalid photos instead of failing
        }
        
        // Check if the string is a valid base64 or URL
        if (!(photo.startsWith('data:') || photo.startsWith('http'))) {
          console.error("Photo has invalid format", photo.substring(0, 50) + "...");
          continue; // Skip invalid format
        }
        
        updatedImages.push(photo);
      }
      
      if (updatedImages.length === 0) {
        // If all photos were invalid, keep placeholder
        updatedImages.push('/placeholder.svg');
        throw new Error("All provided photos were invalid");
      }
      
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
        description: error.message || "Failed to process images. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return { handlePhotosAdded, isProcessing };
};
