import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { 
  Switch
} from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const ExploreSettingsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Sample settings state
  const [distance, setDistance] = useState([25]);
  const [ageRange, setAgeRange] = useState([18, 40]);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [includeNearby, setIncludeNearby] = useState(true);
  
  const handleSaveSettings = () => {
    // In a real app, you'd save these settings to your backend
    toast({
      title: "Settings saved",
      description: "Your explore settings have been updated successfully."
    });
    
    // Navigate back to the profile page
    navigate('/profile');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-md border-b">
        <div className="flex items-center p-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/profile')}
          >
            <ChevronLeft size={24} />
          </Button>
          <h1 className="text-xl font-semibold mx-auto">Explore Settings</h1>
          <div className="w-8"></div> {/* For centering the title */}
        </div>
      </div>
      
      <main className="flex-1 pt-16 pb-4">
        <ScrollArea className="h-[calc(100vh-5rem)]">
          <div className="px-4 py-6 space-y-6">
            {/* Distance Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Maximum Distance</h3>
                <span className="text-sm font-medium">{distance[0]} miles</span>
              </div>
              <Slider
                value={distance}
                onValueChange={setDistance}
                max={100}
                step={1}
              />
            </div>
            
            <Separator />
            
            {/* Age Range Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Age Range</h3>
                <span className="text-sm font-medium">{ageRange[0]} - {ageRange[1]}</span>
              </div>
              <Slider
                value={ageRange}
                onValueChange={setAgeRange}
                max={80}
                min={18}
                step={1}
              />
            </div>
            
            <Separator />
            
            {/* Other Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="font-medium">Show Verified Profiles Only</h4>
                  <p className="text-sm text-muted-foreground">
                    Only see profiles that have been verified
                  </p>
                </div>
                <Switch 
                  checked={showVerifiedOnly} 
                  onCheckedChange={setShowVerifiedOnly} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="font-medium">Include Nearby Cities</h4>
                  <p className="text-sm text-muted-foreground">
                    See profiles from nearby locations
                  </p>
                </div>
                <Switch 
                  checked={includeNearby} 
                  onCheckedChange={setIncludeNearby} 
                />
              </div>
            </div>
            
            <Button 
              className="w-full mt-8" 
              onClick={handleSaveSettings}
            >
              Save Settings
            </Button>
          </div>
        </ScrollArea>
      </main>
    </div>
  );
};

export default ExploreSettingsPage;
