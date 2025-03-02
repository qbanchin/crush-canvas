import React, { useState, useRef } from 'react';
import HeaderBar from '@/components/HeaderBar';
import NavBar from '@/components/NavBar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Camera, Edit, MapPin, ChevronRight, Check, X, Upload, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import ProfileCarousel from '@/components/ProfileCarousel';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Switch
} from "@/components/ui/switch";

const ProfilePage = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Sample user data
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

  // Photo management
  const [isAddingPhotos, setIsAddingPhotos] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Settings state
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [showActivity, setShowActivity] = useState(true);
  const [distanceUnit, setDistanceUnit] = useState("km");

  // State for editing
  const [editingBio, setEditingBio] = useState(false);
  const [editingInterests, setEditingInterests] = useState(false);
  const [tempBio, setTempBio] = useState(user.bio);
  const [newInterest, setNewInterest] = useState("");
  const [tempInterests, setTempInterests] = useState([...user.interests]);

  // Photo management handlers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles([...selectedFiles, ...newFiles]);
      
      // Create preview URLs
      const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls([...previewUrls, ...newPreviewUrls]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    // Release the URL object to avoid memory leaks
    URL.revokeObjectURL(previewUrls[index]);
    
    const newPreviewUrls = [...previewUrls];
    newPreviewUrls.splice(index, 1);
    setPreviewUrls(newPreviewUrls);
    
    const newSelectedFiles = [...selectedFiles];
    newSelectedFiles.splice(index, 1);
    setSelectedFiles(newSelectedFiles);
  };

  const handleSavePhotos = () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No photos selected",
        description: "Please select at least one photo to add.",
        variant: "destructive"
      });
      return;
    }

    // In a real app, you'd upload these files to a server
    // For now, we'll just add the preview URLs to the user's images
    setUser({
      ...user,
      images: [...user.images, ...previewUrls]
    });

    // Clean up state
    setSelectedFiles([]);
    setPreviewUrls([]);
    setIsAddingPhotos(false);

    toast({
      title: "Photos added",
      description: `${selectedFiles.length} photo(s) added to your profile.`
    });
  };

  const handleTriggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Next/Previous image handlers
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? user.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === user.images.length - 1 ? 0 : prev + 1));
  };

  // Bio handlers
  const handleBioSave = () => {
    setUser({ ...user, bio: tempBio });
    setEditingBio(false);
    toast({
      title: "Bio updated",
      description: "Your bio has been successfully updated.",
    });
  };

  const handleBioCancel = () => {
    setTempBio(user.bio);
    setEditingBio(false);
  };

  // Interests handlers
  const handleInterestsSave = () => {
    setUser({ ...user, interests: tempInterests });
    setEditingInterests(false);
    setNewInterest("");
    toast({
      title: "Interests updated",
      description: "Your interests have been successfully updated.",
    });
  };

  const handleInterestsCancel = () => {
    setTempInterests([...user.interests]);
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

  const handleSettingsUpdate = () => {
    toast({
      title: "Settings updated",
      description: "Your settings have been successfully updated."
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderBar />
      
      <main className="flex-1 pt-16 pb-20">
        <ScrollArea className="h-[calc(100vh-9rem)]">
          <div className="px-4 py-6">
            <div className="flex items-end relative mb-6">
              {/* Profile image with carousel */}
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-background relative">
                <div 
                  className="w-full h-full bg-cover bg-center" 
                  style={{ backgroundImage: `url(${user.images[currentImageIndex]})` }}
                />
                {user.images.length > 1 && (
                  <div className="absolute inset-0">
                    <ProfileCarousel 
                      images={user.images}
                      currentImageIndex={currentImageIndex}
                      onPrevImage={handlePrevImage}
                      onNextImage={handleNextImage}
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
              
              {/* Settings button with dialog */}
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
            
            {/* Profile controls */}
            <div className="flex gap-3 mb-8">
              <Button className="flex-1 gap-2">
                <Edit size={16} />
                Edit Profile
              </Button>
              
              {/* Add Photos button with dialog */}
              <Dialog open={isAddingPhotos} onOpenChange={setIsAddingPhotos}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1 gap-2">
                    <Camera size={16} />
                    Add Photos
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Photos</DialogTitle>
                    <DialogDescription>
                      Add new photos to your profile. Choose high-quality images to make a great impression.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    {/* Hidden file input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleFileSelect}
                    />
                    
                    {/* File upload button */}
                    <Button 
                      variant="outline" 
                      className="w-full h-20 flex flex-col justify-center items-center gap-2"
                      onClick={handleTriggerFileInput}
                    >
                      <Upload size={24} />
                      <span>Select Photos</span>
                    </Button>
                    
                    {/* Preview area */}
                    {previewUrls.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Selected Photos ({previewUrls.length})</h4>
                        <div className="grid grid-cols-3 gap-2">
                          {previewUrls.map((url, index) => (
                            <div key={index} className="relative aspect-square rounded-md overflow-hidden bg-muted">
                              <img 
                                src={url} 
                                alt={`Preview ${index}`} 
                                className="w-full h-full object-cover"
                              />
                              <Button 
                                variant="destructive" 
                                size="icon" 
                                className="absolute top-1 right-1 h-6 w-6"
                                onClick={() => handleRemovePhoto(index)}
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddingPhotos(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSavePhotos}>
                      Add to Profile
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            {/* Bio section */}
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
                <p className="text-muted-foreground">{user.bio}</p>
              ) : (
                <Textarea 
                  value={tempBio}
                  onChange={(e) => setTempBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  className="min-h-[100px]"
                />
              )}
            </div>
            
            {/* Interests section */}
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
                  {user.interests.map(interest => (
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
            
            <Separator className="my-6" />
            
            {/* Settings links */}
            <div className="space-y-4">
              <SettingsLink title="Explore Settings" to="/settings/explore" />
              <SettingsLink title="Notification Settings" />
              <SettingsLink title="Privacy Settings" />
              <SettingsLink title="Help & Support" />
            </div>
          </div>
        </ScrollArea>
      </main>
      
      <NavBar />
    </div>
  );
};

interface SettingsLinkProps {
  title: string;
  to?: string;
}

const SettingsLink: React.FC<SettingsLinkProps> = ({ title, to }) => {
  const handleClick = () => {
    if (to) {
      window.location.href = to;
    }
  };

  return (
    <div 
      className="flex justify-between items-center p-3 rounded-lg hover:bg-muted/30 cursor-pointer transition-colors"
      onClick={handleClick}
    >
      <span>{title}</span>
      <ChevronRight size={18} className="text-muted-foreground" />
    </div>
  );
};

export default ProfilePage;
