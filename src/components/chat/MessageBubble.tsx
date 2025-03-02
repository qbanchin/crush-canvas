
import { Message } from '@/types/message.types';
import { formatChatDate } from '@/utils/dateUtils';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  return (
    <div 
      className={`flex ${message.isFromCurrentUser ? 'justify-end' : 'justify-start'}`}
    >
      <div 
        className={`max-w-[80%] px-4 py-2 rounded-lg ${
          message.isFromCurrentUser 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted'
        }`}
      >
        <p className="break-words">{message.content}</p>
        <p 
          className={`text-xs mt-1 ${
            message.isFromCurrentUser 
              ? 'text-primary-foreground/70' 
              : 'text-muted-foreground'
          }`}
        >
          {formatChatDate(message.timestamp)}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
