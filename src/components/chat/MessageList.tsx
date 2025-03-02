
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
      // Immediate scroll for better UX
      messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
      
      // Then smooth scroll after a small delay to ensure DOM updates are complete
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [messages.length]); // Only watch messages.length instead of the entire array

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
    <div ref={messagesContainerRef} className="space-y-4 pb-2 overflow-y-auto">
      {messages.map((message) => (
        <MessageBubble 
          key={message.id} 
          message={message} 
        />
      ))}
      <div ref={messagesEndRef} className="h-[1px]" />
    </div>
  );
};

export default MessageList;
