
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ExtendedProfile } from '../types/connectionTypes';

interface MessageSubscriptionProps {
  userId: string;
  connections: ExtendedProfile[];
  setUnreadMessages: (value: Record<string, boolean> | ((prev: Record<string, boolean>) => Record<string, boolean>)) => void;
  setConnections: (value: ExtendedProfile[] | ((prev: ExtendedProfile[]) => ExtendedProfile[])) => void;
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
    
    // REMOVED the problematic timeout that was causing continuous refreshes
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, connections, setUnreadMessages, setConnections]);
}
