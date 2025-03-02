
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
  // Create specific profiles for Ana and Michael Jui
  const anaProfile: ExtendedProfile = {
    id: "ana-profile-id",
    name: "Ana",
    age: 28,
    distance: 3,
    bio: "Hi! I'm Ana. I love hiking, photography, and trying new foods.",
    images: ["/lovable-uploads/045f4838-7fe0-4265-943a-0d7ba5dec7de.png"],
    tags: ["Photography", "Hiking", "Foodie", "Travel"],
    hasNewMessage: unreadMessages["ana-profile-id"] || true
  };
  
  const michaelProfile: ExtendedProfile = {
    id: "michael-profile-id",
    name: "Michael Jui",
    age: 32,
    distance: 5,
    bio: "Software engineer with a passion for music and outdoor activities.",
    images: ["/lovable-uploads/290973f2-f16b-4e56-8cfe-afb3b85e2239.png"],
    tags: ["Technology", "Music", "Nature", "Programming"],
    hasNewMessage: unreadMessages["michael-profile-id"] || false
  };
  
  // Use the specific profiles and add one random profile from the local data
  const testConnections = [
    anaProfile,
    michaelProfile,
    // Add one random profile to have some variety
    ...profiles
      .sort(() => 0.5 - Math.random())
      .slice(0, 1)
      .map(profile => ({
        ...profile,
        hasNewMessage: unreadMessages[profile.id] || false
      }))
  ];
  
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
