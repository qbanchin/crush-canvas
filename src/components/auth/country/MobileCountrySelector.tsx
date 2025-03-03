
import React, { useRef } from 'react';
import { useSwipe } from '@/hooks/useSwipe';
import { getVisibleCountries, CountryButton, NavigationButton } from './CountrySelectorUtils';
import { topRowCountries, bottomRowCountries, COUNTRIES_PER_PAGE } from '../CountrySelection';

interface MobileCountrySelectorProps {
  selectedCountry: string;
  onCountryClick: (country: string) => void;
}

export const MobileCountrySelector: React.FC<MobileCountrySelectorProps> = ({
  selectedCountry,
  onCountryClick
}) => {
  const topRowRef = useRef<HTMLDivElement>(null);
  const bottomRowRef = useRef<HTMLDivElement>(null);
  
  const { 
    handleTouchStart: handleTopRowTouchStart, 
    handleTouchMove: handleTopRowTouchMove, 
    handleTouchEnd: handleTopRowTouchEnd, 
    handleMouseDown: handleTopRowMouseDown, 
    handleMouseMove: handleTopRowMouseMove, 
    handleMouseUp: handleTopRowMouseUp, 
    handleSwipe: handleTopRowSwipe,
    swipeDirection: topRowSwipeDirection,
    visibleIndex: topVisibleIndex,
    setVisibleIndex: setTopVisibleIndex,
  } = useSwipe({ 
    containerRef: topRowRef,
    onSwipe: (direction) => {
      console.log(`Top row swiped ${direction}`);
    } 
  });
  
  const { 
    handleTouchStart: handleBottomRowTouchStart, 
    handleTouchMove: handleBottomRowTouchMove, 
    handleTouchEnd: handleBottomRowTouchEnd, 
    handleMouseDown: handleBottomRowMouseDown, 
    handleMouseMove: handleBottomRowMouseMove, 
    handleMouseUp: handleBottomRowMouseUp, 
    handleSwipe: handleBottomRowSwipe,
    swipeDirection: bottomRowSwipeDirection,
    visibleIndex: bottomVisibleIndex,
    setVisibleIndex: setBottomVisibleIndex
  } = useSwipe({ 
    containerRef: bottomRowRef,
    onSwipe: (direction) => {
      console.log(`Bottom row swiped ${direction}`);
    } 
  });

  const visibleTopCountries = getVisibleCountries(topRowCountries, topVisibleIndex);
  const visibleBottomCountries = getVisibleCountries(bottomRowCountries, bottomVisibleIndex);

  const maxTopPages = Math.ceil(topRowCountries.length / COUNTRIES_PER_PAGE);
  const maxBottomPages = Math.ceil(bottomRowCountries.length / COUNTRIES_PER_PAGE);

  return (
    <div className="flex flex-col gap-3 px-2">
      <CountryRow 
        ref={topRowRef}
        countries={visibleTopCountries}
        selectedCountry={selectedCountry}
        onCountryClick={onCountryClick}
        swipeDirection={topRowSwipeDirection}
        onTouchStart={handleTopRowTouchStart}
        onTouchMove={handleTopRowTouchMove}
        onTouchEnd={handleTopRowTouchEnd}
        onMouseDown={handleTopRowMouseDown}
        onMouseMove={handleTopRowMouseMove}
        onMouseUp={handleTopRowMouseUp}
        onLeftClick={() => handleTopRowSwipe('right')}
        onRightClick={() => handleTopRowSwipe('left')}
        disableLeftButton={topVisibleIndex === 0}
        disableRightButton={topVisibleIndex >= maxTopPages - 1}
      />
      
      <CountryRow 
        ref={bottomRowRef}
        countries={visibleBottomCountries}
        selectedCountry={selectedCountry}
        onCountryClick={onCountryClick}
        swipeDirection={bottomRowSwipeDirection}
        onTouchStart={handleBottomRowTouchStart}
        onTouchMove={handleBottomRowTouchMove}
        onTouchEnd={handleBottomRowTouchEnd}
        onMouseDown={handleBottomRowMouseDown}
        onMouseMove={handleBottomRowMouseMove}
        onMouseUp={handleBottomRowMouseUp}
        onLeftClick={() => handleBottomRowSwipe('right')}
        onRightClick={() => handleBottomRowSwipe('left')}
        disableLeftButton={bottomVisibleIndex === 0}
        disableRightButton={bottomVisibleIndex >= maxBottomPages - 1}
      />
    </div>
  );
};

interface CountryRowProps {
  countries: string[];
  selectedCountry: string;
  onCountryClick: (country: string) => void;
  swipeDirection: 'left' | 'right' | null;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: (e: React.MouseEvent) => void;
  onLeftClick: () => void;
  onRightClick: () => void;
  disableLeftButton: boolean;
  disableRightButton: boolean;
}

const CountryRow = React.forwardRef<HTMLDivElement, CountryRowProps>(({
  countries,
  selectedCountry,
  onCountryClick,
  swipeDirection,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onLeftClick,
  onRightClick,
  disableLeftButton,
  disableRightButton
}, ref) => {
  return (
    <div className="relative">
      <div 
        ref={ref}
        className="flex items-center gap-2 overflow-hidden pb-2 min-h-[40px]"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      >
        <div className={`flex items-center gap-2 transition-transform duration-300 w-full ${
          swipeDirection === 'left' ? 'animate-slide-out-left' : 
          swipeDirection === 'right' ? 'animate-slide-out-right' : ''
        }`}>
          {countries.map((country) => (
            <CountryButton
              key={country}
              country={country}
              selectedCountry={selectedCountry}
              onClick={() => onCountryClick(country)}
              className="flex-1"
            />
          ))}
        </div>
      </div>
      
      <NavigationButton
        direction="left"
        onClick={onLeftClick}
        disabled={disableLeftButton}
      />
      
      <NavigationButton
        direction="right"
        onClick={onRightClick}
        disabled={disableRightButton}
      />
    </div>
  );
});

CountryRow.displayName = 'CountryRow';
