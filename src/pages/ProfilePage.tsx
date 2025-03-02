
import React from 'react';
import HeaderBar from '@/components/HeaderBar';
import NavBar from '@/components/NavBar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Settings, Camera, Edit, MapPin, ChevronRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const ProfilePage = () => {
  // Sample user data
  const user = {
    name: "Alex Morgan",
    age: 29,
    bio: "Coffee enthusiast, amateur photographer, and hiking lover.",
    location: "San Francisco",
    images: [
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80",
    ],
    interests: ["Coffee", "Photography", "Hiking", "Music", "Travel"]
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
                <Button variant="ghost" size="sm" className="h-8 text-xs">
                  <Edit size={14} className="mr-1" />
                  Edit
                </Button>
              </div>
              <p className="text-muted-foreground">{user.bio}</p>
            </div>
            
            {/* Interests section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Interests</h3>
                <Button variant="ghost" size="sm" className="h-8 text-xs">
                  <Edit size={14} className="mr-1" />
                  Edit
                </Button>
              </div>
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
