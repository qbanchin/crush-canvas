import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/contexts/ProfileContext';

export const usePhotoDeleteHandler = (
  user: UserProfile,
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>,
  setCurrentImageIndex: React.Dispatch<React.SetStateAction<number>>
) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handlePhotoDeleted = async (index: number) => {
    // Prevent concurrent delete operations
    if (isDeleting) {
      toast({
        title: "Delete in progress",
        description: "Please wait for the current operation to complete.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsDeleting(true);
      
      // Validate index
      if (index < 0 || index >= user.images.length) {
        throw new Error(`Invalid index: ${index}. Photo doesn't exist.`);
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
      
      console.log("Deleting photo at index:", index);
      
      // Check if this would delete the last photo
      if (user.images.length <= 1) {
        toast({
          title: "Cannot delete",
          description: "You must have at least one profile photo.",
          variant: "destructive"
        });
        return;
      }
      
      const updatedImages = [...user.images];
      updatedImages.splice(index, 1);
      
      // If all photos are deleted (shouldn't happen due to above check), add placeholder back
      if (updatedImages.length === 0) {
        updatedImages.push('/placeholder.svg');
      }
      
      // Create a timeout to fail the operation if it takes too long
      const timeoutId = setTimeout(() => {
        if (isDeleting) {
          setIsDeleting(false);
          toast({
            title: "Operation timed out",
            description: "The delete operation took too long. Please try again.",
            variant: "destructive"
          });
        }
      }, 10000); // 10 second timeout
      
      const { error } = await supabase
        .from('cards')
        .update({ images: updatedImages })
        .eq('id', authUser.id);
      
      clearTimeout(timeoutId);
      
      if (error) {
        console.error("Supabase error deleting image:", error);
        throw error;
      }
      
      // Update current image index to avoid out-of-bounds
      if (index >= updatedImages.length) {
        setCurrentImageIndex(Math.max(0, updatedImages.length - 1));
      } else if (index === user.images.length - 1) {
        // If we deleted the last image, move to the new last image
        setCurrentImageIndex(Math.max(0, updatedImages.length - 1));
      } else {
        // Keep the same index unless it's invalid
        setCurrentImageIndex(prevIndex => 
          prevIndex >= updatedImages.length ? Math.max(0, updatedImages.length - 1) : prevIndex
        );
      }
      
      setUser({
        ...user,
        images: updatedImages
      });
      
      toast({
        title: "Photo deleted",
        description: "Your profile photo has been deleted successfully."
      });
    } catch (error: any) {
      console.error("Error deleting photo:", error);
      toast({
        title: "Error deleting photo",
        description: error.message || "An unexpected error occurred while deleting the photo.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return { handlePhotoDeleted, isDeleting };
};
