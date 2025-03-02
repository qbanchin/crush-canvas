
import { useFetchMessages } from './chat/useFetchMessages';
import { useSendMessage } from './chat/useSendMessage';
import { Profile } from '@/data/profiles';

export const useChat = (
  connection: Profile | null,
  currentUserId: string,
  useTestData: boolean,
  onMessageSent: () => void,
  open: boolean
) => {
  // Use the fetch messages hook
  const { messages, setMessages, loading } = useFetchMessages(
    connection,
    currentUserId,
    useTestData,
    open
  );

  // Use the send message hook
  const {
    messageText,
    setMessageText,
    sendingMessage,
    handleSendMessage
  } = useSendMessage(
    connection,
    currentUserId,
    useTestData,
    onMessageSent,
    setMessages
  );

  return {
    messageText,
    setMessageText,
    sendingMessage,
    messages,
    loading,
    handleSendMessage
  };
};
