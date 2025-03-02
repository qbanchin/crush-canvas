
import { Profile } from '@/data/profiles';

// Extend the Profile type to include the hasNewMessage flag
export type ExtendedProfile = Profile & {
  hasNewMessage?: boolean;
  isNewConnection?: boolean;
};

export interface ConnectionsState {
  connections: ExtendedProfile[];
  loading: boolean;
  currentUserID: string | null;
  useTestData: boolean;
  unreadMessages: Record<string, boolean>;
}
