import React from 'react';
import { Trash2, Move, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DraggablePhotoGridProps {
  photos: string[];
  draggedIndex: number | null;
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
  onDeletePhoto: (index: number) => void;
}

const DraggablePhotoGrid: React.FC<DraggablePhotoGridProps> = ({
  photos,
  draggedIndex,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDeletePhoto
}) => {
  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-4 border border-dashed rounded-md">
        <ImageIcon size={48} className="text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">No photos to edit</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium mb-2">Your Photos ({photos.length})</h4>
      <p className="text-xs text-muted-foreground mb-2">Drag photos to reorder. Your first photo will be your main profile photo.</p>
      <div className="grid grid-cols-3 gap-2">
        {photos.map((url, index) => (
          <div 
            key={index} 
            className={`relative aspect-square rounded-md overflow-hidden bg-muted cursor-move border-2 ${
              draggedIndex === index ? 'border-primary' : 'border-transparent'
            }`}
            draggable
            onDragStart={() => onDragStart(index)}
            onDragOver={(e) => onDragOver(e, index)}
            onDragEnd={onDragEnd}
          >
            <img 
              src={url} 
              alt={`Photo ${index + 1}`} 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-1 left-1 bg-black/50 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {index + 1}
            </div>
            <Button 
              variant="destructive" 
              size="icon" 
              className="absolute top-1 right-1 h-6 w-6"
              onClick={() => onDeletePhoto(index)}
            >
              <Trash2 size={14} />
            </Button>
            <Move className="absolute bottom-1 right-1 h-5 w-5 text-white opacity-75" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DraggablePhotoGrid;
