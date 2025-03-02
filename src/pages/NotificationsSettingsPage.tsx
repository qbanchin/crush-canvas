
import React from 'react';
import HeaderBar from '@/components/HeaderBar';
import NavBar from '@/components/NavBar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import NotificationsList from '@/components/notifications/NotificationsList';
import { useNotificationSettings } from '@/hooks/useNotificationSettings';

const NotificationsSettingsPage: React.FC = () => {
  const { settings, loading, saving, handleToggle, saveSettings } = useNotificationSettings();

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
            
            <NotificationsList 
              settings={settings}
              onToggle={handleToggle}
            />
            
            <div className="flex justify-end mt-6">
              <Button onClick={saveSettings} disabled={saving}>
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
        </ScrollArea>
      </main>
      
      <NavBar />
    </div>
  );
};

export default NotificationsSettingsPage;
