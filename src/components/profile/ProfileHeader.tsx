
import React from 'react';
import { MapPin, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProfileCarousel from '@/components/ProfileCarousel';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface ProfileHeaderProps {
  user: {
    name: string;
    age: number;
    location: string;
    images: string[];
  };
  currentImageIndex: number;
  handlePrevImage: (e: React.MouseEvent) => void;
  handleNextImage: (e: React.MouseEvent) => void;
  handleDeleteImage?: (index: number) => void;
  showOnlineStatus: boolean;
  setShowOnlineStatus: React.Dispatch<React.SetStateAction<boolean>>;
  showActivity: boolean;
  setShowActivity: React.Dispatch<React.SetStateAction<boolean>>;
  distanceUnit: string;
  setDistanceUnit: React.Dispatch<React.SetStateAction<string>>;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  currentImageIndex,
  handlePrevImage,
  handleNextImage,
  handleDeleteImage,
  showOnlineStatus,
  setShowOnlineStatus,
  showActivity,
  setShowActivity,
  distanceUnit,
  setDistanceUnit
}) => {
  const { toast } = useToast();

  const handleSettingsUpdate = () => {
    toast({
      title: "Settings updated",
      description: "Your settings have been successfully updated."
    });
  };

  // Add validation and debugging for images
  console.log("ProfileHeader - User images:", user.images?.length, "Current index:", currentImageIndex);
  
  // Make sure the current image index is valid
  const validIndex = Math.min(Math.max(0, currentImageIndex), (user.images?.length || 1) - 1);
  const currentImage = user.images && user.images.length > 0 ? user.images[validIndex] : '/placeholder.svg';

  return (
    <div className="flex items-end relative mb-6">
      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-background relative">
        <div 
          className="w-full h-full bg-cover bg-center" 
          style={{ backgroundImage: `url(${currentImage})` }}
        />
        {user.images && user.images.length > 0 && (
          <div className="absolute inset-0">
            <ProfileCarousel 
              images={user.images}
              currentImageIndex={validIndex}
              onPrevImage={handlePrevImage}
              onNextImage={handleNextImage}
              onDeleteImage={handleDeleteImage}
              allowDelete={true}
            />
          </div>
        )}
      </div>
      
      <div className="ml-4 flex-1">
        <h1 className="text-2xl font-bold">{user.name}, {user.age}</h1>
        <div className="flex items-center text-muted-foreground">
          <MapPin size={16} className="mr-1" />
          <span>{user.location}</span>
        </div>
      </div>
      
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" className="absolute top-0 right-0">
            <Settings size={18} />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Profile Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="font-medium">Show Online Status</h4>
                <p className="text-sm text-muted-foreground">
                  Let others see when you're active
                </p>
              </div>
              <Switch 
                checked={showOnlineStatus} 
                onCheckedChange={setShowOnlineStatus} 
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="font-medium">Show Activity Status</h4>
                <p className="text-sm text-muted-foreground">
                  Show your activity on your profile
                </p>
              </div>
              <Switch 
                checked={showActivity} 
                onCheckedChange={setShowActivity} 
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium">Distance Unit</h4>
              <div className="flex gap-2">
                <Button 
                  variant={distanceUnit === "km" ? "default" : "outline"} 
                  onClick={() => setDistanceUnit("km")}
                  size="sm"
                >
                  Kilometers
                </Button>
                <Button 
                  variant={distanceUnit === "mi" ? "default" : "outline"} 
                  onClick={() => setDistanceUnit("mi")}
                  size="sm"
                >
                  Miles
                </Button>
              </div>
            </div>
            <Button 
              className="w-full mt-4" 
              onClick={handleSettingsUpdate}
            >
              Save Settings
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileHeader;
