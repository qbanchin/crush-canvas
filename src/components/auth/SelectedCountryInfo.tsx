
import React from 'react';

interface SelectedCountryInfoProps {
  selectedCountry: string;
}

export const SelectedCountryInfo: React.FC<SelectedCountryInfoProps> = ({ selectedCountry }) => {
  if (!selectedCountry) return null;
  
  return (
    <div className="mt-8 p-4 border rounded-lg bg-card">
      <h3 className="text-lg font-medium mb-2">Profiles in {selectedCountry}</h3>
      <p className="text-muted-foreground text-sm">
        Create an account to see profiles from {selectedCountry} and start connecting!
      </p>
    </div>
  );
};
