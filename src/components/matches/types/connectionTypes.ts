
import { Profile } from '@/data/profiles';

// Extend the Profile type to include a hasNewMessage flag
export interface ExtendedProfile extends Profile {
  hasNewMessage?: boolean;
}

// State object for the useConnectionsData hook
export interface ConnectionsState {
  connections: ExtendedProfile[];
  loading: boolean;
  currentUserID: string | null;
  useTestData: boolean;
  unreadMessages: Record<string, boolean>;
}

// Return type for the useConnectionsData hook
export interface ConnectionsDataReturn {
  connections: ExtendedProfile[];
  loading: boolean;
  currentUserID: string | null;
  useTestData: boolean;
  toggleTestData: () => void;
  clearNewMessageFlag: (connectionId: string) => void;
  deleteConnection: (connectionId: string) => void;
}
