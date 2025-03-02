
import { Message } from '@/types/message.types';
import { formatChatDate } from '@/utils/dateUtils';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  // Determine if message is from current user
  const isCurrentUser = message.isFromCurrentUser;
  
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div 
        className={`max-w-[80%] rounded-lg p-3 ${
          isCurrentUser 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted text-foreground'
        }`}
      >
        <div className="break-words">{message.content}</div>
        <div className={`text-xs mt-1 ${
          isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
        }`}>
          {formatChatDate(message.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
