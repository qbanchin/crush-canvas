
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Profile } from '@/data/profiles';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

interface MatchAnimationProps {
  profile: Profile;
  onClose: () => void;
}

const MatchAnimation: React.FC<MatchAnimationProps> = ({ profile, onClose }) => {
  const [stage, setStage] = useState<'initial' | 'visible' | 'photos' | 'closing'>('initial');

  useEffect(() => {
    // Animation sequence
    const showTimer = setTimeout(() => setStage('visible'), 100);
    const photosTimer = setTimeout(() => setStage('photos'), 1200);
    
    return () => {
      clearTimeout(showTimer);
      clearTimeout(photosTimer);
    };
  }, []);

  const handleClose = () => {
    setStage('closing');
    setTimeout(onClose, 500);
  };

  return (
    <div 
      className={cn(
        "match-animation",
        stage === 'initial' && 'opacity-0',
        stage === 'closing' && 'opacity-0 transition-opacity duration-500'
      )}
      onClick={handleClose}
    >
      <div 
        className="relative max-w-md w-full px-6 py-8 rounded-3xl glass-panel mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-8">
          <div className="mb-6">
            <div className={cn(
              "inline-block text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-tinder-red to-tinder-blue transform transition-all duration-700",
              stage === 'initial' && 'scale-0',
              stage !== 'initial' && 'scale-100'
            )}>
              You Connected!
            </div>
          </div>
          
          <p className={cn(
            "text-white/80 transition-opacity duration-500",
            stage === 'initial' && 'opacity-0',
            stage !== 'initial' && 'opacity-100'
          )}>
            You and {profile.name} have liked each other.
          </p>
        </div>
        
        <div className="flex justify-center items-center gap-4 mb-8">
          <div className={cn(
            "w-32 h-32 rounded-full border-4 border-tinder-blue shadow-lg overflow-hidden transition-all duration-700",
            stage === 'photos' ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"
          )}>
            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80')" }} />
          </div>
          
          <div className={cn(
            "w-32 h-32 rounded-full border-4 border-tinder-red shadow-lg overflow-hidden transition-all duration-700",
            stage === 'photos' ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
          )}>
            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${profile.images[0]})` }} />
          </div>
        </div>
        
        <div className={cn(
          "flex flex-col gap-3 transition-all duration-500",
          stage === 'photos' ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}>
          <Button 
            className="bg-gradient-to-r from-tinder-blue to-tinder-red hover:opacity-90 transition-opacity"
            onClick={handleClose}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Send a Message
          </Button>
          
          <Button 
            variant="outline" 
            className="border-white/20 text-white hover:bg-white/10 transition-colors"
            onClick={handleClose}
          >
            Keep Swiping
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MatchAnimation;
