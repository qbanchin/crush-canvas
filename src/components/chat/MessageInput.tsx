
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { KeyboardEvent, RefObject } from "react";

interface MessageInputProps {
  messageText: string;
  onMessageChange: (text: string) => void;
  onSendMessage: () => void;
  isSending: boolean;
  textareaRef?: RefObject<HTMLTextAreaElement>;
  handleKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
}

const MessageInput = ({ 
  messageText, 
  onMessageChange, 
  onSendMessage, 
  isSending,
  textareaRef,
  handleKeyDown
}: MessageInputProps) => {
  // Use the key handler from props or fallback to a default one
  const onKeyDown = handleKeyDown || ((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (messageText.trim() && !isSending) {
        onSendMessage();
      }
    }
  });

  return (
    <div className="border-t pt-4 pb-1">
      <div className="flex gap-2 items-end">
        <Textarea
          ref={textareaRef}
          placeholder="Write your message here..."
          value={messageText}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyDown={onKeyDown}
          className="min-h-[60px] resize-none"
          disabled={isSending}
        />
        <Button
          onClick={onSendMessage}
          disabled={!messageText.trim() || isSending}
          size="icon"
          className="h-10 w-10"
        >
          <Send size={18} />
        </Button>
      </div>
      <div className="text-xs text-muted-foreground mt-1 text-right">
        Press Enter to send, Shift+Enter for new line
      </div>
    </div>
  );
};

export default MessageInput;
