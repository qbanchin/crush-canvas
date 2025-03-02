
import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PhotoUploadAreaProps {
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  multiple?: boolean;
}

const PhotoUploadArea: React.FC<PhotoUploadAreaProps> = ({ 
  onFileSelect,
  multiple = true 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTriggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        multiple={multiple}
        onChange={onFileSelect}
      />
      
      <Button 
        variant="outline" 
        className="w-full h-20 flex flex-col justify-center items-center gap-2"
        onClick={handleTriggerFileInput}
      >
        <Upload size={24} />
        <span>Select Photos</span>
      </Button>
    </>
  );
};

export default PhotoUploadArea;
