
import React from 'react';
import { Trash2, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfileCarouselProps {
  images: string[];
  currentImageIndex: number;
  onPrevImage: (e: React.MouseEvent) => void;
  onNextImage: (e: React.MouseEvent) => void;
  onDeleteImage?: (index: number) => void;
  allowDelete?: boolean;
}

const ProfileCarousel: React.FC<ProfileCarouselProps> = ({
  images,
  currentImageIndex,
  onPrevImage,
  onNextImage,
  onDeleteImage,
  allowDelete = false,
}) => {
  // Add validation and logging to debug the images array
  if (!images || !Array.isArray(images)) {
    console.error("Invalid images prop:", images);
    return null;
  }
  
  console.log("ProfileCarousel - Images array:", images.length, "Current index:", currentImageIndex);
  
  // Make sure currentImageIndex is valid
  const safeIndex = Math.min(Math.max(0, currentImageIndex), images.length - 1);
  
  return (
    <>
      {/* Image navigation dots */}
      <div className="absolute top-4 left-0 right-0 flex justify-center gap-1.5">
        {images.map((_, index) => (
          <div 
            key={index}
            className={`h-1 rounded-full transition-all duration-300 ${
              index === safeIndex 
                ? 'w-6 bg-white' 
                : 'w-1.5 bg-white/50'
            }`}
          />
        ))}
      </div>
      
      {/* Delete button */}
      {allowDelete && onDeleteImage && images.length > 1 && (
        <Button
          variant="destructive"
          size="icon"
          className="absolute top-4 right-4 h-8 w-8 opacity-70 hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            if (onDeleteImage) onDeleteImage(safeIndex);
          }}
        >
          <Trash2 size={16} />
        </Button>
      )}
      
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
          >
            <div className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 p-1 rounded-full">
              <ArrowLeft size={20} className="text-white" />
            </div>
          </div>
          <div 
            className="absolute right-0 top-0 bottom-0 w-1/4" 
            onClick={onNextImage}
            onTouchEnd={(e) => {
              e.stopPropagation();
              onNextImage(e as unknown as React.MouseEvent);
            }}
          >
            <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 p-1 rounded-full">
              <ArrowRight size={20} className="text-white" />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProfileCarousel;
