import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Globe } from 'lucide-react';
import { useSwipe } from '@/hooks/useSwipe';

interface CountrySelectionProps {
  selectedCountry: string;
  onCountryClick: (country: string) => void;
  isMobile: boolean;
}

// Define country lists
const topRowCountries = [
  'Spain',
  'Portugal',
  'Thailand',
  'Philippines',
  'Vietnam',
  'Cambodia'
];

const bottomRowCountries = [
  'Indonesia',
  'Colombia',
  'Panama',
  'Mexico',
  'Nicaragua',
  'Costa Rica'
];

const COUNTRIES_PER_PAGE = 3;

export const CountrySelection: React.FC<CountrySelectionProps> = ({
  selectedCountry,
  onCountryClick,
  isMobile
}) => {
  const topRowRef = useRef<HTMLDivElement>(null);
  const bottomRowRef = useRef<HTMLDivElement>(null);
  const desktopMenuRef = useRef<HTMLDivElement>(null);
  
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

  const getVisibleCountries = (countries: string[], visibleIndex: number) => {
    const maxPages = Math.ceil(countries.length / COUNTRIES_PER_PAGE);
    const safeIndex = visibleIndex % maxPages;
    const startIndex = safeIndex * COUNTRIES_PER_PAGE;
    return countries.slice(startIndex, startIndex + COUNTRIES_PER_PAGE);
  };

  const visibleTopCountries = getVisibleCountries(topRowCountries, topVisibleIndex);
  const visibleBottomCountries = getVisibleCountries(bottomRowCountries, bottomVisibleIndex);

  const maxTopPages = Math.ceil(topRowCountries.length / COUNTRIES_PER_PAGE);
  const maxBottomPages = Math.ceil(bottomRowCountries.length / COUNTRIES_PER_PAGE);

  if (isMobile) {
    return (
      <div className="flex flex-col gap-3 px-2">
        
        <div className="relative">
          <div 
            ref={topRowRef}
            className="flex items-center gap-2 overflow-hidden pb-2 min-h-[40px]"
            onTouchStart={handleTopRowTouchStart}
            onTouchMove={handleTopRowTouchMove}
            onTouchEnd={handleTopRowTouchEnd}
            onMouseDown={handleTopRowMouseDown}
            onMouseMove={handleTopRowMouseMove}
            onMouseUp={handleTopRowMouseUp}
          >
            <div className={`flex items-center gap-2 transition-transform duration-300 w-full ${
              topRowSwipeDirection === 'left' ? 'animate-slide-out-left' : 
              topRowSwipeDirection === 'right' ? 'animate-slide-out-right' : ''
            }`}>
              {visibleTopCountries.map((country) => (
                <Button
                  key={country}
                  variant="outline"
                  size="sm"
                  className={`flex-1 rounded-full px-3 py-1 text-xs ${selectedCountry === country ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}`}
                  onClick={() => onCountryClick(country)}
                >
                  {country}
                </Button>
              ))}
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm rounded-full p-1 h-8 w-8"
            onClick={() => handleTopRowSwipe('right')}
            disabled={topVisibleIndex === 0}
          >
            <ChevronLeft size={18} />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm rounded-full p-1 h-8 w-8"
            onClick={() => handleTopRowSwipe('left')}
            disabled={topVisibleIndex >= maxTopPages - 1}
          >
            <ChevronRight size={18} />
          </Button>
        </div>
        
        <div className="relative">
          <div 
            ref={bottomRowRef}
            className="flex items-center gap-2 overflow-hidden pb-2 min-h-[40px]"
            onTouchStart={handleBottomRowTouchStart}
            onTouchMove={handleBottomRowTouchMove}
            onTouchEnd={handleBottomRowTouchEnd}
            onMouseDown={handleBottomRowMouseDown}
            onMouseMove={handleBottomRowMouseMove}
            onMouseUp={handleBottomRowMouseUp}
          >
            <div className={`flex items-center gap-2 transition-transform duration-300 w-full ${
              bottomRowSwipeDirection === 'left' ? 'animate-slide-out-left' : 
              bottomRowSwipeDirection === 'right' ? 'animate-slide-out-right' : ''
            }`}>
              {visibleBottomCountries.map((country) => (
                <Button
                  key={country}
                  variant="outline"
                  size="sm"
                  className={`flex-1 rounded-full px-3 py-1 text-xs ${selectedCountry === country ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}`}
                  onClick={() => onCountryClick(country)}
                >
                  {country}
                </Button>
              ))}
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm rounded-full p-1 h-8 w-8"
            onClick={() => handleBottomRowSwipe('right')}
            disabled={bottomVisibleIndex === 0}
          >
            <ChevronLeft size={18} />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm rounded-full p-1 h-8 w-8"
            onClick={() => handleBottomRowSwipe('left')}
            disabled={bottomVisibleIndex >= maxBottomPages - 1}
          >
            <ChevronRight size={18} />
          </Button>
        </div>
      </div>
    );
  }

  // Desktop layout
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
          <div className="flex-shrink-0 font-medium text-muted-foreground flex items-center gap-1 pl-2">
            <Globe size={16} />
            <span>Explore:</span>
          </div>
          {[...topRowCountries, ...bottomRowCountries].map((country) => (
            <Button
              key={country}
              variant="outline"
              size="sm"
              className={`flex-shrink-0 rounded-full px-3 py-1 text-xs ${selectedCountry === country ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}`}
              onClick={() => onCountryClick(country)}
            >
              {country}
            </Button>
          ))}
        </div>
      </div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm rounded-full p-1 h-8 w-8"
        onClick={() => handleDesktopSwipe('right')}
      >
        <ChevronLeft size={18} />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm rounded-full p-1 h-8 w-8"
        onClick={() => handleDesktopSwipe('left')}
      >
        <ChevronRight size={18} />
      </Button>
    </div>
  );
};
