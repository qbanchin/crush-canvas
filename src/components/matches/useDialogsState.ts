
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
    // Only reset selected profile when chat is closed
    if (!open) {
      // Don't reset the selected profile when chat is closed
      // This was causing the issue where chat couldn't work between profiles
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
