
import React from 'react';
import HeaderBar from '@/components/HeaderBar';
import NavBar from '@/components/NavBar';
import { ScrollArea } from '@/components/ui/scroll-area';
import EditProfileDialog from '@/components/profile/EditProfileDialog';
import ProfileContent from '@/components/profile/ProfileContent';
import ProfileData from '@/components/profile/ProfileData';
import ProfileImageHandler from '@/components/profile/ProfileImageHandler';
import PhotoManagementHandlers from '@/components/profile/PhotoManagementHandlers';
import ProfileContentHandlers from '@/components/profile/ProfileContentHandlers';
import { ProfileProvider } from '@/contexts/ProfileContext';

const ProfilePage = () => {
  return (
    <ProfileProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <HeaderBar />
        
        <main className="flex-1 pt-16 pb-20">
          <ScrollArea className="h-[calc(100vh-9rem)]">
            <div className="px-4 py-6">
              <ProfileData>
                <ProfileImageHandler>
                  <PhotoManagementHandlers>
                    <ProfileContentHandlers>
                      <ProfileContent />
                    </ProfileContentHandlers>
                  </PhotoManagementHandlers>
                </ProfileImageHandler>
              </ProfileData>
            </div>
          </ScrollArea>
        </main>
        
        <NavBar />
        <EditProfileDialog />
      </div>
    </ProfileProvider>
  );
};

export default ProfilePage;
