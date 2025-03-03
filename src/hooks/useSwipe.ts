
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
  const internalRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  const ref = containerRef || internalRef;

  const handleTouchStart = useCallback((e: React.TouchEvent | TouchEvent) => {
    if (multiRow && isMobile) return; // Disable touch handling for multi-row mobile layout
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setOffsetX(0);
  }, [multiRow, isMobile]);

  const handleMouseDown = useCallback((e: React.MouseEvent | MouseEvent) => {
    if (multiRow && isMobile) return; // Disable mouse handling for multi-row mobile layout
    setIsDragging(true);
    setStartX(e.clientX);
    setOffsetX(0);
  }, [multiRow, isMobile]);

  const handleTouchMove = useCallback((e: React.TouchEvent | TouchEvent) => {
    if (!isDragging || (multiRow && isMobile)) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    setOffsetX(diff);
  }, [isDragging, startX, multiRow, isMobile]);

  const handleMouseMove = useCallback((e: React.MouseEvent | MouseEvent) => {
    if (!isDragging || (multiRow && isMobile)) return;
    const currentX = e.clientX;
    const diff = currentX - startX;
    setOffsetX(diff);
  }, [isDragging, startX, multiRow, isMobile]);

  const handleSwipeEnd = useCallback(() => {
    if (!isDragging || (multiRow && isMobile)) return;
    
    setIsDragging(false);
    
    // Determine if this was a significant swipe (more than 50px)
    if (Math.abs(offsetX) > 50) {
      const direction = offsetX > 0 ? 'right' : 'left';
      setSwipeDirection(direction);
      
      if (onSwipe) {
        onSwipe(direction);
      }
      
      // Scroll the container if available
      if (ref.current) {
        const scrollAmount = direction === 'left' ? 200 : -200;
        ref.current.scrollBy({
          left: scrollAmount,
          behavior: 'smooth'
        });
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
  }, [isDragging, offsetX, onSwipe, ref, multiRow, isMobile]);

  const handleTouchEnd = useCallback(() => {
    handleSwipeEnd();
  }, [handleSwipeEnd]);

  const handleMouseUp = useCallback(() => {
    handleSwipeEnd();
  }, [handleSwipeEnd]);

  // Manual swipe function for button controls
  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    if (multiRow && isMobile) return; // Don't handle swipes for multi-row mobile layout
    
    setSwipeDirection(direction);
    
    if (onSwipe) {
      onSwipe(direction);
    }
    
    if (ref.current) {
      const scrollAmount = direction === 'left' ? 200 : -200;
      ref.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
    
    setTimeout(() => {
      setSwipeDirection(null);
    }, 300);
  }, [onSwipe, ref, multiRow, isMobile]);

  return {
    ref,
    isDragging,
    offsetX,
    swipeDirection,
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
