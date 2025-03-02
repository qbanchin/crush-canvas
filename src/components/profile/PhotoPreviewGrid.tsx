
import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PhotoPreviewGridProps {
  previewUrls: string[];
  onRemovePhoto: (index: number) => void;
}

const PhotoPreviewGrid: React.FC<PhotoPreviewGridProps> = ({
  previewUrls,
  onRemovePhoto
}) => {
  if (previewUrls.length === 0) return null;
  
  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium mb-2">Selected Photos ({previewUrls.length})</h4>
      <div className="grid grid-cols-3 gap-2">
        {previewUrls.map((url, index) => (
          <div key={index} className="relative aspect-square rounded-md overflow-hidden bg-muted">
            <img 
              src={url} 
              alt={`Preview ${index}`} 
              className="w-full h-full object-cover"
            />
            <Button 
              variant="destructive" 
              size="icon" 
              className="absolute top-1 right-1 h-6 w-6"
              onClick={() => onRemovePhoto(index)}
            >
              <Trash2 size={14} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoPreviewGrid;
