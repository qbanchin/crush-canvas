import { useState, useCallback } from 'react';
import { Profile } from '@/data/profiles';

export function useDialogsState() {
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  const handleProfileClick = useCallback((profileId: string, connections: Profile[]) => {
    // Find the profile in connections
    const profile = connections.find(p => p.id === profileId);
    if (profile) {
      setSelectedProfile(profile);
    }
  }, []);

  const handleOpenChat = useCallback(() => {
    if (selectedProfile) {
      setChatOpen(true);
    }
  }, [selectedProfile]);

  const handleChatClose = useCallback((open: boolean) => {
    setChatOpen(open);
    // We keep the selected profile even when chat is closed
    // so that users can reopen the chat with the same profile
  }, []);

  const handleMessageSent = useCallback(() => {
    // This is called when a message is sent successfully
    console.log("Message sent successfully");
    // Keep the chat open after sending a message
  }, []);

  return {
    selectedProfile,
    setSelectedProfile,
    chatOpen,
    setChatOpen,
    handleProfileClick,
    handleOpenChat,
    handleChatClose,
    handleMessageSent
  };
}
