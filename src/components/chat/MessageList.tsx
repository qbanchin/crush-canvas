
import { Message } from '@/types/message.types';
import MessageBubble from './MessageBubble';
import { useEffect, useRef } from 'react';

interface MessageListProps {
  messages: Message[];
  loading: boolean;
}

const MessageList = ({ messages, loading }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  // Initial scroll to bottom when component mounts
  useEffect(() => {
    if (messagesEndRef.current && messagesContainerRef.current) {
      messagesEndRef.current.scrollIntoView();
    }
  }, []);

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
    <div ref={messagesContainerRef} className="space-y-4 pb-2">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} className="h-[1px]" />
    </div>
  );
};

export default MessageList;
