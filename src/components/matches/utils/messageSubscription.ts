
import { supabase } from '@/integrations/supabase/client';
import { ExtendedProfile } from '../types/connectionTypes';
import { markConnectionWithNewMessage } from './notificationUtils';

export const setupMessageSubscription = async (
  userId: string,
  connections: ExtendedProfile[],
  setConnections: React.Dispatch<React.SetStateAction<ExtendedProfile[]>>,
  setUnreadMessages: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
) => {
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
          markConnectionWithNewMessage(
            payload.new.sender_id,
            connections,
            setConnections,
            setUnreadMessages
          );
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
        markConnectionWithNewMessage(
          randomConnection.id,
          connections,
          setConnections,
          setUnreadMessages
        );
      }
    }, 5000);
  }
  
  return channel;
};
