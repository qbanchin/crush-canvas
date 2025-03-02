
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Profile, profiles } from '@/data/profiles';

export function useConnectionsData() {
  const [connections, setConnections] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserID, setCurrentUserID] = useState<string | null>(null);
  const [useTestData, setUseTestData] = useState(false);

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
              setConnections(data);
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
              .slice(0, 3);
            
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
    toggleTestData
  };
}
