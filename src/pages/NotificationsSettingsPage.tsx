
import React, { useState } from 'react';
import HeaderBar from '@/components/HeaderBar';
import NavBar from '@/components/NavBar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const NotificationsSettingsPage: React.FC = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    newMatches: true,
    messages: true,
    appUpdates: false,
    emailNotifications: true,
    pushNotifications: true
  });

  const handleToggle = (setting: string) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your notification preferences have been updated."
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderBar />
      
      <main className="flex-1 pt-16 pb-20">
        <ScrollArea className="h-[calc(100vh-9rem)]">
          <div className="px-4 py-6">
            <h1 className="text-2xl font-bold mb-4">Notification Settings</h1>
            
            <Separator className="my-4" />
            
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-4">Notifications</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">New Matches</p>
                      <p className="text-sm text-muted-foreground">Get notified when you match with someone</p>
                    </div>
                    <Switch 
                      checked={settings.newMatches} 
                      onCheckedChange={() => handleToggle('newMatches')} 
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Messages</p>
                      <p className="text-sm text-muted-foreground">Get notified when you receive a message</p>
                    </div>
                    <Switch 
                      checked={settings.messages} 
                      onCheckedChange={() => handleToggle('messages')} 
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">App Updates</p>
                      <p className="text-sm text-muted-foreground">Get notified about new features and updates</p>
                    </div>
                    <Switch 
                      checked={settings.appUpdates} 
                      onCheckedChange={() => handleToggle('appUpdates')} 
                    />
                  </div>
                </div>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-4">Notification Methods</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch 
                      checked={settings.emailNotifications} 
                      onCheckedChange={() => handleToggle('emailNotifications')} 
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                    </div>
                    <Switch 
                      checked={settings.pushNotifications} 
                      onCheckedChange={() => handleToggle('pushNotifications')} 
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

export default NotificationsSettingsPage;
