
import React, { useState } from 'react';
import HeaderBar from '@/components/HeaderBar';
import NavBar from '@/components/NavBar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import ProfileHeader from '@/components/profile/ProfileHeader';
import BioEditor from '@/components/profile/BioEditor';
import InterestsEditor from '@/components/profile/InterestsEditor';
import ProfileSettings from '@/components/profile/ProfileSettings';
import ActionButtons from '@/components/profile/ActionButtons';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ProfilePage = () => {
  const { toast } = useToast();
  const [user, setUser] = useState({
    name: "Alex Morgan",
    age: 29,
    bio: "Coffee enthusiast, amateur photographer, and hiking lover.",
    location: "San Francisco",
    images: [
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80",
    ],
    interests: ["Coffee", "Photography", "Hiking", "Music", "Travel"]
  });

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [showActivity, setShowActivity] = useState(true);
  const [distanceUnit, setDistanceUnit] = useState("km");
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user.name,
    age: user.age,
    location: user.location
  });

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? user.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === user.images.length - 1 ? 0 : prev + 1));
  };

  const handleBioSave = (newBio: string) => {
    setUser({ ...user, bio: newBio });
  };

  const handleInterestsSave = (newInterests: string[]) => {
    setUser({ ...user, interests: newInterests });
  };

  const handlePhotosAdded = (newPhotos: string[]) => {
    setUser({
      ...user,
      images: [...user.images, ...newPhotos]
    });
  };

  const handleDeleteImage = (index: number) => {
    if (user.images.length <= 1) {
      toast({
        title: "Cannot delete image",
        description: "You must have at least one profile photo.",
        variant: "destructive"
      });
      return;
    }

    const newImages = [...user.images];
    newImages.splice(index, 1);
    
    setUser({
      ...user,
      images: newImages
    });
    
    // Adjust current index if necessary
    if (index >= newImages.length) {
      setCurrentImageIndex(newImages.length - 1);
    }
    
    toast({
      title: "Photo deleted",
      description: "Your profile photo has been deleted."
    });
  };

  const handleEditProfile = () => {
    setEditForm({
      name: user.name,
      age: user.age,
      location: user.location
    });
    setIsEditProfileOpen(true);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: name === 'age' ? parseInt(value) || 0 : value
    });
  };

  const handleSaveProfile = () => {
    // Validate form data
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

    // Update user data
    setUser({
      ...user,
      name: editForm.name,
      age: editForm.age,
      location: editForm.location
    });

    // Close the dialog
    setIsEditProfileOpen(false);

    // Show success toast
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated."
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderBar />
      
      <main className="flex-1 pt-16 pb-20">
        <ScrollArea className="h-[calc(100vh-9rem)]">
          <div className="px-4 py-6">
            <ProfileHeader
              user={user}
              currentImageIndex={currentImageIndex}
              handlePrevImage={handlePrevImage}
              handleNextImage={handleNextImage}
              handleDeleteImage={handleDeleteImage}
              showOnlineStatus={showOnlineStatus}
              setShowOnlineStatus={setShowOnlineStatus}
              showActivity={showActivity}
              setShowActivity={setShowActivity}
              distanceUnit={distanceUnit}
              setDistanceUnit={setDistanceUnit}
            />
            
            <ActionButtons 
              onEditProfile={handleEditProfile}
              userImages={user.images}
              onPhotosAdded={handlePhotosAdded}
            />
            
            <BioEditor 
              bio={user.bio}
              onBioSave={handleBioSave}
            />
            
            <InterestsEditor 
              interests={user.interests}
              onInterestsSave={handleInterestsSave}
            />
            
            <Separator className="my-6" />
            
            <ProfileSettings />
          </div>
        </ScrollArea>
      </main>
      
      <NavBar />

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
    </div>
  );
};

export default ProfilePage;
