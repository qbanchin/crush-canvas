
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/data/profiles';

interface UseMessageSubscriptionProps {
  userId: string | null;
  connections: Profile[];
  onNewMessage: (senderId: string) => void;
}

export function useMessageSubscription({ 
  userId,
  connections,
  onNewMessage
}: UseMessageSubscriptionProps) {
  const [unreadMessages, setUnreadMessages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!userId) return;
    
    const channel = supabase
      .channel('message-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          if (payload.new && payload.new.recipient_id === userId) {
            console.log("New message detected from:", payload.new.sender_id);
            // Mark this sender as having a new message
            const senderId = payload.new.sender_id;
            setUnreadMessages(prev => ({
              ...prev,
              [senderId]: true
            }));
            
            // Notify parent component to update UI
            onNewMessage(senderId);
          }
        }
      )
      .subscribe();
    
    // For development - simulate a new message after 5 seconds from a random connection
    if (import.meta.env.DEV) {
      setTimeout(() => {
        if (connections.length > 0) {
          const randomIndex = Math.floor(Math.random() * connections.length);
          const randomConnection = connections[randomIndex];
          
          console.log("Simulating new message from:", randomConnection.name);
          
          setUnreadMessages(prev => ({
            ...prev,
            [randomConnection.id]: true
          }));
          
          // Notify parent component to update UI
          onNewMessage(randomConnection.id);
        }
      }, 5000);
    }
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, connections, onNewMessage]);

  // Function to clear message flags
  const clearNewMessageFlag = (connectionId: string) => {
    setUnreadMessages(prev => ({
      ...prev,
      [connectionId]: false
    }));
  };

  return { unreadMessages, clearNewMessageFlag };
}
