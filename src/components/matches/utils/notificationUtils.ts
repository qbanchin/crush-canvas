
import { ExtendedProfile } from '../types/connectionTypes';

export const clearNewMessageFlag = (
  connectionId: string, 
  connections: ExtendedProfile[],
  setConnections: React.Dispatch<React.SetStateAction<ExtendedProfile[]>>,
  setUnreadMessages: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
) => {
  setUnreadMessages(prev => ({
    ...prev,
    [connectionId]: false
  }));
  
  setConnections(currentConnections => 
    currentConnections.map(conn => 
      conn.id === connectionId 
        ? { ...conn, hasNewMessage: false } 
        : conn
    )
  );
};

export const markConnectionWithNewMessage = (
  senderId: string,
  connections: ExtendedProfile[],
  setConnections: React.Dispatch<React.SetStateAction<ExtendedProfile[]>>,
  setUnreadMessages: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
) => {
  setUnreadMessages(prev => ({
    ...prev,
    [senderId]: true
  }));
  
  setConnections(currentConnections => 
    currentConnections.map(conn => 
      conn.id === senderId 
        ? { ...conn, hasNewMessage: true } 
        : conn
    )
  );
};
