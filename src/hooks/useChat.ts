
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types/message.types';
import { Profile } from '@/data/profiles';
import { toast } from 'sonner';

export const useChat = (
  connection: Profile | null,
  currentUserId: string,
  useTestData: boolean,
  onMessageSent: () => void,
  open: boolean
) => {
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch messages when the dialog opens and connection exists
  useEffect(() => {
    if (open && connection) {
      fetchMessages();
    }
  }, [open, connection]);

  const fetchMessages = async () => {
    if (!connection) return;
    
    setLoading(true);
    try {
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
          loadTestMessages();
        } else if (data && Array.isArray(data)) {
          setMessages(data);
        }
      } else {
        // Use test data
        loadTestMessages();
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const loadTestMessages = () => {
    if (!connection) return;
    
    // Generate some test messages for demo purposes
    const testMessages: Message[] = [
      {
        id: '1',
        senderId: currentUserId,
        recipientId: connection.id,
        content: 'Hey there! How are you?',
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
        isFromCurrentUser: true
      },
      {
        id: '2',
        senderId: connection.id,
        recipientId: currentUserId,
        content: `Hi! I'm doing great. Your profile is interesting!`,
        timestamp: new Date(Date.now() - 43200000), // 12 hours ago
        isFromCurrentUser: false
      }
    ];
    
    setMessages(testMessages);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !connection) {
      return;
    }

    setSendingMessage(true);

    try {
      const newMessage: Message = {
        id: `temp-${Date.now()}`,
        senderId: currentUserId,
        recipientId: connection.id,
        content: messageText,
        timestamp: new Date(),
        isFromCurrentUser: true
      };

      // Update local state immediately for better UX
      setMessages(prev => [...prev, newMessage]);
      
      // In a real app, this would send the message to your backend
      if (!useTestData) {
        // Try to use Supabase function
        const { data, error } = await supabase.functions.invoke('send-message', {
          body: { 
            userId: currentUserId,
            recipientId: connection.id,
            message: messageText
          }
        });
        
        if (error) {
          console.error("Error sending message:", error);
          throw new Error("Failed to send message");
        }
      } else {
        // Just simulate a delay for test data
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      
      toast.success(`Message sent to ${connection.name}`);
      setMessageText('');
      onMessageSent();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to send message");
      // Remove the temporary message if it failed
      setMessages(prev => prev.filter(m => m.id !== `temp-${Date.now()}`));
    } finally {
      setSendingMessage(false);
    }
  };

  return {
    messageText,
    setMessageText,
    sendingMessage,
    messages,
    loading,
    handleSendMessage
  };
};
