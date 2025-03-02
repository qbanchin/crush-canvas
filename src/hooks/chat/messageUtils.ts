
import { Message } from '@/types/message.types';
import { Profile } from '@/data/profiles';
import { toast } from 'sonner';

/**
 * Loads test messages for a connection
 */
export const loadTestMessages = (connection: Profile | null, currentUserId: string): Message[] => {
  if (!connection) return [];
  
  console.log("Using test messages for connection:", connection.name);
  
  // Generate some test messages for demo purposes
  return [
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
};

/**
 * Creates a new message object
 */
export const createNewMessage = (
  tempMessageId: string,
  currentUserId: string,
  recipientId: string,
  messageText: string
): Message => ({
  id: tempMessageId,
  senderId: currentUserId,
  recipientId: recipientId,
  content: messageText.trim(),
  timestamp: new Date(),
  isFromCurrentUser: true
});

/**
 * Handles unsuccessful message sending
 */
export const handleMessageError = (
  error: any,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setMessageText: React.Dispatch<React.SetStateAction<string>>,
  originalMessageText: string
) => {
  console.error("Error sending message:", error);
  toast.error("Failed to send message");
  // Remove the temporary message if it failed
  setMessages(prev => prev.filter(m => !m.id.startsWith('temp-')));
  // Restore the message text so the user doesn't lose their input
  setMessageText(originalMessageText);
};

/**
 * Adds a simulated response message in test mode
 */
export const addSimulatedResponse = (
  connection: Profile,
  currentUserId: string,
  messageIdCounter: number,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  setTimeout(() => {
    const responseMessage: Message = {
      id: `response-${Date.now()}-${messageIdCounter}`,
      senderId: connection.id,
      recipientId: currentUserId,
      content: `Hey, thanks for your message! This is a simulated response from ${connection.name}.`,
      timestamp: new Date(),
      isFromCurrentUser: false
    };
    setMessages(prev => [...prev, responseMessage]);
  }, 2000);
};
