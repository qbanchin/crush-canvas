
import React, { useRef } from 'react';
import { Globe } from 'lucide-react';
import { useSwipe } from '@/hooks/useSwipe';
import { CountryButton, NavigationButton } from './CountrySelectorUtils';
import { topRowCountries, bottomRowCountries } from '../CountrySelection';

interface DesktopCountrySelectorProps {
  selectedCountry: string;
  onCountryClick: (country: string) => void;
}

export const DesktopCountrySelector: React.FC<DesktopCountrySelectorProps> = ({
  selectedCountry,
  onCountryClick
}) => {
  const desktopMenuRef = useRef<HTMLDivElement>(null);
  
  const { 
    handleTouchStart: handleDesktopTouchStart, 
    handleTouchMove: handleDesktopTouchMove, 
    handleTouchEnd: handleDesktopTouchEnd, 
    handleMouseDown: handleDesktopMouseDown, 
    handleMouseMove: handleDesktopMouseMove, 
    handleMouseUp: handleDesktopMouseUp, 
    handleSwipe: handleDesktopSwipe,
    swipeDirection: desktopSwipeDirection,
    visibleIndex: desktopVisibleIndex,
    setVisibleIndex: setDesktopVisibleIndex
  } = useSwipe({ 
    containerRef: desktopMenuRef,
    onSwipe: (direction) => {
      console.log(`Desktop menu swiped ${direction}`);
    } 
  });

  return (
    <div className="relative">
      <div 
        ref={desktopMenuRef}
        className="flex items-center gap-2 overflow-hidden pb-2 min-h-[40px]"
        onTouchStart={handleDesktopTouchStart}
        onTouchMove={handleDesktopTouchMove}
        onTouchEnd={handleDesktopTouchEnd}
        onMouseDown={handleDesktopMouseDown}
        onMouseMove={handleDesktopMouseMove}
        onMouseUp={handleDesktopMouseUp}
      >
        <div className={`flex items-center gap-2 transition-transform duration-300 ${
          desktopSwipeDirection === 'left' ? 'animate-slide-out-left' : 
          desktopSwipeDirection === 'right' ? 'animate-slide-out-right' : ''
        }`}>
          {[...topRowCountries, ...bottomRowCountries].map((country) => (
            <CountryButton
              key={country}
              country={country}
              selectedCountry={selectedCountry}
              onClick={() => onCountryClick(country)}
              className="flex-shrink-0"
            />
          ))}
        </div>
      </div>
      
      <NavigationButton
        direction="left"
        onClick={() => handleDesktopSwipe('right')}
      />
      
      <NavigationButton
        direction="right"
        onClick={() => handleDesktopSwipe('left')}
      />
    </div>
  );
};
