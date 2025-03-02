
import { supabase } from '@/integrations/supabase/client';
import { Profile, profiles } from '@/data/profiles';
import { ExtendedProfile } from '../types/connectionTypes';

// Get current authenticated user
export const getCurrentUser = async (): Promise<string> => {
  try {
    const { data } = await supabase.auth.getUser();
    if (data?.user) {
      return data.user.id;
    }
    // Fall back to test user id for development
    const tempUserId = "temp-user-id";
    return tempUserId;
  } catch (error) {
    console.error("Error getting current user:", error);
    const tempUserId = "temp-user-id";
    return tempUserId;
  }
};

// Fetch connections data from Supabase
export const fetchConnectionsFromSupabase = async (userId: string): Promise<ExtendedProfile[] | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('get-matches', {
      body: { userId }
    });
    
    if (error) {
      console.error("Error fetching connections:", error);
      return null;
    }
    
    if (data && Array.isArray(data)) {
      console.log("Connections loaded:", data.length);
      return data as ExtendedProfile[];
    }
    
    return null;
  } catch (err) {
    console.error("Failed to fetch connections:", err);
    return null;
  }
};

// Get test connections for development
export const getTestConnections = (unreadMessages: Record<string, boolean>): ExtendedProfile[] => {
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
  return testConnections;
};

// Delete a connection from Supabase
export const deleteConnectionFromSupabase = async (userId: string, connectionId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('delete-connection', {
      body: { 
        userId,
        connectionId
      }
    });
    
    if (error) {
      console.error("Error deleting connection:", error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Failed to delete connection:", err);
    return false;
  }
};

// Delete a test connection
export const deleteTestConnection = (connections: ExtendedProfile[], connectionId: string): ExtendedProfile[] => {
  return connections.filter(connection => connection.id !== connectionId);
};
