
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Profile } from '@/data/profiles';
import { useChat } from '@/hooks/useChat';
import MessageList from './chat/MessageList';
import MessageInput from './chat/MessageInput';
import { ChatProps } from '@/types/message.types';
import { useEffect } from 'react';

const ConnectionChat = ({ 
  open, 
  onOpenChange, 
  connection, 
  currentUserId,
  useTestData,
  onMessageSent
}: ChatProps) => {
  const {
    messageText,
    setMessageText,
    sendingMessage,
    messages,
    loading,
    handleSendMessage
  } = useChat(connection, currentUserId, useTestData, onMessageSent, open);

  // Auto-focus the textarea when the dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        const textarea = document.querySelector('.dialog-content textarea');
        if (textarea) {
          (textarea as HTMLTextAreaElement).focus();
        }
      }, 100);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col dialog-content">
        <DialogHeader>
          <DialogTitle>Chat with {connection?.name || 'Connection'}</DialogTitle>
          <DialogDescription>
            Your conversation history
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          <MessageList messages={messages} loading={loading} />
        </div>
        
        <MessageInput 
          messageText={messageText}
          onMessageChange={setMessageText}
          onSendMessage={handleSendMessage}
          isSending={sendingMessage}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ConnectionChat;
