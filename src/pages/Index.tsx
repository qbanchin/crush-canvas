
import React, { useState, useRef, useEffect } from 'react';
import TinderCard from '@/components/TinderCard';
import MatchAnimation from '@/components/MatchAnimation';
import HeaderBar from '@/components/HeaderBar';
import NavBar from '@/components/NavBar';
import { profiles, Profile } from '@/data/profiles';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [currentProfiles, setCurrentProfiles] = useState<Profile[]>([...profiles]);
  const [showMatch, setShowMatch] = useState<Profile | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Reset to all profiles if we run out
  useEffect(() => {
    if (currentProfiles.length === 0) {
      setTimeout(() => {
        setCurrentProfiles([...profiles]);
        toast({
          title: "New profiles available!",
          description: "We've refreshed your deck with new people to discover.",
        });
      }, 500);
    }
  }, [currentProfiles]);

  const handleSwipe = (direction: 'left' | 'right') => {
    // Show match animation randomly when swiping right (like)
    if (direction === 'right' && Math.random() > 0.5) {
      setShowMatch(currentProfiles[0]);
    }
    
    // Remove the top card after swiping
    setCurrentProfiles(prev => prev.slice(1));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderBar />
      
      <main className="flex-1 flex items-center justify-center px-4 pt-16 pb-20">
        <div 
          ref={containerRef}
          className="relative w-full max-w-md h-[70vh] rounded-2xl overflow-hidden"
        >
          {currentProfiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6 animate-fade-in">
              <div className="text-2xl font-bold mb-4">No more profiles</div>
              <p className="text-muted-foreground">
                Check back soon or adjust your discovery settings to see more people.
              </p>
            </div>
          ) : (
            currentProfiles.slice(0, 3).map((profile, index) => (
              <div 
                key={profile.id} 
                className="absolute inset-0"
                style={{ 
                  zIndex: currentProfiles.length - index,
                  transform: `scale(${1 - index * 0.05}) translateY(${index * 10}px)`,
                  opacity: 1 - index * 0.2
                }}
              >
                <TinderCard 
                  profile={profile} 
                  onSwipe={handleSwipe} 
                  isTop={index === 0} 
                />
              </div>
            ))
          )}
        </div>
      </main>
      
      <NavBar />
      
      {showMatch && (
        <MatchAnimation 
          profile={showMatch} 
          onClose={() => setShowMatch(null)} 
        />
      )}
    </div>
  );
};

export default Index;
