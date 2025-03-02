
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
    isDragging,
    offsetX,
    swipeDirection,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleSwipe
  } = useSwipe({ isTop, onSwipe });

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

  // Reset when profile changes
  useEffect(() => {
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
      <ProfileCarousel 
        images={profile.images}
        currentImageIndex={currentImageIndex}
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
