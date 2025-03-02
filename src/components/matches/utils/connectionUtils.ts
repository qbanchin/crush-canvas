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
  // Ana's profile
  const anaProfile: ExtendedProfile = {
    id: "ana-1",
    name: "Ana",
    age: 28,
    bio: "Travel enthusiast and coffee addict. Always looking for new adventures!",
    images: ["/lovable-uploads/045f4838-7fe0-4265-943a-0d7ba5dec7de.png"],
    tags: ["Travel", "Coffee", "Photography"],
    hasNewMessage: true,
    distance: 3 // Add required distance property
  };
  
  // Michael Jui's profile
  const michaelProfile: ExtendedProfile = {
    id: "michael-1",
    name: "Michael Jui",
    age: 32,
    bio: "Software engineer by day, chef by night. Love hiking and exploring nature.",
    images: ["/lovable-uploads/290973f2-f16b-4e56-8cfe-afb3b85e2239.png"],
    tags: ["Coding", "Cooking", "Hiking"],
    distance: 5 // Add required distance property
  };
  
  // Use one random profile from the local data and add our two custom ones
  const randomProfile = [...profiles]
    .sort(() => 0.5 - Math.random())
    .slice(0, 1)
    .map(profile => ({
      ...profile,
      hasNewMessage: unreadMessages[profile.id] || false
    }))[0];
  
  const testConnections = [
    anaProfile,
    michaelProfile,
    randomProfile
  ];
  
  console.log("Test connections with message indicators:", testConnections);
  return testConnections;
};

// Delete a connection from Supabase
export const deleteConnectionFromSupabase = async (userId: string, connectionId: string): Promise<boolean> => {
  try {
    console.log(`Attempting to delete connection: User ID ${userId}, Connection ID ${connectionId}`);
    
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
    
    console.log("Delete connection response:", data);
    return true;
  } catch (err) {
    console.error("Failed to delete connection:", err);
    return false;
  }
};

// Delete a test connection
export const deleteTestConnection = (connections: ExtendedProfile[], connectionId: string): ExtendedProfile[] => {
  console.log(`Removing connection with ID ${connectionId} from list of ${connections.length} connections`);
  const filteredConnections = connections.filter(connection => connection.id !== connectionId);
  console.log(`Remaining connections: ${filteredConnections.length}`);
  return filteredConnections;
};
