
import React from 'react';
import HeaderBar from '@/components/HeaderBar';
import NavBar from '@/components/NavBar';
import ConnectionList from '@/components/matches/ConnectionList';
import ProfileDialog from '@/components/matches/ProfileDialog';
import ConnectionChat from '@/components/ConnectionChat';
import { useConnectionsData } from '@/components/matches/useConnectionsData';
import { useDialogsState } from '@/components/matches/useDialogsState';
import ConnectionsHeader from '@/components/matches/ConnectionsHeader';

const MatchesPage = () => {
  const { 
    connections, 
    loading, 
    currentUserID, 
    useTestData, 
    toggleTestData 
  } = useConnectionsData();
  
  const {
    selectedProfile,
    setSelectedProfile,
    chatOpen,
    handleProfileClick,
    handleOpenChat,
    handleChatClose,
    handleMessageSent
  } = useDialogsState();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <HeaderBar />

      <main className="flex-1 p-4 mt-16 mb-20 max-w-3xl mx-auto w-full">
        <ConnectionsHeader 
          useTestData={useTestData} 
          toggleTestData={toggleTestData} 
        />
        
        <ConnectionList 
          connections={connections}
          loading={loading}
          onProfileClick={(profileId) => handleProfileClick(profileId, connections)}
        />
      </main>

      <NavBar />

      {/* Profile Dialog */}
      <ProfileDialog 
        profile={selectedProfile}
        open={!!selectedProfile}
        onOpenChange={(open) => !open && setSelectedProfile(null)}
        onOpenChat={handleOpenChat}
      />

      {/* Chat Dialog */}
      {currentUserID && (
        <ConnectionChat 
          open={chatOpen}
          onOpenChange={handleChatClose}
          connection={selectedProfile}
          currentUserId={currentUserID}
          useTestData={useTestData}
          onMessageSent={handleMessageSent}
        />
      )}
    </div>
  );
};

export default MatchesPage;
