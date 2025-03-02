
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/contexts/ProfileContext';

export const usePhotoReorderHandler = (
  user: UserProfile,
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>,
  setCurrentImageIndex: React.Dispatch<React.SetStateAction<number>>
) => {
  const { toast } = useToast();

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
      
      console.log("Reordering photos:", reorderedPhotos);
      
      const { error } = await supabase
        .from('cards')
        .update({ images: reorderedPhotos })
        .eq('id', authUser.id);
      
      if (error) {
        console.error("Supabase error reordering images:", error);
        throw error;
      }
      
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

  return { handlePhotosReordered };
};
