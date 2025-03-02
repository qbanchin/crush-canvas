
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useChat } from '@/hooks/useChat';
import MessageList from './chat/MessageList';
import MessageInput from './chat/MessageInput';
import { ChatProps } from '@/types/message.types';
import { useEffect, useRef } from 'react';

const ConnectionChat = ({ 
  open, 
  onOpenChange, 
  connection, 
  currentUserId,
  useTestData,
  onMessageSent
}: ChatProps) => {
  // Use our refactored chat hook
  const {
    messageText,
    setMessageText,
    sendingMessage,
    messages,
    loading,
    handleSendMessage
  } = useChat(connection, currentUserId, useTestData, onMessageSent, open);

  // Ref for the textarea to focus it when dialog opens
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-focus the textarea when the dialog opens
  useEffect(() => {
    if (open && textareaRef.current) {
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 100);
    }
  }, [open]);

  // Handle sending message on Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !sendingMessage) {
      e.preventDefault();
      if (messageText.trim()) {
        handleSendMessage();
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{connection?.name || 'Connection'}</DialogTitle>
          <DialogDescription>
            Your conversation history
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto py-4 px-1">
          <MessageList messages={messages} loading={loading} />
        </div>
        
        <MessageInput 
          messageText={messageText}
          onMessageChange={setMessageText}
          onSendMessage={handleSendMessage}
          isSending={sendingMessage}
          textareaRef={textareaRef}
          handleKeyDown={handleKeyDown}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ConnectionChat;
