
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/contexts/ProfileContext';

export const usePhotoReorderHandler = (
  user: UserProfile,
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>,
  setCurrentImageIndex: React.Dispatch<React.SetStateAction<number>>
) => {
  const { toast } = useToast();
  const [isReordering, setIsReordering] = useState(false);

  const handlePhotosReordered = async (reorderedPhotos: string[]) => {
    // Prevent concurrent reordering operations
    if (isReordering) {
      toast({
        title: "Reordering in progress",
        description: "Please wait for the current operation to complete.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsReordering(true);

      // Validate the reordered photos array
      if (!reorderedPhotos || !Array.isArray(reorderedPhotos)) {
        throw new Error("Invalid photo data provided");
      }
      
      // Make sure we're not losing any photos in the reordering process
      if (reorderedPhotos.length !== user.images.length) {
        console.error("Photo count mismatch:", {
          originalCount: user.images.length,
          newCount: reorderedPhotos.length
        });
        
        if (reorderedPhotos.length === 0) {
          throw new Error("Cannot remove all photos during reordering");
        }
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
      
      console.log("Reordering photos:", reorderedPhotos.length);
      
      // Create a timeout to fail the operation if it takes too long
      const timeoutId = setTimeout(() => {
        if (isReordering) {
          setIsReordering(false);
          toast({
            title: "Operation timed out",
            description: "The reordering operation took too long. Please try again.",
            variant: "destructive"
          });
        }
      }, 10000); // 10 second timeout
      
      const { error } = await supabase
        .from('cards')
        .update({ images: reorderedPhotos })
        .eq('id', authUser.id);
      
      clearTimeout(timeoutId);
      
      if (error) {
        console.error("Supabase error reordering images:", error);
        throw error;
      }
      
      setUser({
        ...user,
        images: reorderedPhotos
      });
      
      // Reset current image index to the first image for consistency
      setCurrentImageIndex(0);
      
      toast({
        title: "Photos reordered",
        description: "Your profile photos have been reordered successfully."
      });
    } catch (error: any) {
      console.error("Error reordering photos:", error);
      toast({
        title: "Error reordering photos",
        description: error.message || "Failed to reorder photos. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsReordering(false);
    }
  };

  return { handlePhotosReordered, isReordering };
};
