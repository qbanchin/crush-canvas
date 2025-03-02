
import React, { useState } from 'react';
import HeaderBar from '@/components/HeaderBar';
import NavBar from '@/components/NavBar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Settings, Camera, Edit, MapPin, ChevronRight, Check, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const ProfilePage = () => {
  const { toast } = useToast();
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

  // State for editing
  const [editingBio, setEditingBio] = useState(false);
  const [editingInterests, setEditingInterests] = useState(false);
  const [tempBio, setTempBio] = useState(user.bio);
  const [newInterest, setNewInterest] = useState("");
  const [tempInterests, setTempInterests] = useState([...user.interests]);

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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderBar />
      
      <main className="flex-1 pt-16 pb-20">
        <ScrollArea className="h-[calc(100vh-9rem)]">
          <div className="px-4 py-6">
            <div className="flex items-end relative mb-6">
              {/* Profile image */}
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-background">
                <div 
                  className="w-full h-full bg-cover bg-center" 
                  style={{ backgroundImage: `url(${user.images[0]})` }}
                />
              </div>
              
              <div className="ml-4 flex-1">
                <h1 className="text-2xl font-bold">{user.name}, {user.age}</h1>
                <div className="flex items-center text-muted-foreground">
                  <MapPin size={16} className="mr-1" />
                  <span>{user.location}</span>
                </div>
              </div>
              
              <Button variant="outline" size="icon" className="absolute top-0 right-0">
                <Settings size={18} />
              </Button>
            </div>
            
            {/* Profile controls */}
            <div className="flex gap-3 mb-8">
              <Button className="flex-1 gap-2">
                <Edit size={16} />
                Edit Profile
              </Button>
              <Button variant="outline" className="flex-1 gap-2">
                <Camera size={16} />
                Add Photos
              </Button>
            </div>
            
            {/* Upgrade banner */}
            <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-tinder-red to-tinder-blue text-white">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="h-5 w-5" />
                <h3 className="font-semibold">Get Tinder Gold</h3>
              </div>
              <p className="text-sm mb-3">See who likes you & more!</p>
              <Button variant="secondary" className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm">
                Upgrade
              </Button>
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
              <SettingsLink title="Discovery Settings" />
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
}

const SettingsLink: React.FC<SettingsLinkProps> = ({ title }) => {
  return (
    <div className="flex justify-between items-center p-3 rounded-lg hover:bg-muted/30 cursor-pointer transition-colors">
      <span>{title}</span>
      <ChevronRight size={18} className="text-muted-foreground" />
    </div>
  );
};

export default ProfilePage;
