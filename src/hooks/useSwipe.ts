
import { useState } from 'react';

interface UseSwipeProps {
  isTop: boolean;
  onSwipe: (direction: 'left' | 'right') => void;
}

export function useSwipe({ isTop, onSwipe }: UseSwipeProps) {
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  const handleSwipe = (direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    
    setTimeout(() => {
      onSwipe(direction);
      setSwipeDirection(null);
    }, 300);
  };

  return {
    isDragging: false,
    offsetX: 0,
    swipeDirection,
    handleTouchStart: () => {},
    handleTouchMove: () => {},
    handleTouchEnd: () => {},
    handleSwipe,
  };
}
