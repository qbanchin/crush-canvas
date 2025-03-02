
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { getCurrentUser, fetchConnectionsFromSupabase, getTestConnections, deleteConnectionFromSupabase, deleteTestConnection } from './utils/connectionUtils';
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
  
  // Only fetch data when component mounts or when useTestData changes
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        if (!isMounted) return;
        
        setState(prev => ({ ...prev, loading: true }));
        
        // Get the current user ID first
        const userId = await getCurrentUser();
        
        if (!isMounted) return;
        setState(prev => ({ ...prev, currentUserID: userId }));
        
        // Try to fetch from Supabase first
        if (!useTestData) {
          const data = await fetchConnectionsFromSupabase(userId);
          
          if (!isMounted) return;
          
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
            if (!isMounted) return;
            setState(prev => ({ ...prev, useTestData: true }));
          }
        }
        
        // Fall back to test data if Supabase call fails or useTestData is true
        if (useTestData && isMounted) {
          // Simulate a short loading delay for test data
          const timer = setTimeout(() => {
            if (!isMounted) return;
            
            const testConnections = getTestConnections(unreadMessages);
            setState(prev => ({ 
              ...prev, 
              connections: testConnections, 
              loading: false 
            }));
          }, 800);
          
          return () => clearTimeout(timer);
        }
      } catch (error) {
        console.error("Error:", error);
        if (isMounted) {
          toast.error("Something went wrong");
          setState(prev => ({ ...prev, loading: false }));
        }
      }
    };

    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [useTestData]); // Only depend on useTestData to prevent unnecessary refetches
  
  // Memoize these callbacks to prevent unnecessary recreations
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
  
  // Set up subscription for new messages - but don't make it depend on connections array
  // to prevent creating new subscription on every connection update
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

  // Add function to delete a connection
  const deleteConnection = useCallback(async (connectionId: string) => {
    try {
      setState(prev => ({ ...prev, loading: true }));

      let success = false;
      
      if (!useTestData && currentUserID) {
        // Delete from Supabase
        success = await deleteConnectionFromSupabase(currentUserID, connectionId);
      } else {
        // Delete from test data
        success = true;
      }
      
      if (success) {
        // Remove from local state
        setState(prev => {
          const updatedConnections = prev.connections.filter(
            conn => conn.id !== connectionId
          );
          
          return {
            ...prev,
            connections: updatedConnections,
            loading: false
          };
        });
        
        toast.success("Connection removed successfully");
      } else {
        setState(prev => ({ ...prev, loading: false }));
        toast.error("Failed to remove connection");
      }
    } catch (error) {
      console.error("Error deleting connection:", error);
      setState(prev => ({ ...prev, loading: false }));
      toast.error("Something went wrong");
    }
  }, [currentUserID, useTestData]);

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
    clearNewMessageFlag,
    deleteConnection
  };
}
