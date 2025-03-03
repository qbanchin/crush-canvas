
import React from 'react';
import { MobileCountrySelector } from './country/MobileCountrySelector';
import { DesktopCountrySelector } from './country/DesktopCountrySelector';

interface CountrySelectionProps {
  selectedCountry: string;
  onCountryClick: (country: string) => void;
  isMobile: boolean;
}

// Define country lists
export const topRowCountries = [
  'Spain',
  'Portugal',
  'Thailand',
  'Philippines',
  'Vietnam',
  'Cambodia'
];

export const bottomRowCountries = [
  'Indonesia',
  'Colombia',
  'Panama',
  'Mexico',
  'Nicaragua',
  'Costa Rica'
];

export const COUNTRIES_PER_PAGE = 3;

export const CountrySelection: React.FC<CountrySelectionProps> = ({
  selectedCountry,
  onCountryClick,
  isMobile
}) => {
  return isMobile ? (
    <MobileCountrySelector 
      selectedCountry={selectedCountry}
      onCountryClick={onCountryClick}
    />
  ) : (
    <DesktopCountrySelector 
      selectedCountry={selectedCountry}
      onCountryClick={onCountryClick}
    />
  );
};
