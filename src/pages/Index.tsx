
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import TinderCard from '@/components/TinderCard';
import MatchAnimation from '@/components/MatchAnimation';
import HeaderBar from '@/components/HeaderBar';
import NavBar from '@/components/NavBar';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/data/profiles';

const Index = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null);
  const [currentUserID, setCurrentUserID] = useState<string | null>(null);

  useEffect(() => {
    // Get current user ID first
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserID(user.id);
        return user.id;
      }
      return null;
    };

    // Fetch profiles from the backend
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const userId = await getCurrentUser();
        
        if (!userId) {
          console.error("User not authenticated");
          toast.error("Authentication required");
          setLoading(false);
          return;
        }

        // First, fetch the user's own profile for gender and preference
        const { data: userProfile, error: userProfileError } = await supabase
          .from('cards')
          .select('gender, preference')
          .eq('id', userId)
          .maybeSingle();
        
        if (userProfileError) {
          console.error("Error fetching user profile:", userProfileError);
          // Continue without filtering by gender preference
        }
        
        // Handle the case where gender or preference might be null
        const userGender = userProfile?.gender || null;
        const genderPreference = userProfile?.preference || null;
        
        console.log("User gender:", userGender, "Preference:", genderPreference);

        // Fetch all existing connections and rejected profiles
        const { data: connectionsData, error: connectionsError } = await supabase.functions.invoke('get-matches');
        
        if (connectionsError) {
          console.error("Error fetching connections:", connectionsError);
          toast.error("Failed to load match data");
        }
        
        // Extract connection IDs and rejected profile IDs
        const connectionIds: string[] = [];
        const rejectedIds: string[] = [];
        
        if (connectionsData && Array.isArray(connectionsData)) {
          connectionsData.forEach((connection: any) => {
            // If is_match is true, it's a connection, otherwise it was rejected
            if (connection.is_match) {
              connectionIds.push(connection.liked_user_id);
            } else {
              rejectedIds.push(connection.liked_user_id);
            }
          });
        }
        
        // Now fetch profiles, filtering out connections and rejected ones on the server
        const { data, error } = await supabase.functions.invoke('get-cards', {
          body: {
            excludeIds: [...connectionIds, ...rejectedIds],
            genderPreference: genderPreference,
            userGender: userGender
          }
        });
        
        if (error) {
          console.error("Error fetching profiles:", error);
          toast.error("Failed to load profiles");
          setLoading(false);
          return;
        }
        
        if (data && Array.isArray(data)) {
          console.log(`Loaded ${data.length} profiles, excluded ${connectionIds.length} connections and ${rejectedIds.length} rejected profiles`);
          setProfiles(data);
        } else {
          console.error("No profiles data returned or invalid format");
          setProfiles([]);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (profiles.length === 0) return;
    
    const currentProfile = profiles[0];
    const newProfiles = [...profiles.slice(1)];
    setProfiles(newProfiles);

    // Record the swipe in the backend
    try {
      if (!currentUserID) {
        console.error("User ID not available");
        return;
      }

      const { data, error } = await supabase.functions.invoke('record-swipe', {
        body: {
          userId: currentUserID,
          cardId: currentProfile.id,
          direction
        }
      });

      if (error) {
        console.error("Error recording swipe:", error);
        return;
      }

      // If it's a match, show the match animation
      if (data?.match) {
        setMatchedProfile(currentProfile);
        setShowMatch(true);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <HeaderBar />

      <main className="flex-1 flex items-center justify-center p-4 mt-16 mb-20">
        {loading ? (
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-96 w-72 bg-muted rounded-xl"></div>
            <div className="mt-4 h-4 w-48 bg-muted rounded"></div>
          </div>
        ) : (
          <div className="w-full max-w-md h-[32rem] relative">
            {profiles.length > 0 ? (
              profiles.map((profile, index) => (
                <div 
                  key={profile.id} 
                  className="absolute top-0 left-0 right-0 bottom-0"
                  style={{ zIndex: profiles.length - index }}
                >
                  <TinderCard
                    profile={profile}
                    onSwipe={handleSwipe}
                    isTop={index === 0}
                  />
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 border border-border rounded-xl">
                <h3 className="text-xl font-semibold mb-2">No more profiles</h3>
                <p className="text-muted-foreground">Check back later for more matches or adjust your settings.</p>
              </div>
            )}
          </div>
        )}
      </main>

      <NavBar />

      {showMatch && matchedProfile && (
        <MatchAnimation 
          profile={matchedProfile} 
          onClose={() => setShowMatch(false)} 
        />
      )}
    </div>
  );
};

export default Index;
