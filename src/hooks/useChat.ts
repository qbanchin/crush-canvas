
import { useState, useEffect, useCallback, useRef } from 'react';
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
  const messageIdCounterRef = useRef(0);
  const hasLoadedMessagesRef = useRef(false);

  // Reset messages when connection changes or dialog closes
  useEffect(() => {
    if (!open) {
      setMessages([]);
      hasLoadedMessagesRef.current = false;
    }
  }, [open]);

  // Fetch messages when the dialog opens and connection exists
  useEffect(() => {
    if (open && connection && !hasLoadedMessagesRef.current) {
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
          loadTestMessages();
        } else if (data && Array.isArray(data)) {
          console.log("Messages loaded:", data);
          // Mark messages as from current user or not
          const processedMessages = data.map(msg => ({
            ...msg,
            isFromCurrentUser: msg.senderId === currentUserId,
            timestamp: new Date(msg.timestamp) // Ensure timestamp is a Date object
          }));
          setMessages(processedMessages);
        }
      } else {
        // Use test data
        loadTestMessages();
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
      loadTestMessages(); // Fallback to test data on error
    } finally {
      setLoading(false);
    }
  };

  const loadTestMessages = () => {
    if (!connection) return;
    
    console.log("Using test messages for connection:", connection.name);
    
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
      },
      {
        id: '3',
        senderId: currentUserId,
        recipientId: connection.id,
        content: 'Thanks! I noticed we have some common interests.',
        timestamp: new Date(Date.now() - 21600000), // 6 hours ago
        isFromCurrentUser: true
      }
    ];
    
    setMessages(testMessages);
  };

  const handleSendMessage = useCallback(async () => {
    if (!messageText.trim() || !connection) {
      return;
    }

    setSendingMessage(true);

    try {
      const tempMessageId = `temp-${Date.now()}-${messageIdCounterRef.current++}`;
      const newMessage: Message = {
        id: tempMessageId,
        senderId: currentUserId,
        recipientId: connection.id,
        content: messageText.trim(),
        timestamp: new Date(),
        isFromCurrentUser: true
      };

      // Add new message to state immediately - important for UI feedback
      setMessages(prev => [...prev, newMessage]);
      
      // Clear input immediately for better UX
      const sentMessageText = messageText.trim();
      setMessageText('');
      
      // In a real app, this would send the message to your backend
      if (!useTestData) {
        // Try to use Supabase function
        const { data, error } = await supabase.functions.invoke('send-message', {
          body: { 
            userId: currentUserId,
            recipientId: connection.id,
            message: sentMessageText
          }
        });
        
        if (error) {
          console.error("Error sending message:", error);
          throw new Error("Failed to send message");
        }

        console.log("Message sent successfully", data);
        
        // Replace the temporary message with the real one from the server
        if (data && data.id) {
          setMessages(prev => prev.map(msg => 
            msg.id === tempMessageId ? {
              ...data,
              isFromCurrentUser: true,
              timestamp: new Date(data.timestamp)
            } : msg
          ));
        }
      } else {
        // Just simulate a delay for test data
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Add a simulated response in test mode
        setTimeout(() => {
          const responseMessage: Message = {
            id: `response-${Date.now()}-${messageIdCounterRef.current++}`,
            senderId: connection.id,
            recipientId: currentUserId,
            content: `Hey, thanks for your message! This is a simulated response from ${connection.name}.`,
            timestamp: new Date(),
            isFromCurrentUser: false
          };
          setMessages(prev => [...prev, responseMessage]);
        }, 2000);
      }
      
      toast.success(`Message sent to ${connection.name}`);
      onMessageSent();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
      // Remove the temporary message if it failed
      setMessages(prev => prev.filter(m => !m.id.startsWith('temp-')));
      // Restore the message text so the user doesn't lose their input
      setMessageText(messageText);
    } finally {
      setSendingMessage(false);
    }
  }, [messageText, connection, currentUserId, useTestData, onMessageSent]);

  return {
    messageText,
    setMessageText,
    sendingMessage,
    messages,
    loading,
    handleSendMessage
  };
};
