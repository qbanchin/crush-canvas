
import React from 'react';

interface SwipeIndicatorProps {
  direction: 'left' | 'right' | null;
}

const SwipeIndicator: React.FC<SwipeIndicatorProps> = ({ direction }) => {
  if (!direction) return null;
  
  return (
    <>
      {direction === 'left' && (
        <div className="absolute top-10 right-10 rotate-12 border-4 border-tinder-red text-tinder-red p-2 text-2xl font-bold">
          NOPE
        </div>
      )}
      {direction === 'right' && (
        <div className="absolute top-10 left-10 -rotate-12 border-4 border-tinder-blue text-tinder-blue p-2 text-2xl font-bold">
          LIKE
        </div>
      )}
    </>
  );
};

export default SwipeIndicator;
