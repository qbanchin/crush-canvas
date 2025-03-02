
import { Message } from '@/types/message.types';
import MessageBubble from './MessageBubble';

interface MessageListProps {
  messages: Message[];
  loading: boolean;
}

const MessageList = ({ messages, loading }: MessageListProps) => {
  if (loading) {
    return (
      <div className="flex justify-center">
        <p>Loading messages...</p>
      </div>
    );
  }
  
  if (messages.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        <p>No messages yet. Start the conversation!</p>
      </div>
    );
  }
  
  return (
    <>
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
    </>
  );
};

export default MessageList;
