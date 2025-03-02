
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { profiles } from '@/data/profiles';
import { ExtendedProfile } from '../types/connectionTypes';

export const getCurrentUser = async (): Promise<string> => {
  try {
    const { data } = await supabase.auth.getUser();
    if (data?.user) {
      return data.user.id;
    }
    // Fall back to test user id for development
    return "temp-user-id";
  } catch (error) {
    console.error("Error getting current user:", error);
    return "temp-user-id";
  }
};

export const fetchConnections = async (
  userId: string,
  useTestData: boolean,
  unreadMessages: Record<string, boolean>,
  setUseTestData: React.Dispatch<React.SetStateAction<boolean>>
): Promise<ExtendedProfile[]> => {
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
        
        // Map the data to include hasNewMessage flag and isNewConnection
        // In a real app, you would determine new connections based on their creation timestamp
        return data.map(connection => ({
          ...connection,
          hasNewMessage: unreadMessages[connection.id] || false,
          isNewConnection: Math.random() > 0.7 // Randomly mark some as new for demo
        }));
      }
    } catch (err) {
      console.error("Failed to fetch connections:", err);
      toast.error("Using test data as fallback");
      setUseTestData(true);
    }
  }
  
  // Use test data
  return new Promise((resolve) => {
    // Simulate a short loading delay for test data
    setTimeout(() => {
      // Use 3 random profiles from the local data as connections
      const testConnections = [...profiles]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(profile => ({
          ...profile,
          hasNewMessage: unreadMessages[profile.id] || false,
          isNewConnection: Math.random() > 0.7 // Randomly mark some as new for demo
        }));
      
      resolve(testConnections);
    }, 800);
  });
};
