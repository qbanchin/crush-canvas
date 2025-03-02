
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from "@/components/ui/skeleton";

const ProfilePage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({
    name: "",
    age: 0,
    bio: "",
    location: "Unknown location",
    images: [
      "/placeholder.svg",
    ],
    interests: []
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

  // Fetch the user's profile data when the component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      
      try {
        // Get the current authenticated user
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (!authUser) {
          // If no authenticated user, redirect to auth page
          navigate('/auth');
          return;
        }
        
        // Fetch the user's profile from the cards table
        const { data, error } = await supabase
          .from('cards')
          .select('*')
          .eq('id', authUser.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
          toast({
            title: "Error loading profile",
            description: error.message,
            variant: "destructive"
          });
          return;
        }
        
        if (data) {
          // Get user metadata for additional info
          const fullName = authUser.user_metadata?.full_name || data.name;
          
          setUser({
            name: fullName,
            age: data.age || 0,
            bio: data.bio || "",
            location: "Your location", // Default location if not set
            images: data.images || ["/placeholder.svg"],
            interests: data.tags || []
          });
          
          setEditForm({
            name: fullName,
            age: data.age || 0,
            location: "Your location"
          });
        }
      } catch (error: any) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [navigate, toast]);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? user.images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === user.images.length - 1 ? 0 : prev + 1));
  };

  const handleBioSave = async (newBio: string) => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        toast({
          title: "Error",
          description: "You must be logged in to update your profile",
          variant: "destructive"
        });
        return;
      }
      
      const { error } = await supabase
        .from('cards')
        .update({ bio: newBio })
        .eq('id', authUser.id);
      
      if (error) throw error;
      
      setUser({ ...user, bio: newBio });
      
      toast({
        title: "Bio updated",
        description: "Your bio has been successfully updated."
      });
    } catch (error: any) {
      toast({
        title: "Error updating bio",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleInterestsSave = async (newInterests: string[]) => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        toast({
          title: "Error",
          description: "You must be logged in to update your profile",
          variant: "destructive"
        });
        return;
      }
      
      const { error } = await supabase
        .from('cards')
        .update({ tags: newInterests })
        .eq('id', authUser.id);
      
      if (error) throw error;
      
      setUser({ ...user, interests: newInterests });
      
      toast({
        title: "Interests updated",
        description: "Your interests have been successfully updated."
      });
    } catch (error: any) {
      toast({
        title: "Error updating interests",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handlePhotosAdded = async (newPhotos: string[]) => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        toast({
          title: "Error",
          description: "You must be logged in to update your profile",
          variant: "destructive"
        });
        return;
      }
      
      const updatedImages = [...user.images, ...newPhotos];
      
      const { error } = await supabase
        .from('cards')
        .update({ images: updatedImages })
        .eq('id', authUser.id);
      
      if (error) throw error;
      
      setUser({
        ...user,
        images: updatedImages
      });
      
      toast({
        title: "Photos added",
        description: `${newPhotos.length} photo(s) added to your profile.`
      });
    } catch (error: any) {
      toast({
        title: "Error adding photos",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handlePhotosReordered = async (reorderedPhotos: string[]) => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        toast({
          title: "Error",
          description: "You must be logged in to update your profile",
          variant: "destructive"
        });
        return;
      }
      
      const { error } = await supabase
        .from('cards')
        .update({ images: reorderedPhotos })
        .eq('id', authUser.id);
      
      if (error) throw error;
      
      setUser({
        ...user,
        images: reorderedPhotos
      });
      
      setCurrentImageIndex(0);
      
      toast({
        title: "Photos reordered",
        description: "Your profile photos have been reordered successfully."
      });
    } catch (error: any) {
      toast({
        title: "Error reordering photos",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteImage = async (index: number) => {
    try {
      if (user.images.length <= 1) {
        toast({
          title: "Cannot delete image",
          description: "You must have at least one profile photo.",
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
      
      const newImages = [...user.images];
      newImages.splice(index, 1);
      
      const { error } = await supabase
        .from('cards')
        .update({ images: newImages })
        .eq('id', authUser.id);
      
      if (error) throw error;
      
      setUser({
        ...user,
        images: newImages
      });
      
      if (index >= newImages.length) {
        setCurrentImageIndex(newImages.length - 1);
      }
      
      toast({
        title: "Photo deleted",
        description: "Your profile photo has been deleted."
      });
    } catch (error: any) {
      toast({
        title: "Error deleting photo",
        description: error.message,
        variant: "destructive"
      });
    }
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
      
      // Update the user's profile in the cards table
      const { error } = await supabase
        .from('cards')
        .update({ 
          name: editForm.name,
          age: editForm.age
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
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderBar />
      
      <main className="flex-1 pt-16 pb-20">
        <ScrollArea className="h-[calc(100vh-9rem)]">
          <div className="px-4 py-6">
            {loading ? (
              <div className="space-y-4">
                <div className="flex items-end relative mb-6">
                  <Skeleton className="w-24 h-24 rounded-full" />
                  <div className="ml-4 flex-1">
                    <Skeleton className="h-8 w-[200px] mb-2" />
                    <Skeleton className="h-4 w-[120px]" />
                  </div>
                </div>
                <Skeleton className="h-10 w-full mb-4" />
                <Skeleton className="h-24 w-full mb-4" />
                <Skeleton className="h-16 w-full mb-4" />
              </div>
            ) : (
              <>
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
                  onPhotosReordered={handlePhotosReordered}
                  onPhotoDeleted={handleDeleteImage}
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
              </>
            )}
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
