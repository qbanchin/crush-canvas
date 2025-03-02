
import React, { useState } from 'react';
import HeaderBar from '@/components/HeaderBar';
import NavBar from '@/components/NavBar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import ProfileHeader from '@/components/profile/ProfileHeader';
import BioEditor from '@/components/profile/BioEditor';
import InterestsEditor from '@/components/profile/InterestsEditor';
import PhotoManagement from '@/components/profile/PhotoManagement';
import ProfileSettings, { SettingsLink } from '@/components/profile/ProfileSettings';
import ActionButtons from '@/components/profile/ActionButtons';

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: "Alex Morgan",
    age: 29,
    bio: "Coffee enthusiast, amateur photographer, and hiking lover.",
    location: "San Francisco",
    images: [
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80",
    ],
    interests: ["Coffee", "Photography", "Hiking", "Music", "Travel"]
  });

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [showActivity, setShowActivity] = useState(true);
  const [distanceUnit, setDistanceUnit] = useState("km");

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? user.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === user.images.length - 1 ? 0 : prev + 1));
  };

  const handleBioSave = (newBio: string) => {
    setUser({ ...user, bio: newBio });
  };

  const handleInterestsSave = (newInterests: string[]) => {
    setUser({ ...user, interests: newInterests });
  };

  const handlePhotosAdded = (newPhotos: string[]) => {
    setUser({
      ...user,
      images: [...user.images, ...newPhotos]
    });
  };

  const handleEditProfile = () => {
    // Future functionality for edit profile button
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderBar />
      
      <main className="flex-1 pt-16 pb-20">
        <ScrollArea className="h-[calc(100vh-9rem)]">
          <div className="px-4 py-6">
            <ProfileHeader
              user={user}
              currentImageIndex={currentImageIndex}
              handlePrevImage={handlePrevImage}
              handleNextImage={handleNextImage}
              showOnlineStatus={showOnlineStatus}
              setShowOnlineStatus={setShowOnlineStatus}
              showActivity={showActivity}
              setShowActivity={setShowActivity}
              distanceUnit={distanceUnit}
              setDistanceUnit={setDistanceUnit}
            />
            
            <div className="flex gap-3 mb-8">
              <ActionButtons onEditProfile={handleEditProfile} />
              <PhotoManagement 
                userImages={user.images}
                onPhotosAdded={handlePhotosAdded}
              />
            </div>
            
            <BioEditor 
              bio={user.bio}
              onBioSave={handleBioSave}
            />
            
            <InterestsEditor 
              interests={user.interests}
              onInterestsSave={handleInterestsSave}
            />
            
            <Separator className="my-6" />
            
            <ProfileSettings />
          </div>
        </ScrollArea>
      </main>
      
      <NavBar />
    </div>
  );
};

export default ProfilePage;
