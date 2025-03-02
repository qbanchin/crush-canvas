
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
  
  // Force scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      // More reliable scrolling - ensures DOM updates are complete
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  }, [messages]); // Watch the entire messages array for any changes

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
      {messages.map((message, index) => (
        <MessageBubble 
          key={`${message.id}-${index}`} 
          message={message} 
        />
      ))}
      <div ref={messagesEndRef} className="h-[1px]" />
    </div>
  );
};

export default MessageList;
