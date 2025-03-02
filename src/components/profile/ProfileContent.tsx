
import React from 'react';
import { Separator } from '@/components/ui/separator';
import ProfileHeader from '@/components/profile/ProfileHeader';
import BioEditor from '@/components/profile/BioEditor';
import InterestsEditor from '@/components/profile/InterestsEditor';
import ProfileSettings from '@/components/profile/ProfileSettings';
import ActionButtons from '@/components/profile/ActionButtons';
import { Skeleton } from "@/components/ui/skeleton";
import { useProfileContext } from '@/contexts/ProfileContext';

const ProfileContent: React.FC<{
  handlePrevImage?: (e: React.MouseEvent) => void;
  handleNextImage?: (e: React.MouseEvent) => void;
  handleDeleteImage?: (index: number) => void;
  onBioSave?: (newBio: string) => void;
  onInterestsSave?: (newInterests: string[]) => void;
  onEditProfile?: () => void;
  onPhotosAdded?: (newPhotos: string[]) => void;
  onPhotosReordered?: (reorderedPhotos: string[]) => void;
  onPhotoDeleted?: (index: number) => void;
}> = ({
  handlePrevImage,
  handleNextImage,
  handleDeleteImage,
  onBioSave,
  onInterestsSave,
  onEditProfile,
  onPhotosAdded,
  onPhotosReordered,
  onPhotoDeleted
}) => {
  const {
    user,
    loading,
    currentImageIndex,
    showOnlineStatus,
    setShowOnlineStatus,
    showActivity,
    setShowActivity,
    distanceUnit,
    setDistanceUnit
  } = useProfileContext();

  // Log to debug images
  console.log('ProfileContent - User images:', user.images?.length, 'Current index:', currentImageIndex);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-end relative mb-6">
          <Skeleton className="w-24 h-24 rounded-full" />
          <div className="ml-4 flex-1">
            <Skeleton className="h-8 w-[200px] mb-2" />
            <Skeleton className="h-4 w-[120px]" />
          </div>
        </div>
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-24 w-full mb-4" />
        <Skeleton className="h-16 w-full mb-4" />
      </div>
    );
  }

  return (
    <>
      <ProfileHeader
        user={{
          ...user,
          images: user.images || ["/placeholder.svg"] // Ensure images is always an array
        }}
        currentImageIndex={currentImageIndex}
        handlePrevImage={handlePrevImage}
        handleNextImage={handleNextImage}
        handleDeleteImage={handleDeleteImage}
        showOnlineStatus={showOnlineStatus}
        setShowOnlineStatus={setShowOnlineStatus}
        showActivity={showActivity}
        setShowActivity={setShowActivity}
        distanceUnit={distanceUnit}
        setDistanceUnit={setDistanceUnit}
      />
      
      <ActionButtons 
        onEditProfile={onEditProfile}
        userImages={user.images || []}
        onPhotosAdded={onPhotosAdded}
        onPhotosReordered={onPhotosReordered}
        onPhotoDeleted={onPhotoDeleted || handleDeleteImage}
      />
      
      <BioEditor 
        bio={user.bio}
        onBioSave={onBioSave}
      />
      
      <InterestsEditor 
        interests={user.interests}
        onInterestsSave={onInterestsSave}
      />
      
      <Separator className="my-6" />
      
      <ProfileSettings />
    </>
  );
};

export default ProfileContent;
