
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
  const [currentUserID, setCurrentUserID] = useState("temp-user-id"); // Will be replaced with auth user ID later

  useEffect(() => {
    // Fetch profiles from the backend
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.functions.invoke('get-cards');
        
        if (error) {
          console.error("Error fetching profiles:", error);
          toast.error("Failed to load profiles");
          return;
        }
        
        if (data && Array.isArray(data)) {
          setProfiles(data);
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
