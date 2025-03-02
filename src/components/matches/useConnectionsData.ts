
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ExtendedProfile } from './types/connectionTypes';
import { clearNewMessageFlag } from './utils/notificationUtils';
import { getCurrentUser, fetchConnections } from './utils/connectionsFetcher';
import { setupMessageSubscription } from './utils/messageSubscription';

export function useConnectionsData() {
  const [connections, setConnections] = useState<ExtendedProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserID, setCurrentUserID] = useState<string | null>(null);
  const [useTestData, setUseTestData] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadConnections = async () => {
      try {
        setLoading(true);
        
        // Get the current user ID first
        const userId = await getCurrentUser();
        setCurrentUserID(userId);
        
        // Fetch the connections data
        const fetchedConnections = await fetchConnections(
          userId, 
          useTestData, 
          unreadMessages, 
          setUseTestData
        );
        
        setConnections(fetchedConnections);
        setLoading(false);
      } catch (error) {
        console.error("Error loading connections:", error);
        setLoading(false);
      }
    };

    loadConnections();

    // Set up subscription for new messages
    const setupSubscription = async () => {
      const userId = await getCurrentUser();
      const channel = await setupMessageSubscription(
        userId, 
        connections, 
        setConnections, 
        setUnreadMessages
      );
      
      return () => {
        supabase.removeChannel(channel);
      };
    };
    
    const cleanup = setupSubscription();
    
    return () => {
      cleanup.then(cleanupFn => cleanupFn());
    };
  }, [useTestData]);

  const toggleTestData = () => {
    setUseTestData(prev => !prev);
    setLoading(true);
  };

  return {
    connections,
    loading,
    currentUserID,
    useTestData,
    toggleTestData,
    clearNewMessageFlag: (connectionId: string) => clearNewMessageFlag(
      connectionId, 
      connections, 
      setConnections, 
      setUnreadMessages
    )
  };
}
