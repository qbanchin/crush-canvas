
import { useState, useRef, useCallback } from 'react';
import { useIsMobile } from './use-mobile';

interface UseSwipeProps {
  isTop?: boolean;
  onSwipe?: (direction: 'left' | 'right') => void;
  containerRef?: React.RefObject<HTMLElement>;
  multiRow?: boolean;
}

export function useSwipe({ isTop = false, onSwipe, containerRef, multiRow = false }: UseSwipeProps = {}) {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const internalRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  const ref = containerRef || internalRef;

  const handleTouchStart = useCallback((e: React.TouchEvent | TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setOffsetX(0);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent | MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setOffsetX(0);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent | TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    setOffsetX(diff);
  }, [isDragging, startX]);

  const handleMouseMove = useCallback((e: React.MouseEvent | MouseEvent) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const diff = currentX - startX;
    setOffsetX(diff);
  }, [isDragging, startX]);

  const handleSwipeEnd = useCallback(() => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // Determine if this was a significant swipe (more than 50px)
    if (Math.abs(offsetX) > 50) {
      const direction = offsetX > 0 ? 'right' : 'left';
      setSwipeDirection(direction);
      
      if (onSwipe) {
        onSwipe(direction);
      }
      
      // Instead of scrolling, update the visibleIndex to show different countries
      if (direction === 'left') {
        setVisibleIndex(prev => prev + 1);
      } else {
        setVisibleIndex(prev => Math.max(0, prev - 1));
      }
      
      // Reset swipe direction after animation
      setTimeout(() => {
        setSwipeDirection(null);
        setOffsetX(0);
      }, 300);
    } else {
      // Reset if it wasn't a significant swipe
      setOffsetX(0);
    }
  }, [isDragging, offsetX, onSwipe]);

  const handleTouchEnd = useCallback(() => {
    handleSwipeEnd();
  }, [handleSwipeEnd]);

  const handleMouseUp = useCallback(() => {
    handleSwipeEnd();
  }, [handleSwipeEnd]);

  // Manual swipe function for button controls
  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    
    if (onSwipe) {
      onSwipe(direction);
    }
    
    if (direction === 'left') {
      setVisibleIndex(prev => prev + 1);
    } else {
      setVisibleIndex(prev => Math.max(0, prev - 1));
    }
    
    setTimeout(() => {
      setSwipeDirection(null);
    }, 300);
  }, [onSwipe]);

  return {
    ref,
    isDragging,
    offsetX,
    swipeDirection,
    visibleIndex,
    setVisibleIndex,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleSwipe,
    isMobile
  };
}
