
import React from 'react';

interface SelectedCountryInfoProps {
  selectedCountry: string;
}

export const SelectedCountryInfo: React.FC<SelectedCountryInfoProps> = ({ selectedCountry }) => {
  if (!selectedCountry) return null;
  
  return (
    <div className="p-3 border rounded-lg bg-card shadow-sm">
      <h3 className="text-sm font-medium text-primary">Showing profiles from {selectedCountry}</h3>
    </div>
  );
};
