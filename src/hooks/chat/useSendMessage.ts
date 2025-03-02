
import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types/message.types';
import { Profile } from '@/data/profiles';
import { toast } from 'sonner';
import { createNewMessage, handleMessageError, addSimulatedResponse } from './messageUtils';

export const useSendMessage = (
  connection: Profile | null,
  currentUserId: string,
  useTestData: boolean,
  onMessageSent: () => void,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const messageIdCounterRef = useRef(0);

  const handleSendMessage = useCallback(async () => {
    if (!messageText.trim() || !connection) {
      return;
    }

    setSendingMessage(true);

    try {
      const tempMessageId = `temp-${Date.now()}-${messageIdCounterRef.current++}`;
      const newMessage = createNewMessage(
        tempMessageId,
        currentUserId,
        connection.id,
        messageText.trim()
      );

      // Add new message to state immediately - important for UI feedback
      setMessages(prev => [...prev, newMessage]);
      
      // Clear input immediately for better UX
      const sentMessageText = messageText.trim();
      setMessageText('');
      
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
        
        // Replace the temporary message with a "confirmed" one
        setMessages(prev => prev.map(msg => 
          msg.id === tempMessageId ? {
            ...msg,
            id: `confirmed-${Date.now()}`
          } : msg
        ));
        
        // Add a simulated response in test mode
        addSimulatedResponse(
          connection,
          currentUserId,
          messageIdCounterRef.current++,
          setMessages
        );
      }
      
      toast.success(`Message sent to ${connection.name}`);
      onMessageSent();
    } catch (error) {
      handleMessageError(error, setMessages, setMessageText, messageText);
    } finally {
      setSendingMessage(false);
    }
  }, [messageText, connection, currentUserId, useTestData, onMessageSent, setMessages]);

  return {
    messageText,
    setMessageText,
    sendingMessage,
    handleSendMessage
  };
};
