
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ExtendedProfile } from '../types/connectionTypes';

interface MessageSubscriptionProps {
  userId: string;
  connections: ExtendedProfile[];
  setUnreadMessages: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  setConnections: React.Dispatch<React.SetStateAction<ExtendedProfile[]>>;
}

export function useMessageSubscription({
  userId,
  connections,
  setUnreadMessages,
  setConnections
}: MessageSubscriptionProps) {
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
            setUnreadMessages(prev => ({
              ...prev,
              [payload.new.sender_id]: true
            }));
            
            // Update connections list to show the notification
            setConnections(currentConnections => 
              currentConnections.map(conn => 
                conn.id === payload.new.sender_id 
                  ? { ...conn, hasNewMessage: true } 
                  : conn
              )
            );
          }
        }
      )
      .subscribe();
    
    // For development - simulate a new message after 5 seconds from a random connection
    if (import.meta.env.DEV) {
      const timeout = setTimeout(() => {
        if (connections.length > 0) {
          const randomIndex = Math.floor(Math.random() * connections.length);
          const randomConnection = connections[randomIndex];
          
          console.log("Simulating new message from:", randomConnection?.name);
          
          if (randomConnection) {
            setUnreadMessages(prev => ({
              ...prev,
              [randomConnection.id]: true
            }));
            
            setConnections(currentConnections => 
              currentConnections.map(conn => 
                conn.id === randomConnection.id 
                  ? { ...conn, hasNewMessage: true } 
                  : conn
              )
            );
          }
        }
      }, 5000);
      
      return () => {
        clearTimeout(timeout);
        supabase.removeChannel(channel);
      };
    }
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, connections, setUnreadMessages, setConnections]);
}
