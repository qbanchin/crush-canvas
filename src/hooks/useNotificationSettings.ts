
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { NotificationSettings, defaultSettings } from '@/types/notification.types';

export const useNotificationSettings = () => {
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

      // Use the database column names which use snake_case
      const { data, error } = await supabase
        .from('notification_settings')
        .select('new_matches, messages, app_updates, email_notifications, push_notifications')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching notification settings:', error);
        toast({
          title: "Error",
          description: "Failed to load notification settings.",
          variant: "destructive"
        });
      }

      if (data) {
        // Map from snake_case database columns to camelCase React state
        setSettings({
          newMatches: data.new_matches,
          messages: data.messages,
          appUpdates: data.app_updates,
          emailNotifications: data.email_notifications,
          pushNotifications: data.push_notifications
        });
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

  const saveSettings = async () => {
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

      // Map from camelCase React state to snake_case database columns
      const dbSettings = {
        new_matches: settings.newMatches,
        messages: settings.messages,
        app_updates: settings.appUpdates,
        email_notifications: settings.emailNotifications,
        push_notifications: settings.pushNotifications,
        user_id: session.user.id
      };

      // First, check if the user already has settings
      const { data: existingSettings } = await supabase
        .from('notification_settings')
        .select('id')
        .eq('user_id', session.user.id)
        .maybeSingle();

      let result;
      
      if (existingSettings) {
        // Update existing settings
        result = await supabase
          .from('notification_settings')
          .update({
            new_matches: settings.newMatches,
            messages: settings.messages,
            app_updates: settings.appUpdates,
            email_notifications: settings.emailNotifications,
            push_notifications: settings.pushNotifications
          })
          .eq('user_id', session.user.id);
      } else {
        // Insert new settings
        result = await supabase
          .from('notification_settings')
          .insert(dbSettings);
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

  return {
    settings,
    loading,
    saving,
    handleToggle,
    saveSettings
  };
};
