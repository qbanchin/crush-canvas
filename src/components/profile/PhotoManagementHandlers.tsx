
import React from 'react';
import { useProfileContext } from '@/contexts/ProfileContext';
import { usePhotoAddHandler } from './handlers/usePhotoAddHandler';
import { usePhotoReorderHandler } from './handlers/usePhotoReorderHandler';
import { usePhotoDeleteHandler } from './handlers/usePhotoDeleteHandler';
import { enhanceChildrenWithProps, PhotoHandlerProps } from './handlers/usePhotoHandlerUtils';

const PhotoManagementHandlers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, setUser, setCurrentImageIndex } = useProfileContext();

  // Use the extracted handler hooks
  const { handlePhotosAdded } = usePhotoAddHandler(user, setUser);
  const { handlePhotosReordered } = usePhotoReorderHandler(user, setUser, setCurrentImageIndex);
  const { handlePhotoDeleted } = usePhotoDeleteHandler(user, setUser, setCurrentImageIndex);

  console.log("PhotoManagementHandlers - Handlers defined:", {
    handlePhotosAdded: !!handlePhotosAdded,
    handlePhotosReordered: !!handlePhotosReordered,
    handlePhotoDeleted: !!handlePhotoDeleted
  });

  // Props to pass to immediate children
  const photoProps: PhotoHandlerProps = {
    onPhotosAdded: handlePhotosAdded,
    onPhotosReordered: handlePhotosReordered,
    onPhotoDeleted: handlePhotoDeleted
  };
  
  return <>{enhanceChildrenWithProps(children, photoProps)}</>;
};

export default PhotoManagementHandlers;
