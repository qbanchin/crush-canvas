
import { useState, useEffect } from 'react';

interface SwipeState {
  isDragging: boolean;
  startX: number;
  offsetX: number;
  swipeDirection: 'left' | 'right' | null;
}

interface UseSwipeProps {
  isTop: boolean;
  onSwipe: (direction: 'left' | 'right') => void;
}

export function useSwipe({ isTop, onSwipe }: UseSwipeProps) {
  const [swipeState, setSwipeState] = useState<SwipeState>({
    isDragging: false,
    startX: 0,
    offsetX: 0,
    swipeDirection: null,
  });

  const { isDragging, startX, offsetX, swipeDirection } = swipeState;

  useEffect(() => {
    // Reset state when component updates
    setSwipeState({
      isDragging: false,
      startX: 0,
      offsetX: 0,
      swipeDirection: null,
    });
  }, []);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isTop) return;
    
    const clientX = 'touches' in e 
      ? e.touches[0].clientX 
      : (e as React.MouseEvent).clientX;
    
    setSwipeState(prev => ({
      ...prev,
      isDragging: true,
      startX: clientX,
    }));
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging || !isTop) return;
    
    const clientX = 'touches' in e 
      ? e.touches[0].clientX 
      : (e as React.MouseEvent).clientX;
    
    const newOffsetX = clientX - startX;
    let newDirection = swipeDirection;
    
    if (newOffsetX > 50) {
      newDirection = 'right';
    } else if (newOffsetX < -50) {
      newDirection = 'left';
    } else {
      newDirection = null;
    }

    setSwipeState(prev => ({
      ...prev,
      offsetX: newOffsetX,
      swipeDirection: newDirection,
    }));
  };

  const handleTouchEnd = () => {
    if (!isDragging || !isTop) return;
    
    if (offsetX > 100) {
      handleSwipe('right');
    } else if (offsetX < -100) {
      handleSwipe('left');
    } else {
      setSwipeState(prev => ({
        ...prev,
        isDragging: false,
        offsetX: 0,
        swipeDirection: null,
      }));
    }
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    setSwipeState(prev => ({
      ...prev,
      swipeDirection: direction,
    }));
    
    setTimeout(() => {
      onSwipe(direction);
      setSwipeState({
        isDragging: false,
        startX: 0,
        offsetX: 0,
        swipeDirection: null,
      });
    }, 300);
  };

  return {
    isDragging,
    offsetX,
    swipeDirection,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleSwipe,
  };
}
