
import { Profile } from '@/data/profiles';

export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: Date | string;
  isFromCurrentUser: boolean;
}

export interface ChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connection: Profile | null;
  currentUserId: string;
  useTestData: boolean;
  onMessageSent: () => void;
}
