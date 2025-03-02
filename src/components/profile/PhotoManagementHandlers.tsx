
import React from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useProfileContext } from '@/contexts/ProfileContext';
import ProfileContent from './ProfileContent';
import ProfileContentHandlers from './ProfileContentHandlers';

interface PhotoHandlerProps {
  onPhotosAdded?: (newPhotos: string[]) => void;
  onPhotosReordered?: (reorderedPhotos: string[]) => void;
  onPhotoDeleted?: (index: number) => void;
}

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

  console.log("PhotoManagementHandlers - Handlers defined:", {
    handlePhotosAdded: !!handlePhotosAdded,
    handlePhotosReordered: !!handlePhotosReordered,
    handlePhotoDeleted: !!handlePhotoDeleted
  });

  // Use React.Children.map to recursively clone and pass props to all children
  const enhanceChildrenWithProps = (children: React.ReactNode): React.ReactNode => {
    return React.Children.map(children, child => {
      if (!React.isValidElement(child)) {
        return child;
      }

      // Props to pass to immediate children
      const photoProps: PhotoHandlerProps = {
        onPhotosAdded: handlePhotosAdded,
        onPhotosReordered: handlePhotosReordered,
        onPhotoDeleted: handlePhotoDeleted
      };

      // If this is ProfileContentHandlers or ProfileContent, pass the props
      if (child.type === ProfileContentHandlers || child.type === ProfileContent) {
        return React.cloneElement(child, photoProps);
      }

      // If the child has children, recursively process them
      if (child.props.children) {
        const newChildren = enhanceChildrenWithProps(child.props.children);
        return React.cloneElement(child, {}, newChildren);
      }

      return child;
    });
  };
  
  return <>{enhanceChildrenWithProps(children)}</>;
};

export default PhotoManagementHandlers;
