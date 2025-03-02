
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Profile, profiles } from '@/data/profiles';

// Extend the Profile type to include the hasNewMessage flag
type ExtendedProfile = Profile & {
  hasNewMessage?: boolean;
};

export function useConnectionsData() {
  const [connections, setConnections] = useState<ExtendedProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserID, setCurrentUserID] = useState<string | null>(null);
  const [useTestData, setUseTestData] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Get current authenticated user
    const getCurrentUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          setCurrentUserID(data.user.id);
          return data.user.id;
        }
        // Fall back to test user id for development
        const tempUserId = "temp-user-id";
        setCurrentUserID(tempUserId);
        return tempUserId;
      } catch (error) {
        console.error("Error getting current user:", error);
        const tempUserId = "temp-user-id";
        setCurrentUserID(tempUserId);
        return tempUserId;
      }
    };

    const fetchConnections = async () => {
      try {
        setLoading(true);
        
        // Get the current user ID first
        const userId = await getCurrentUser();
        
        // Try to fetch from Supabase first
        if (!useTestData) {
          try {
            const { data, error } = await supabase.functions.invoke('get-matches', {
              body: { userId }
            });
            
            if (error) {
              console.error("Error fetching connections:", error);
              toast.error("Using test data instead of backend");
              setUseTestData(true);
            } else if (data && Array.isArray(data)) {
              console.log("Connections loaded:", data.length);
              
              // Map the data to include hasNewMessage flag
              const mappedConnections = data.map(connection => ({
                ...connection,
                hasNewMessage: unreadMessages[connection.id] || false
              }));
              
              setConnections(mappedConnections);
              setLoading(false);
              return;
            }
          } catch (err) {
            console.error("Failed to fetch connections:", err);
            toast.error("Using test data as fallback");
            setUseTestData(true);
          }
        }
        
        // Fall back to test data if Supabase call fails or useTestData is true
        if (useTestData) {
          // Simulate a short loading delay for test data
          setTimeout(() => {
            // Use 3 random profiles from the local data as connections
            const testConnections = [...profiles]
              .sort(() => 0.5 - Math.random())
              .slice(0, 3)
              .map(profile => ({
                ...profile,
                // For testing, mark one profile randomly as having a new message
                hasNewMessage: profile.id === profiles[0].id ? true : unreadMessages[profile.id] || false
              }));
            
            console.log("Test connections with message indicators:", testConnections);
            setConnections(testConnections);
            setLoading(false);
          }, 800);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Something went wrong");
        setLoading(false);
      }
    };

    fetchConnections();

    // Set up subscription for new messages
    const setupMessageSubscription = async () => {
      const userId = await getCurrentUser();
      
      const channel = supabase
        .channel('message-notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages'
          },
          (payload) => {
            if (payload.new && payload.new.recipient_id === userId) {
              console.log("New message detected from:", payload.new.sender_id);
              // Mark this sender as having a new message
              setUnreadMessages(prev => ({
                ...prev,
                [payload.new.sender_id]: true
              }));
              
              // Update connections list to show the notification
              setConnections(currentConnections => 
                currentConnections.map(conn => 
                  conn.id === payload.new.sender_id 
                    ? { ...conn, hasNewMessage: true } 
                    : conn
                )
              );
            }
          }
        )
        .subscribe();
      
      // For development - simulate a new message after 5 seconds from a random connection
      if (import.meta.env.DEV) {
        setTimeout(() => {
          if (connections.length > 0) {
            const randomIndex = Math.floor(Math.random() * connections.length);
            const randomConnection = connections[randomIndex];
            
            console.log("Simulating new message from:", randomConnection?.name);
            
            if (randomConnection) {
              setUnreadMessages(prev => ({
                ...prev,
                [randomConnection.id]: true
              }));
              
              setConnections(currentConnections => 
                currentConnections.map(conn => 
                  conn.id === randomConnection.id 
                    ? { ...conn, hasNewMessage: true } 
                    : conn
                )
              );
            }
          }
        }, 5000);
      }
      
      return () => {
        supabase.removeChannel(channel);
      };
    };
    
    setupMessageSubscription();
  }, [useTestData]);

  // Add a function to clear the hasNewMessage flag for a specific connection
  const clearNewMessageFlag = (connectionId: string) => {
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
    clearNewMessageFlag
  };
}
