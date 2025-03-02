
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
    // If chat is closed and there was an error, reset selected profile
    if (!open && !selectedProfile) {
      setSelectedProfile(null);
    }
  };

  const handleMessageSent = () => {
    // This is called when a message is sent successfully
    // We could use this to refresh connections if needed
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
