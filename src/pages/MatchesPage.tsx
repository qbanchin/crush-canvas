
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import HeaderBar from '@/components/HeaderBar';
import NavBar from '@/components/NavBar';
import { supabase } from '@/integrations/supabase/client';
import { Profile, profiles } from '@/data/profiles';
import ConnectionList from '@/components/matches/ConnectionList';
import ProfileDialog from '@/components/matches/ProfileDialog';
import ConnectionChat from '@/components/ConnectionChat';

const MatchesPage = () => {
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
        
        <ConnectionList 
          connections={connections}
          loading={loading}
          onProfileClick={handleProfileClick}
        />
      </main>

      <NavBar />

      {/* Profile Dialog */}
      <ProfileDialog 
        profile={selectedProfile}
        open={!!selectedProfile}
        onOpenChange={(open) => !open && setSelectedProfile(null)}
        onOpenChat={handleOpenChat}
      />

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
