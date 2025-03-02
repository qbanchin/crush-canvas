import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import HeaderBar from '@/components/HeaderBar';
import NavBar from '@/components/NavBar';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/data/profiles';

const MatchesPage = () => {
  const [matches, setMatches] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserID, setCurrentUserID] = useState("temp-user-id"); // Will be replaced with auth user ID later

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.functions.invoke('get-matches', {
          body: { userId: currentUserID }
        });
        
        if (error) {
          console.error("Error fetching matches:", error);
          toast.error("Failed to load matches");
          return;
        }
        
        if (data && Array.isArray(data)) {
          setMatches(data);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [currentUserID]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <HeaderBar />

      <main className="flex-1 p-4 mt-16 mb-20 max-w-3xl mx-auto w-full">
        <h1 className="text-2xl font-bold mb-6">Your Connections</h1>
        
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse flex flex-col">
                <div className="h-32 w-full bg-muted rounded-xl"></div>
                <div className="mt-2 h-4 w-20 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        ) : matches.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {matches.map((match) => (
              <div 
                key={match.id} 
                className="flex flex-col border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow"
              >
                <div 
                  className="h-40 bg-cover bg-center" 
                  style={{ backgroundImage: `url(${match.images[0]})` }}
                ></div>
                <div className="p-3">
                  <h3 className="font-medium">{match.name}, {match.age}</h3>
                  <p className="text-sm text-muted-foreground truncate">{match.bio}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No connections yet</h3>
            <p className="text-muted-foreground">Keep swiping to find your connections!</p>
          </div>
        )}
      </main>

      <NavBar />
    </div>
  );
};

export default MatchesPage;
