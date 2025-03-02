
import React from 'react';
import { Profile } from '@/data/profiles';
import { Heart, X, MapPin, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProfileInfoProps {
  profile: Profile;
  showDetails: boolean;
  isTop: boolean;
  toggleDetails: (e: React.MouseEvent) => void;
  handleSwipe: (direction: 'left' | 'right') => void;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  profile,
  showDetails,
  isTop,
  toggleDetails,
  handleSwipe,
}) => {
  return (
    <div className={cn(
      "tinder-card-info",
      showDetails ? "h-3/4" : "h-auto"
    )}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-bold">{profile.name}, {profile.age}</h2>
          <div className="flex items-center text-sm text-white/80">
            <MapPin size={14} className="mr-1" />
            <span>{profile.distance} miles away</span>
          </div>
        </div>
        <button 
          onClick={toggleDetails}
          className="bg-black/20 backdrop-blur-sm p-2 rounded-full hover:bg-black/30 transition-colors"
        >
          <Info size={20} />
        </button>
      </div>
      
      {showDetails && (
        <div className="mt-4 animate-fade-in">
          <p className="mb-3">{profile.bio}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {profile.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {isTop && (
        <div className="flex justify-center gap-4 mt-6">
          <button 
            className="choice-button dislike"
            onClick={() => handleSwipe('left')}
          >
            <X size={24} />
          </button>
          <button 
            className="choice-button like"
            onClick={() => handleSwipe('right')}
          >
            <Heart size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;
