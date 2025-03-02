
import React, { useState, useRef, useEffect } from 'react';
import { Profile } from '@/data/profiles';
import { cn } from '@/lib/utils';
import { useSwipe } from '@/hooks/useSwipe';
import ProfileInfo from './ProfileInfo';
import ProfileCarousel from './ProfileCarousel';
import SwipeIndicator from './SwipeIndicator';

interface TinderCardProps {
  profile: Profile;
  onSwipe: (direction: 'left' | 'right') => void;
  isTop: boolean;
}

const TinderCard: React.FC<TinderCardProps> = ({ profile, onSwipe, isTop }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const {
    swipeDirection,
    handleSwipe
  } = useSwipe({ isTop, onSwipe });

  // Add validation and logging
  const images = profile.images || [];
  console.log("TinderCard - Profile images:", images.length, "Current index:", currentImageIndex);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (images.length <= 1) return;
    setCurrentImageIndex((prev) => 
      prev < images.length - 1 ? prev + 1 : 0
    );
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (images.length <= 1) return;
    setCurrentImageIndex((prev) => 
      prev > 0 ? prev - 1 : images.length - 1
    );
  };

  const toggleDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDetails(!showDetails);
  };

  // Reset when profile changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [profile.id]);

  // Ensure valid image index
  const validIndex = Math.min(Math.max(0, currentImageIndex), images.length - 1);
  const currentImage = images.length > 0 ? images[validIndex] : '/placeholder.svg';

  const cardStyle = {
    backgroundImage: `url(${currentImage})`,
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
      className={cn('tinder-card', swipeClass)}
      style={cardStyle}
    >
      <ProfileCarousel 
        images={images}
        currentImageIndex={validIndex}
        onPrevImage={prevImage}
        onNextImage={nextImage}
      />
      
      <SwipeIndicator direction={swipeDirection} />
      
      <ProfileInfo 
        profile={profile}
        showDetails={showDetails}
        isTop={isTop}
        toggleDetails={toggleDetails}
        handleSwipe={handleSwipe}
      />
    </div>
  );
};

export default TinderCard;
