
import { Message } from '@/types/message.types';
import MessageBubble from './MessageBubble';
import { useEffect, useRef } from 'react';

interface MessageListProps {
  messages: Message[];
  loading: boolean;
}

const MessageList = ({ messages, loading }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-4">
        <p className="text-muted-foreground">Loading messages...</p>
      </div>
    );
  }
  
  if (messages.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No messages yet. Start the conversation!</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 pb-2">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
