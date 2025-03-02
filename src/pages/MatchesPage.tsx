
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import HeaderBar from '@/components/HeaderBar';
import NavBar from '@/components/NavBar';
import { supabase } from '@/integrations/supabase/client';
import { Profile, profiles } from '@/data/profiles';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ConnectionChat from '@/components/ConnectionChat';

const MatchesPage = () => {
  const navigate = useNavigate();
  const [connections, setConnections] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserID, setCurrentUserID] = useState("temp-user-id"); // Will be replaced with auth user ID later
  const [useTestData, setUseTestData] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

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

  const handleProfileClick = (profileId: string) => {
    // Find the profile in connections
    const profile = connections.find(p => p.id === profileId);
    if (profile) {
      setSelectedProfile(profile);
    }
  };

  const handleOpenChat = () => {
    if (selectedProfile) {
      setChatOpen(true);
    }
  };

  const handleMessageSent = () => {
    // This is called when a message is sent successfully
    // We could use this to refresh connections if needed
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
                className="flex flex-col border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleProfileClick(connection.id)}
              >
                <div 
                  className="h-40 bg-cover bg-center hover:opacity-90 transition-opacity" 
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

      {/* Profile Dialog */}
      {selectedProfile && (
        <Dialog open={!!selectedProfile} onOpenChange={(open) => !open && setSelectedProfile(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedProfile.name}, {selectedProfile.age}</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {selectedProfile.distance} miles away
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div 
                className="h-60 bg-cover bg-center rounded-md" 
                style={{ backgroundImage: `url(${selectedProfile.images[0]})` }}
              ></div>
              
              <p>{selectedProfile.bio}</p>
              
              {selectedProfile.tags && selectedProfile.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedProfile.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-muted text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <DialogFooter className="sm:justify-start">
              <Button 
                onClick={handleOpenChat}
                className="w-full sm:w-auto"
              >
                Open Chat
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Chat Dialog */}
      <ConnectionChat 
        open={chatOpen}
        onOpenChange={setChatOpen}
        connection={selectedProfile}
        currentUserId={currentUserID}
        useTestData={useTestData}
        onMessageSent={handleMessageSent}
      />
    </div>
  );
};

export default MatchesPage;
