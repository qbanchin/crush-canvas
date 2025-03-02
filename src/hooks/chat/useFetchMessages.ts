
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types/message.types';
import { Profile } from '@/data/profiles';
import { toast } from 'sonner';
import { loadTestMessages } from './messageUtils';

export const useFetchMessages = (
  connection: Profile | null,
  currentUserId: string,
  useTestData: boolean,
  open: boolean
) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const hasLoadedMessagesRef = useRef(false);

  // Reset messages when dialog closes
  useEffect(() => {
    if (!open) {
      setMessages([]);
      hasLoadedMessagesRef.current = false;
    }
  }, [open]);

  // Fetch messages when connection changes and dialog is open
  useEffect(() => {
    if (open && connection && !hasLoadedMessagesRef.current) {
      console.log("Fetching messages for connection:", connection.name);
      fetchMessages();
    }
  }, [open, connection?.id]);

  const fetchMessages = async () => {
    if (!connection) return;
    
    setLoading(true);
    try {
      hasLoadedMessagesRef.current = true;
      
      if (!useTestData) {
        // Try to fetch real messages from Supabase
        const { data, error } = await supabase.functions.invoke('get-messages', {
          body: { 
            userId: currentUserId,
            recipientId: connection.id
          }
        });
        
        if (error) {
          console.error("Error fetching messages:", error);
          // Fall back to test data
          setMessages(loadTestMessages(connection, currentUserId));
        } else if (data && Array.isArray(data)) {
          console.log("Messages loaded:", data);
          // Mark messages as from current user or not
          const processedMessages = data.map(msg => ({
            ...msg,
            isFromCurrentUser: msg.senderId === currentUserId,
            timestamp: new Date(msg.timestamp) // Ensure timestamp is a Date object
          }));
          setMessages(processedMessages);
        } else {
          console.log("No messages found or empty response");
          setMessages([]);
        }
      } else {
        // Use test data
        setMessages(loadTestMessages(connection, currentUserId));
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
      setMessages(loadTestMessages(connection, currentUserId)); // Fallback to test data on error
    } finally {
      setLoading(false);
    }
  };

  return { messages, setMessages, loading };
};
