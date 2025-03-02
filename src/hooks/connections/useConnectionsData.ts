
import { useState } from 'react';
import { useCurrentUser } from './useCurrentUser';
import { useConnectionsFetch } from './useConnectionsFetch';
import { useMessageSubscription } from './useMessageSubscription';

export function useConnectionsData() {
  // State for toggling between test data and real data
  const [useTestData, setUseTestData] = useState(false);
  
  // Get current user
  const { currentUserID } = useCurrentUser();
  
  // Setup message subscription
  const { unreadMessages, clearNewMessageFlag } = useMessageSubscription({
    userId: currentUserID,
    connections: [],  // This will be updated with the actual connections
    onNewMessage: (senderId) => {
      // Update connections with new message flag
      updateConnectionWithMessageFlag(senderId, true);
    }
  });
  
  // Fetch connections
  const { 
    connections, 
    loading, 
    updateConnectionWithMessageFlag 
  } = useConnectionsFetch({
    userId: currentUserID,
    useTestData,
    unreadMessages
  });

  // Function to toggle between test data and real data
  const toggleTestData = () => {
    setUseTestData(prev => !prev);
  };

  return {
    connections,
    loading,
    currentUserID,
    useTestData,
    toggleTestData,
    clearNewMessageFlag
  };
}
