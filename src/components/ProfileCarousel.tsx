
import React from 'react';

interface ProfileCarouselProps {
  images: string[];
  currentImageIndex: number;
  onPrevImage: (e: React.MouseEvent) => void;
  onNextImage: (e: React.MouseEvent) => void;
}

const ProfileCarousel: React.FC<ProfileCarouselProps> = ({
  images,
  currentImageIndex,
  onPrevImage,
  onNextImage,
}) => {
  return (
    <>
      {/* Image navigation dots */}
      <div className="absolute top-4 left-0 right-0 flex justify-center gap-1.5">
        {images.map((_, index) => (
          <div 
            key={index}
            className={`h-1 rounded-full transition-all duration-300 ${
              index === currentImageIndex 
                ? 'w-6 bg-white' 
                : 'w-1.5 bg-white/50'
            }`}
          />
        ))}
      </div>
      
      {/* Left/Right image navigation */}
      {images.length > 1 && (
        <>
          <div 
            className="absolute left-0 top-0 bottom-0 w-1/4" 
            onClick={onPrevImage}
            onTouchEnd={(e) => {
              e.stopPropagation();
              onPrevImage(e as unknown as React.MouseEvent);
            }}
          />
          <div 
            className="absolute right-0 top-0 bottom-0 w-1/4" 
            onClick={onNextImage}
            onTouchEnd={(e) => {
              e.stopPropagation();
              onNextImage(e as unknown as React.MouseEvent);
            }}
          />
        </>
      )}
    </>
  );
};

export default ProfileCarousel;
