
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface NotificationBadges {
  connections: boolean;
  messages: boolean;
  profile: boolean;
}

export function useNotificationBadges() {
  const [badges, setBadges] = useState<NotificationBadges>({
    connections: false,
    messages: false,
    profile: false,
  });

  useEffect(() => {
    // Set up event listener for manually clearing badges
    const handleClearNotifications = (event: Event) => {
      // Check if specific data is provided with the event
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.badge) {
        // Clear only a specific badge
        setBadges(prev => ({
          ...prev,
          [customEvent.detail.badge]: false
        }));
      } else {
        // Clear all badges if no specific badge specified
        setBadges({
          connections: false,
          messages: false,
          profile: false
        });
      }
    };

    window.addEventListener('clear-notifications', handleClearNotifications);

    // Set up subscription for new connections and messages
    const setupNotificationSubscription = async () => {
      try {
        const { data: user } = await supabase.auth.getUser();
        const userId = user?.user?.id || "temp-user-id";
        
        const channel = supabase
          .channel('notification-badges')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'connections'
            },
            (payload) => {
              if (payload.new && (payload.new.user_id === userId || payload.new.connected_user_id === userId)) {
                console.log("New connection detected");
                setBadges(prev => ({ ...prev, connections: true }));
              }
            }
          )
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'messages'
            },
            (payload) => {
              if (payload.new && payload.new.recipient_id === userId) {
                console.log("New message detected");
                setBadges(prev => ({ ...prev, messages: true }));
              }
            }
          )
          .subscribe();
          
        // For development - simulate a notification after 5 seconds
        if (import.meta.env.DEV) {
          setTimeout(() => {
            setBadges(prev => ({ ...prev, connections: true }));
          }, 5000);
        }
        
        return () => {
          supabase.removeChannel(channel);
        };
      } catch (error) {
        console.error("Error setting up badge notifications:", error);
      }
    };
    
    setupNotificationSubscription();
    
    return () => {
      window.removeEventListener('clear-notifications', handleClearNotifications);
    };
  }, []);

  // Function to clear a specific notification badge
  const clearBadge = useCallback((badgeName: keyof NotificationBadges) => {
    setBadges(prev => ({
      ...prev,
      [badgeName]: false
    }));
  }, []);

  // Function to clear all notification badges
  const clearAllBadges = useCallback(() => {
    setBadges({
      connections: false,
      messages: false,
      profile: false
    });
    
    // Dispatch event to inform other components
    const event = new CustomEvent('clear-notifications');
    window.dispatchEvent(event);
  }, []);

  // Set a badge manually (useful for testing)
  const setBadge = useCallback((badgeName: keyof NotificationBadges, value: boolean) => {
    setBadges(prev => ({
      ...prev,
      [badgeName]: value
    }));
  }, []);

  return {
    badges,
    clearBadge,
    clearAllBadges,
    setBadge
  };
}
