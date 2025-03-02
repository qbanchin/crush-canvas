
import React, { useState, useEffect } from 'react';
import HeaderBar from '@/components/HeaderBar';
import NavBar from '@/components/NavBar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface NotificationSettings {
  newMatches: boolean;
  messages: boolean;
  appUpdates: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

const defaultSettings: NotificationSettings = {
  newMatches: true,
  messages: true,
  appUpdates: false,
  emailNotifications: true,
  pushNotifications: true
};

const NotificationsSettingsPage: React.FC = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchNotificationSettings();
  }, []);

  const fetchNotificationSettings = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        console.log('No authenticated user found');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 means no rows returned, which is expected for new users
        console.error('Error fetching notification settings:', error);
        toast({
          title: "Error",
          description: "Failed to load notification settings.",
          variant: "destructive"
        });
      }

      if (data) {
        // Remove user_id from the data before setting state
        const { user_id, id, created_at, ...settingsData } = data;
        setSettings(settingsData as NotificationSettings);
      }
    } catch (error) {
      console.error('Error fetching notification settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (setting: keyof NotificationSettings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to save settings.",
          variant: "destructive"
        });
        setSaving(false);
        return;
      }

      // First, check if the user already has settings
      const { data: existingSettings } = await supabase
        .from('notification_settings')
        .select('id')
        .eq('user_id', session.user.id)
        .single();

      let result;
      
      if (existingSettings) {
        // Update existing settings
        result = await supabase
          .from('notification_settings')
          .update(settings)
          .eq('user_id', session.user.id);
      } else {
        // Insert new settings
        result = await supabase
          .from('notification_settings')
          .insert({
            user_id: session.user.id,
            ...settings
          });
      }

      if (result.error) {
        throw result.error;
      }

      toast({
        title: "Settings saved",
        description: "Your notification preferences have been updated."
      });
    } catch (error) {
      console.error('Error saving notification settings:', error);
      toast({
        title: "Error",
        description: "Failed to save notification settings.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <HeaderBar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2">Loading settings...</span>
        </div>
        <NavBar />
      </div>
    );
  }

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
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
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
