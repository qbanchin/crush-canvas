
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/contexts/ProfileContext';

export const usePhotoDeleteHandler = (
  user: UserProfile,
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>,
  setCurrentImageIndex: React.Dispatch<React.SetStateAction<number>>
) => {
  const { toast } = useToast();

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
      
      console.log("Deleting photo at index:", index);
      
      const updatedImages = [...user.images];
      updatedImages.splice(index, 1);
      
      // If all photos are deleted, add placeholder back
      if (updatedImages.length === 0) {
        updatedImages.push('/placeholder.svg');
      }
      
      const { error } = await supabase
        .from('cards')
        .update({ images: updatedImages })
        .eq('id', authUser.id);
      
      if (error) {
        console.error("Supabase error deleting image:", error);
        throw error;
      }
      
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

  return { handlePhotoDeleted };
};
