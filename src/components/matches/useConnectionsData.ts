
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getCurrentUser, fetchConnectionsFromSupabase, getTestConnections } from './utils/connectionUtils';
import { useMessageSubscription } from './hooks/useMessageSubscription';
import { ExtendedProfile, ConnectionsState } from './types/connectionTypes';

export function useConnectionsData() {
  const [state, setState] = useState<ConnectionsState>({
    connections: [],
    loading: true,
    currentUserID: null,
    useTestData: false,
    unreadMessages: {}
  });
  
  const { connections, loading, currentUserID, useTestData, unreadMessages } = state;
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true }));
        
        // Get the current user ID first
        const userId = await getCurrentUser();
        setState(prev => ({ ...prev, currentUserID: userId }));
        
        // Try to fetch from Supabase first
        if (!useTestData) {
          const data = await fetchConnectionsFromSupabase(userId);
          
          if (data) {
            // Map the data to include hasNewMessage flag
            const mappedConnections = data.map(connection => ({
              ...connection,
              hasNewMessage: unreadMessages[connection.id] || false
            }));
            
            setState(prev => ({ 
              ...prev, 
              connections: mappedConnections, 
              loading: false 
            }));
            return;
          } else {
            toast.error("Using test data instead of backend");
            setState(prev => ({ ...prev, useTestData: true }));
          }
        }
        
        // Fall back to test data if Supabase call fails or useTestData is true
        if (useTestData) {
          // Simulate a short loading delay for test data
          setTimeout(() => {
            const testConnections = getTestConnections(unreadMessages);
            setState(prev => ({ 
              ...prev, 
              connections: testConnections, 
              loading: false 
            }));
          }, 800);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Something went wrong");
        setState(prev => ({ ...prev, loading: false }));
      }
    };

    fetchData();
  }, [useTestData, unreadMessages]);
  
  // Set up subscription for new messages
  useMessageSubscription({
    userId: currentUserID || '',
    connections,
    setUnreadMessages: (newUnreadMessages) => 
      setState(prev => ({ ...prev, unreadMessages: newUnreadMessages })),
    setConnections: (newConnections) => 
      setState(prev => ({ ...prev, connections: newConnections }))
  });

  // Add a function to clear the hasNewMessage flag for a specific connection
  const clearNewMessageFlag = (connectionId: string) => {
    setState(prev => ({
      ...prev,
      unreadMessages: {
        ...prev.unreadMessages,
        [connectionId]: false
      },
      connections: prev.connections.map(conn => 
        conn.id === connectionId 
          ? { ...conn, hasNewMessage: false } 
          : conn
      )
    }));
  };

  const toggleTestData = () => {
    setState(prev => ({
      ...prev,
      useTestData: !prev.useTestData,
      loading: true
    }));
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
