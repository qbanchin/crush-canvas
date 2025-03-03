
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useProfileContext } from '@/contexts/ProfileContext';
import { MapPin, Loader2 } from 'lucide-react';

const EditProfileDialog: React.FC = () => {
  const { toast } = useToast();
  const {
    user,
    setUser,
    isEditProfileOpen,
    setIsEditProfileOpen,
    editForm,
    setEditForm
  } = useProfileContext();
  
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: name === 'age' ? parseInt(value) || 0 : value
    });
  };
  
  const detectUserLocation = () => {
    setIsGettingLocation(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Location unavailable",
        description: "Your browser doesn't support geolocation",
        variant: "destructive"
      });
      setIsGettingLocation(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Successfully got location
        console.log('Location detected:', position.coords.latitude, position.coords.longitude);
        toast({
          title: "Location detected",
          description: "Using your current location"
        });
        
        // Get location coordinates for display or future use
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        // Store coordinates as metadata in localStorage for potential future use
        localStorage.setItem('userLocationCoords', JSON.stringify({ lat, lng }));
        
        // Set as "Your location" in the form
        setEditForm({
          ...editForm,
          location: "Your location"
        });
        setIsGettingLocation(false);
      },
      (error) => {
        // Failed to get location
        console.error('Geolocation error:', error);
        let errorMessage = "Couldn't detect your location";
        
        if (error.code === 1) {
          errorMessage = "Location access denied. Please enable location permissions.";
        } else if (error.code === 2) {
          errorMessage = "Location unavailable at this time.";
        } else if (error.code === 3) {
          errorMessage = "Location request timed out.";
        }
        
        toast({
          title: "Location error",
          description: errorMessage,
          variant: "destructive"
        });
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  const handleSaveProfile = async () => {
    try {
      if (!editForm.name.trim()) {
        toast({
          title: "Invalid name",
          description: "Name cannot be empty",
          variant: "destructive"
        });
        return;
      }

      if (editForm.age < 18 || editForm.age > 120) {
        toast({
          title: "Invalid age",
          description: "Age must be between 18 and 120",
          variant: "destructive"
        });
        return;
      }

      if (!editForm.location.trim()) {
        toast({
          title: "Invalid location",
          description: "Location cannot be empty",
          variant: "destructive"
        });
        return;
      }
      
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        toast({
          title: "Error",
          description: "You must be logged in to update your profile",
          variant: "destructive"
        });
        return;
      }
      
      // Extract distance value from location input
      let distance = null;
      let locationValue = editForm.location.trim();
      
      // Check for "Your location" (case insensitive)
      if (locationValue.toLowerCase() === "your location") {
        console.log('Setting distance to null for "Your location"');
        distance = null;
      } 
      // Check for "X km away" format
      else if (locationValue.includes('km away')) {
        const distanceMatch = locationValue.match(/(\d+)\s*km away/);
        if (distanceMatch && distanceMatch[1]) {
          distance = parseInt(distanceMatch[1]);
          console.log('Extracted distance from "km away" format:', distance);
        }
      } 
      // Try to parse as a number directly
      else {
        const possibleDistance = parseInt(locationValue);
        if (!isNaN(possibleDistance)) {
          distance = possibleDistance;
          console.log('Parsed numeric distance:', distance);
        } else {
          // If not a number and not "Your location", use as location name with null distance
          console.log('Using location as text with null distance:', locationValue);
          distance = null;
        }
      }
      
      console.log('Saving profile with location:', locationValue, 'distance value:', distance);
      
      // Update the user's profile in the cards table
      const { error } = await supabase
        .from('cards')
        .update({ 
          name: editForm.name,
          age: editForm.age,
          distance: distance // Save the distance value
        })
        .eq('id', authUser.id);
      
      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      console.log('Profile updated successfully in database');

      // Format the location for display
      const displayLocation = distance !== null 
        ? `${distance} km away` 
        : locationValue; // Use the original location text
      
      // Update local user state
      setUser({
        ...user,
        name: editForm.name,
        age: editForm.age,
        location: displayLocation
      });

      setIsEditProfileOpen(false);

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated."
      });
    } catch (error: any) {
      console.error('Error in handleSaveProfile:', error);
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              name="name"
              value={editForm.name} 
              onChange={handleEditFormChange}
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="age">Age</Label>
            <Input 
              id="age" 
              name="age"
              type="number" 
              value={editForm.age} 
              onChange={handleEditFormChange}
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="location">Location</Label>
            <div className="flex gap-2">
              <Input 
                id="location" 
                name="location"
                value={editForm.location} 
                onChange={handleEditFormChange}
                placeholder="Enter distance (e.g. 10) or 'Your location'"
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={detectUserLocation}
                disabled={isGettingLocation}
                title="Use my current location"
                className="px-3"
              >
                {isGettingLocation ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MapPin className="h-4 w-4" />
                )}
              </Button>
            </div>
            <span className="text-xs text-muted-foreground mt-1">
              Enter a number for distance in km, type "Your location", or use the location button
            </span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsEditProfileOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveProfile}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
