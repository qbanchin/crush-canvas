
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useProfileContext } from '@/contexts/ProfileContext';

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

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: name === 'age' ? parseInt(value) || 0 : value
    });
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
      
      // Extract distance value from location if it contains "km away" format
      let distance = null;
      if (editForm.location.includes('km away')) {
        const distanceMatch = editForm.location.match(/(\d+)\s*km away/);
        if (distanceMatch && distanceMatch[1]) {
          distance = parseInt(distanceMatch[1]);
        }
      }
      
      // Update the user's profile in the cards table
      const { error } = await supabase
        .from('cards')
        .update({ 
          name: editForm.name,
          age: editForm.age,
          distance: distance // Save the distance value
        })
        .eq('id', authUser.id);
      
      if (error) throw error;

      setUser({
        ...user,
        name: editForm.name,
        age: editForm.age,
        location: editForm.location
      });

      setIsEditProfileOpen(false);

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated."
      });
    } catch (error: any) {
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
            <Input 
              id="location" 
              name="location"
              value={editForm.location} 
              onChange={handleEditFormChange}
            />
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
