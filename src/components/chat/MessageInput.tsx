
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { KeyboardEvent } from "react";

interface MessageInputProps {
  messageText: string;
  onMessageChange: (text: string) => void;
  onSendMessage: () => void;
  isSending: boolean;
}

const MessageInput = ({ 
  messageText, 
  onMessageChange, 
  onSendMessage, 
  isSending 
}: MessageInputProps) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (messageText.trim() && !isSending) {
        onSendMessage();
      }
    }
  };

  return (
    <div className="border-t pt-4">
      <div className="flex gap-2">
        <Textarea
          placeholder="Write your message here..."
          value={messageText}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[80px]"
        />
      </div>
      <div className="flex justify-end mt-2">
        <Button
          onClick={onSendMessage}
          disabled={!messageText.trim() || isSending}
        >
          {isSending ? "Sending..." : "Send Message"}
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
