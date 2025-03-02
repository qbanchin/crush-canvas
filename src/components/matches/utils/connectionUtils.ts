
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
    distance: 3
  };
  
  // Michael Jui's profile
  const michaelProfile: ExtendedProfile = {
    id: "michael-1",
    name: "Michael Jui",
    age: 32,
    bio: "Software engineer by day, chef by night. Love hiking and exploring nature.",
    images: ["/lovable-uploads/290973f2-f16b-4e56-8cfe-afb3b85e2239.png"],
    tags: ["Coding", "Cooking", "Hiking"],
    distance: 5
  };
  
  // New profiles
  const oliviaProfile: ExtendedProfile = {
    id: "olivia-1",
    name: "Olivia Chen",
    age: 27,
    bio: "Classical pianist and language enthusiast. Fluent in 4 languages and always learning more.",
    images: ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80"],
    tags: ["Music", "Languages", "Reading"],
    hasNewMessage: unreadMessages["olivia-1"] || false,
    distance: 2
  };
  
  const jamesProfile: ExtendedProfile = {
    id: "james-1",
    name: "James Wilson",
    age: 31,
    bio: "Surfer and environmental scientist. Dedicated to ocean conservation and beach cleanups.",
    images: ["https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1148&q=80"],
    tags: ["Surfing", "Environment", "Science"],
    hasNewMessage: unreadMessages["james-1"] || false,
    distance: 8
  };
  
  const sarahProfile: ExtendedProfile = {
    id: "sarah-1",
    name: "Sarah Kim",
    age: 29,
    bio: "Food blogger and culinary adventurer. Always seeking the next best restaurant or recipe to try.",
    images: ["https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"],
    tags: ["Food", "Cooking", "Blogging"],
    hasNewMessage: unreadMessages["sarah-1"] || true,
    distance: 4
  };
  
  // Use two random profiles from the local data
  const randomProfiles = [...profiles]
    .sort(() => 0.5 - Math.random())
    .slice(0, 2)
    .map(profile => ({
      ...profile,
      hasNewMessage: unreadMessages[profile.id] || false
    }));
  
  const testConnections = [
    anaProfile,
    michaelProfile,
    oliviaProfile,
    jamesProfile,
    sarahProfile,
    ...randomProfiles
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
