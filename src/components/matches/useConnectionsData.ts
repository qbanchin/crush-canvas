
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { getCurrentUser, fetchConnectionsFromSupabase, getTestConnections } from './utils/connectionUtils';
import { useMessageSubscription } from './hooks/useMessageSubscription';
import { ExtendedProfile, ConnectionsState, ConnectionsDataReturn } from './types/connectionTypes';

export function useConnectionsData(): ConnectionsDataReturn {
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
  
  // Define callbacks for updating the state
  const setUnreadMessages = useCallback((value: Record<string, boolean> | ((prev: Record<string, boolean>) => Record<string, boolean>)) => {
    setState(prev => {
      const newUnreadMessages = typeof value === 'function' ? value(prev.unreadMessages) : value;
      return { ...prev, unreadMessages: newUnreadMessages };
    });
  }, []);

  const setConnections = useCallback((value: ExtendedProfile[] | ((prev: ExtendedProfile[]) => ExtendedProfile[])) => {
    setState(prev => {
      const newConnections = typeof value === 'function' ? value(prev.connections) : value;
      return { ...prev, connections: newConnections };
    });
  }, []);
  
  // Set up subscription for new messages
  useMessageSubscription({
    userId: currentUserID || '',
    connections,
    setUnreadMessages,
    setConnections
  });

  // Add a function to clear the hasNewMessage flag for a specific connection
  const clearNewMessageFlag = useCallback((connectionId: string) => {
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
  }, []);

  const toggleTestData = useCallback(() => {
    setState(prev => ({
      ...prev,
      useTestData: !prev.useTestData,
      loading: true
    }));
  }, []);

  return {
    connections,
    loading,
    currentUserID,
    useTestData,
    toggleTestData,
    clearNewMessageFlag
  };
}
