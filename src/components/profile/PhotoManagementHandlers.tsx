
import React from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useProfileContext } from '@/contexts/ProfileContext';
import ProfileContent from './ProfileContent';
import ProfileContentHandlers from './ProfileContentHandlers';

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
      
      console.log("Adding photos:", newPhotos);
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
      
      console.log("Reordering photos:", reorderedPhotos);
      
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
      
      console.log("Deleting photo at index:", index);
      
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

  // Log the handlers to verify they're defined
  console.log("PhotoManagementHandlers - Handlers defined:", {
    handlePhotosAdded: !!handlePhotosAdded,
    handlePhotosReordered: !!handlePhotosReordered,
    handlePhotoDeleted: !!handlePhotoDeleted
  });

  // Only clone element if it's a component that can accept these props
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      // Check if child is ProfileContent or ProfileContentHandlers
      if (child.type === ProfileContent || child.type === ProfileContentHandlers) {
        return React.cloneElement(child, {
          onPhotosAdded: handlePhotosAdded,
          onPhotosReordered: handlePhotosReordered, 
          onPhotoDeleted: handlePhotoDeleted
        });
      }
      // For other elements, just return them as is
      return child;
    }
    return child;
  });
  
  return <>{childrenWithProps}</>;
};

export default PhotoManagementHandlers;
