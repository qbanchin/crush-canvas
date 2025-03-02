
import React from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useProfileContext } from '@/contexts/ProfileContext';

const ProfileImageHandler: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const {
    user,
    setUser,
    currentImageIndex,
    setCurrentImageIndex
  } = useProfileContext();

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? user.images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === user.images.length - 1 ? 0 : prev + 1));
  };

  const handleDeleteImage = async (index: number) => {
    try {
      if (user.images.length <= 1) {
        toast({
          title: "Cannot delete image",
          description: "You must have at least one profile photo.",
          variant: "destructive"
        });
        return;
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
      
      const newImages = [...user.images];
      newImages.splice(index, 1);
      
      const { error } = await supabase
        .from('cards')
        .update({ images: newImages })
        .eq('id', authUser.id);
      
      if (error) throw error;
      
      setUser({
        ...user,
        images: newImages
      });
      
      if (index >= newImages.length) {
        setCurrentImageIndex(newImages.length - 1);
      }
      
      toast({
        title: "Photo deleted",
        description: "Your profile photo has been deleted."
      });
    } catch (error: any) {
      toast({
        title: "Error deleting photo",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            handlePrevImage,
            handleNextImage,
            handleDeleteImage
          } as any);
        }
        return child;
      })}
    </div>
  );
};

export default ProfileImageHandler;
