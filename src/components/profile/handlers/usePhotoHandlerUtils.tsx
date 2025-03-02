
import React from 'react';
import ProfileContent from '../ProfileContent';
import ProfileContentHandlers from '../ProfileContentHandlers';

export interface PhotoHandlerProps {
  onPhotosAdded?: (newPhotos: string[]) => void;
  onPhotosReordered?: (reorderedPhotos: string[]) => void;
  onPhotoDeleted?: (index: number) => void;
  isAddingPhotos?: boolean;
  isDeletingPhoto?: boolean;
  isReorderingPhotos?: boolean;
}

export const enhanceChildrenWithProps = (
  children: React.ReactNode,
  photoProps: PhotoHandlerProps
): React.ReactNode => {
  try {
    return React.Children.map(children, child => {
      if (!React.isValidElement(child)) {
        return child;
      }

      // If this is ProfileContentHandlers or ProfileContent, pass the props
      if (child.type === ProfileContentHandlers || child.type === ProfileContent) {
        return React.cloneElement(child, photoProps);
      }

      // If the child has children, recursively process them
      if (child.props.children) {
        try {
          const newChildren = enhanceChildrenWithProps(child.props.children, photoProps);
          return React.cloneElement(child, {}, newChildren);
        } catch (error) {
          console.error("Error enhancing nested children:", error);
          // Return original child if enhancement fails
          return child;
        }
      }

      return child;
    });
  } catch (error) {
    console.error("Error in enhanceChildrenWithProps:", error);
    // Return original children if enhancement fails
    return children;
  }
};
