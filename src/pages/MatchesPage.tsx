
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import HeaderBar from '@/components/HeaderBar';
import NavBar from '@/components/NavBar';
import { supabase } from '@/integrations/supabase/client';
import { Profile, profiles } from '@/data/profiles';

const MatchesPage = () => {
  const [connections, setConnections] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserID, setCurrentUserID] = useState("temp-user-id"); // Will be replaced with auth user ID later
  const [useTestData, setUseTestData] = useState(false);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        setLoading(true);
        
        // Try to fetch from Supabase first
        if (!useTestData) {
          const { data, error } = await supabase.functions.invoke('get-matches', {
            body: { userId: currentUserID }
          });
          
          if (error) {
            console.error("Error fetching connections:", error);
            toast.error("Using test data instead of backend");
            setUseTestData(true);
          } else if (data && Array.isArray(data)) {
            setConnections(data);
            setLoading(false);
            return;
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
  }, [currentUserID, useTestData]);

  const toggleTestData = () => {
    setUseTestData(prev => !prev);
    setLoading(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <HeaderBar />

      <main className="flex-1 p-4 mt-16 mb-20 max-w-3xl mx-auto w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Your Connections</h1>
          <button 
            onClick={toggleTestData}
            className="text-sm px-3 py-1 rounded-full bg-muted hover:bg-muted/80 transition-colors"
          >
            {useTestData ? "Try API" : "Use Test Data"}
          </button>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse flex flex-col">
                <div className="h-32 w-full bg-muted rounded-xl"></div>
                <div className="mt-2 h-4 w-20 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        ) : connections.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {connections.map((connection) => (
              <div 
                key={connection.id} 
                className="flex flex-col border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow"
              >
                <div 
                  className="h-40 bg-cover bg-center" 
                  style={{ backgroundImage: `url(${connection.images[0]})` }}
                ></div>
                <div className="p-3">
                  <h3 className="font-medium">{connection.name}, {connection.age}</h3>
                  <p className="text-sm text-muted-foreground truncate">{connection.bio}</p>
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
