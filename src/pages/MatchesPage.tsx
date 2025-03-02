
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
    toggleTestData,
    clearNewMessageFlag,
    deleteConnection
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

  // Function to handle profile clicks that also clears message flags
  const handleProfileSelection = (profileId: string) => {
    // Clear the new message notification for this profile
    clearNewMessageFlag(profileId);
    
    // Handle the profile click (open dialog)
    handleProfileClick(profileId, connections);
  };

  // Function to handle connection deletion
  const handleDeleteConnection = async (connectionId: string) => {
    console.log("Deleting connection:", connectionId);
    
    // Close profile dialog if the deleted connection is currently selected
    if (selectedProfile && selectedProfile.id === connectionId) {
      setSelectedProfile(null);
    }
    
    // Delete the connection
    await deleteConnection(connectionId);
  };

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
          onProfileClick={handleProfileSelection}
          onDeleteConnection={handleDeleteConnection}
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
