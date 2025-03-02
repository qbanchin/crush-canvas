import { useState } from 'react';
import { Profile } from '@/data/profiles';

export function useDialogsState() {
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  const handleProfileClick = (profileId: string, connections: Profile[]) => {
    // Find the profile in connections
    const profile = connections.find(p => p.id === profileId);
    if (profile) {
      setSelectedProfile(profile);
    }
  };

  const handleOpenChat = () => {
    if (selectedProfile) {
      setChatOpen(true);
    }
  };

  const handleChatClose = (open: boolean) => {
    setChatOpen(open);
    // We keep the selected profile even when chat is closed
    // so that users can reopen the chat with the same profile
  };

  const handleMessageSent = () => {
    // This is called when a message is sent successfully
    // We could use this to refresh connections if needed
    console.log("Message sent successfully");
  };

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
