
import React, { useState, useRef, useEffect } from 'react';
import { Profile } from '@/data/profiles';
import { Heart, X, MapPin, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TinderCardProps {
  profile: Profile;
  onSwipe: (direction: 'left' | 'right') => void;
  isTop: boolean;
}

const TinderCard: React.FC<TinderCardProps> = ({ profile, onSwipe, isTop }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isTop) return;
    
    setIsDragging(true);
    const clientX = 'touches' in e 
      ? e.touches[0].clientX 
      : (e as React.MouseEvent).clientX;
    
    setStartX(clientX);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging || !isTop) return;
    
    const clientX = 'touches' in e 
      ? e.touches[0].clientX 
      : (e as React.MouseEvent).clientX;
    
    const newOffsetX = clientX - startX;
    setOffsetX(newOffsetX);
    
    if (newOffsetX > 50) {
      setSwipeDirection('right');
    } else if (newOffsetX < -50) {
      setSwipeDirection('left');
    } else {
      setSwipeDirection(null);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging || !isTop) return;
    
    setIsDragging(false);
    
    if (offsetX > 100) {
      handleSwipe('right');
    } else if (offsetX < -100) {
      handleSwipe('left');
    } else {
      setOffsetX(0);
      setSwipeDirection(null);
    }
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    
    setTimeout(() => {
      onSwipe(direction);
      setOffsetX(0);
      setSwipeDirection(null);
    }, 300);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev < profile.images.length - 1 ? prev + 1 : 0
    );
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev > 0 ? prev - 1 : profile.images.length - 1
    );
  };

  const toggleDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDetails(!showDetails);
  };

  // Prevents cards from staying in a swiped state if component updates
  useEffect(() => {
    setSwipeDirection(null);
    setOffsetX(0);
    setIsDragging(false);
    setCurrentImageIndex(0);
  }, [profile.id]);

  const cardStyle = {
    transform: isDragging ? `translateX(${offsetX}px) rotate(${offsetX * 0.05}deg)` : 'none',
    backgroundImage: `url(${profile.images[currentImageIndex]})`,
    zIndex: isTop ? 10 : 0
  };

  const swipeClass = swipeDirection 
    ? swipeDirection === 'left' 
      ? 'swiped-left' 
      : 'swiped-right' 
    : '';

  return (
    <div 
      ref={cardRef}
      className={cn('tinder-card', isDragging && 'active', swipeClass)}
      style={cardStyle}
      onMouseDown={handleTouchStart}
      onMouseMove={handleTouchMove}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Image navigation dots */}
      <div className="absolute top-4 left-0 right-0 flex justify-center gap-1.5">
        {profile.images.map((_, index) => (
          <div 
            key={index}
            className={`h-1 rounded-full transition-all duration-300 ${
              index === currentImageIndex 
                ? 'w-6 bg-white' 
                : 'w-1.5 bg-white/50'
            }`}
          />
        ))}
      </div>
      
      {/* Left/Right image navigation */}
      {profile.images.length > 1 && (
        <>
          <div 
            className="absolute left-0 top-0 bottom-0 w-1/4" 
            onClick={prevImage}
            onTouchEnd={(e) => {
              e.stopPropagation();
              prevImage(e as unknown as React.MouseEvent);
            }}
          />
          <div 
            className="absolute right-0 top-0 bottom-0 w-1/4" 
            onClick={nextImage}
            onTouchEnd={(e) => {
              e.stopPropagation();
              nextImage(e as unknown as React.MouseEvent);
            }}
          />
        </>
      )}
      
      {/* Swipe indicators */}
      {swipeDirection === 'left' && (
        <div className="absolute top-10 right-10 rotate-12 border-4 border-tinder-red text-tinder-red p-2 text-2xl font-bold">
          NOPE
        </div>
      )}
      {swipeDirection === 'right' && (
        <div className="absolute top-10 left-10 -rotate-12 border-4 border-tinder-blue text-tinder-blue p-2 text-2xl font-bold">
          LIKE
        </div>
      )}
      
      {/* Profile info */}
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
    </div>
  );
};

export default TinderCard;
