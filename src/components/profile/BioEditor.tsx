
import React, { useState } from 'react';
import { Edit, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface BioEditorProps {
  bio: string;
  onBioSave: (newBio: string) => void;
}

const BioEditor: React.FC<BioEditorProps> = ({ bio, onBioSave }) => {
  const { toast } = useToast();
  const [editingBio, setEditingBio] = useState(false);
  const [tempBio, setTempBio] = useState(bio);

  const handleBioSave = () => {
    onBioSave(tempBio);
    setEditingBio(false);
    toast({
      title: "Bio updated",
      description: "Your bio has been successfully updated.",
    });
  };

  const handleBioCancel = () => {
    setTempBio(bio);
    setEditingBio(false);
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">About me</h3>
        {!editingBio ? (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 text-xs"
            onClick={() => setEditingBio(true)}
          >
            <Edit size={14} className="mr-1" />
            Edit
          </Button>
        ) : (
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs text-green-500"
              onClick={handleBioSave}
            >
              <Check size={14} className="mr-1" />
              Save
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs text-red-500"
              onClick={handleBioCancel}
            >
              <X size={14} className="mr-1" />
              Cancel
            </Button>
          </div>
        )}
      </div>
      {!editingBio ? (
        <p className="text-muted-foreground">{bio}</p>
      ) : (
        <Textarea 
          value={tempBio}
          onChange={(e) => setTempBio(e.target.value)}
          placeholder="Tell us about yourself..."
          className="min-h-[100px]"
        />
      )}
    </div>
  );
};

export default BioEditor;
