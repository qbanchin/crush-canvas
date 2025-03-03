
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CountryButtonProps {
  country: string;
  className?: string;
}

const countries = [
  'Spain',
  'Portugal',
  'Thailand',
  'Philippines',
  'Vietnam',
  'Cambodia',
  'Indonesia',
  'Colombia',
  'Panama',
  'Mexico',
  'Nicaragua',
  'Costa Rica'
];

const CountryButton: React.FC<CountryButtonProps> = ({ country, className }) => {
  const navigate = useNavigate();
  
  const handleCountryClick = () => {
    // Navigate to the home page with the country as a query parameter
    navigate(`/?country=${encodeURIComponent(country)}`);
  };
  
  return (
    <Button 
      variant="outline" 
      size="sm"
      className={`bg-white/10 hover:bg-white/20 text-white border-transparent flex items-center gap-1 text-xs py-1 px-2 h-auto ${className}`}
      onClick={handleCountryClick}
    >
      <MapPin size={12} />
      {country}
    </Button>
  );
};

const CountryPreviewButtons: React.FC = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="relative w-full h-full max-w-md max-h-md">
        {countries.map((country, index) => {
          // Calculate position around a circle
          const angle = (index / countries.length) * 2 * Math.PI;
          const radius = 180; // Adjust based on your layout
          const left = 50 + Math.cos(angle) * radius;
          const top = 50 + Math.sin(angle) * radius;
          
          return (
            <div 
              key={country}
              className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2"
              style={{ 
                left: `${left}%`, 
                top: `${top}%`,
                zIndex: 5
              }}
            >
              <CountryButton country={country} />
            </div>
          );
        })}
        
        {/* Center button */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-white/10 hover:bg-white/20 text-white border-transparent rounded-full p-2 h-auto w-auto"
          >
            <Globe size={24} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CountryPreviewButtons;
