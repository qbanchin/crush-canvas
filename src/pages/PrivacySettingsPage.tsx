
import React, { useState } from 'react';
import HeaderBar from '@/components/HeaderBar';
import NavBar from '@/components/NavBar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const PrivacySettingsPage: React.FC = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    showOnlineStatus: true,
    showLastActive: true,
    allowTags: false,
    profileVisibility: 'everyone',
    messagePermission: 'matches'
  });

  const handleToggle = (setting: string) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };

  const handleSelectChange = (setting: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your privacy settings have been updated."
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderBar />
      
      <main className="flex-1 pt-16 pb-20">
        <ScrollArea className="h-[calc(100vh-9rem)]">
          <div className="px-4 py-6">
            <h1 className="text-2xl font-bold mb-4">Privacy Settings</h1>
            
            <Separator className="my-4" />
            
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-4">Activity Status</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Show Online Status</p>
                      <p className="text-sm text-muted-foreground">Allow others to see when you're online</p>
                    </div>
                    <Switch 
                      checked={settings.showOnlineStatus} 
                      onCheckedChange={() => handleToggle('showOnlineStatus')} 
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Show Last Active</p>
                      <p className="text-sm text-muted-foreground">Allow others to see when you were last active</p>
                    </div>
                    <Switch 
                      checked={settings.showLastActive} 
                      onCheckedChange={() => handleToggle('showLastActive')} 
                    />
                  </div>
                </div>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-4">Profile Privacy</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Profile Visibility</p>
                      <p className="text-sm text-muted-foreground">Control who can see your profile</p>
                    </div>
                    <Select 
                      value={settings.profileVisibility}
                      onValueChange={(value) => handleSelectChange('profileVisibility', value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="everyone">Everyone</SelectItem>
                        <SelectItem value="matches">Matches Only</SelectItem>
                        <SelectItem value="none">No One</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Message Permissions</p>
                      <p className="text-sm text-muted-foreground">Control who can send you messages</p>
                    </div>
                    <Select 
                      value={settings.messagePermission}
                      onValueChange={(value) => handleSelectChange('messagePermission', value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="everyone">Everyone</SelectItem>
                        <SelectItem value="matches">Matches Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Allow Tagging</p>
                      <p className="text-sm text-muted-foreground">Allow others to tag you in posts and photos</p>
                    </div>
                    <Switch 
                      checked={settings.allowTags} 
                      onCheckedChange={() => handleToggle('allowTags')} 
                    />
                  </div>
                </div>
              </section>
              
              <div className="flex justify-end">
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </main>
      
      <NavBar />
    </div>
  );
};

export default PrivacySettingsPage;
