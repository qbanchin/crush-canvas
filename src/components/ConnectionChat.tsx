
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Profile } from '@/data/profiles';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: Date | string;
  isFromCurrentUser: boolean;
}

interface ConnectionChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connection: Profile | null;
  currentUserId: string;
  useTestData: boolean;
  onMessageSent: () => void;
}

const ConnectionChat = ({ 
  open, 
  onOpenChange, 
  connection, 
  currentUserId,
  useTestData,
  onMessageSent
}: ConnectionChatProps) => {
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch messages when the dialog opens and connection exists
  useEffect(() => {
    if (open && connection) {
      fetchMessages();
    }
  }, [open, connection]);

  const fetchMessages = async () => {
    if (!connection) return;
    
    setLoading(true);
    try {
      if (!useTestData) {
        // Try to fetch real messages from Supabase
        const { data, error } = await supabase.functions.invoke('get-messages', {
          body: { 
            userId: currentUserId,
            recipientId: connection.id
          }
        });
        
        if (error) {
          console.error("Error fetching messages:", error);
          // Fall back to test data
          loadTestMessages();
        } else if (data && Array.isArray(data)) {
          setMessages(data);
        }
      } else {
        // Use test data
        loadTestMessages();
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const loadTestMessages = () => {
    if (!connection) return;
    
    // Generate some test messages for demo purposes
    const testMessages: Message[] = [
      {
        id: '1',
        senderId: currentUserId,
        recipientId: connection.id,
        content: 'Hey there! How are you?',
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
        isFromCurrentUser: true
      },
      {
        id: '2',
        senderId: connection.id,
        recipientId: currentUserId,
        content: `Hi! I'm doing great. Your profile is interesting!`,
        timestamp: new Date(Date.now() - 43200000), // 12 hours ago
        isFromCurrentUser: false
      }
    ];
    
    setMessages(testMessages);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !connection) {
      return;
    }

    setSendingMessage(true);

    try {
      const newMessage: Message = {
        id: `temp-${Date.now()}`,
        senderId: currentUserId,
        recipientId: connection.id,
        content: messageText,
        timestamp: new Date(),
        isFromCurrentUser: true
      };

      // Update local state immediately for better UX
      setMessages(prev => [...prev, newMessage]);
      
      // In a real app, this would send the message to your backend
      if (!useTestData) {
        // Try to use Supabase function
        const { data, error } = await supabase.functions.invoke('send-message', {
          body: { 
            userId: currentUserId,
            recipientId: connection.id,
            message: messageText
          }
        });
        
        if (error) {
          console.error("Error sending message:", error);
          throw new Error("Failed to send message");
        }
      } else {
        // Just simulate a delay for test data
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      
      toast.success(`Message sent to ${connection.name}`);
      setMessageText('');
      onMessageSent();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to send message");
      // Remove the temporary message if it failed
      setMessages(prev => prev.filter(m => m.id !== `temp-${Date.now()}`));
    } finally {
      setSendingMessage(false);
    }
  };

  const formatDate = (date: Date | string) => {
    if (!date) return '';
    
    // Convert string to Date if needed
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }
    
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(dateObj);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Chat with {connection?.name || 'Connection'}</DialogTitle>
          <DialogDescription>
            Your conversation history
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {loading ? (
            <div className="flex justify-center">
              <p>Loading messages...</p>
            </div>
          ) : messages.length > 0 ? (
            messages.map((message) => (
              <div 
                key={message.id}
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
                    {formatDate(message.timestamp)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground">
              <p>No messages yet. Start the conversation!</p>
            </div>
          )}
        </div>
        
        <div className="border-t pt-4">
          <div className="flex gap-2">
            <Textarea
              placeholder="Write your message here..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
          <div className="flex justify-end mt-2">
            <Button
              onClick={handleSendMessage}
              disabled={!messageText.trim() || sendingMessage}
            >
              {sendingMessage ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectionChat;
