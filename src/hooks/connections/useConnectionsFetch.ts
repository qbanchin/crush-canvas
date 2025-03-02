
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Profile, profiles } from '@/data/profiles';

type ConnectionsWithNewMessages = Profile & {
  hasNewMessage?: boolean;
};

interface UseConnectionsFetchProps {
  userId: string | null;
  useTestData: boolean;
  unreadMessages: Record<string, boolean>;
}

export function useConnectionsFetch({ 
  userId, 
  useTestData,
  unreadMessages
}: UseConnectionsFetchProps) {
  const [connections, setConnections] = useState<ConnectionsWithNewMessages[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConnections = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        
        // Try to fetch from Supabase first
        if (!useTestData) {
          try {
            const { data, error } = await supabase.functions.invoke('get-matches', {
              body: { userId }
            });
            
            if (error) {
              console.error("Error fetching connections:", error);
              toast.error("Using test data instead of backend");
              // Instead of setting useTestData directly, we'll continue to fallback
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
            // Continue to fallback
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
                hasNewMessage: unreadMessages[profile.id] || false
              }));
            
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
  }, [userId, useTestData, unreadMessages]);

  // Function to update connections with new message flags
  const updateConnectionWithMessageFlag = (connectionId: string, hasNewMessage: boolean) => {
    setConnections(currentConnections => 
      currentConnections.map(conn => 
        conn.id === connectionId 
          ? { ...conn, hasNewMessage } 
          : conn
      )
    );
  };

  return { connections, setConnections, loading, updateConnectionWithMessageFlag };
}
