
import React from 'react';
import { Button } from '@/components/ui/button';
import { topRowCountries, bottomRowCountries, COUNTRIES_PER_PAGE } from '../CountrySelection';

export const getVisibleCountries = (countries: string[], visibleIndex: number) => {
  const maxPages = Math.ceil(countries.length / COUNTRIES_PER_PAGE);
  const safeIndex = visibleIndex % maxPages;
  const startIndex = safeIndex * COUNTRIES_PER_PAGE;
  return countries.slice(startIndex, startIndex + COUNTRIES_PER_PAGE);
};

export const CountryButton: React.FC<{
  country: string;
  selectedCountry: string;
  onClick: () => void;
  className?: string;
}> = ({ country, selectedCountry, onClick, className = '' }) => (
  <Button
    key={country}
    variant="outline"
    size="sm"
    className={`${className} rounded-full px-3 py-1 text-xs ${selectedCountry === country ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}`}
    onClick={onClick}
  >
    {country}
  </Button>
);

export const NavigationButton: React.FC<{
  direction: 'left' | 'right';
  onClick: () => void;
  disabled?: boolean;
}> = ({ direction, onClick, disabled = false }) => {
  const Icon = direction === 'left' ? ChevronLeft : ChevronRight;
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className={`absolute ${direction === 'left' ? 'left-0' : 'right-0'} top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm rounded-full p-1 h-8 w-8`}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon size={18} />
    </Button>
  );
};

import { ChevronLeft, ChevronRight, Globe } from 'lucide-react';
