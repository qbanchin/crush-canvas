
import React, { useState } from 'react';
import { Edit, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface InterestsEditorProps {
  interests: string[];
  onInterestsSave: (newInterests: string[]) => void;
}

const InterestsEditor: React.FC<InterestsEditorProps> = ({ 
  interests, 
  onInterestsSave 
}) => {
  const { toast } = useToast();
  const [editingInterests, setEditingInterests] = useState(false);
  const [newInterest, setNewInterest] = useState("");
  const [tempInterests, setTempInterests] = useState([...interests]);

  const handleInterestsSave = () => {
    onInterestsSave(tempInterests);
    setEditingInterests(false);
    setNewInterest("");
    toast({
      title: "Interests updated",
      description: "Your interests have been successfully updated.",
    });
  };

  const handleInterestsCancel = () => {
    setTempInterests([...interests]);
    setEditingInterests(false);
    setNewInterest("");
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !tempInterests.includes(newInterest.trim())) {
      setTempInterests([...tempInterests, newInterest.trim()]);
      setNewInterest("");
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setTempInterests(tempInterests.filter(i => i !== interest));
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">Interests</h3>
        {!editingInterests ? (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 text-xs"
            onClick={() => setEditingInterests(true)}
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
              onClick={handleInterestsSave}
            >
              <Check size={14} className="mr-1" />
              Save
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs text-red-500"
              onClick={handleInterestsCancel}
            >
              <X size={14} className="mr-1" />
              Cancel
            </Button>
          </div>
        )}
      </div>
      
      {!editingInterests ? (
        <div className="flex flex-wrap gap-2">
          {interests.map(interest => (
            <Badge 
              key={interest} 
              variant="outline"
              className="bg-muted/50 hover:bg-muted"
            >
              {interest}
            </Badge>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {tempInterests.map(interest => (
              <Badge 
                key={interest} 
                variant="outline"
                className="bg-muted/50 hover:bg-muted group"
              >
                {interest}
                <button 
                  className="ml-1 text-muted-foreground hover:text-red-500" 
                  onClick={() => handleRemoveInterest(interest)}
                >
                  <X size={12} />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              placeholder="Add a new interest"
              className="flex-1"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddInterest();
                }
              }}
            />
            <Button 
              onClick={handleAddInterest}
              size="sm"
              className="px-3"
            >
              Add
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterestsEditor;
