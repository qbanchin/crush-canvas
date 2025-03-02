
import React from 'react';
import { Separator } from '@/components/ui/separator';
import NotificationToggle from './NotificationToggle';
import { NotificationSettings } from '@/types/notification.types';

interface NotificationsListProps {
  settings: NotificationSettings;
  onToggle: (setting: keyof NotificationSettings) => void;
}

const NotificationsList: React.FC<NotificationsListProps> = ({
  settings,
  onToggle
}) => {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-semibold mb-4">Notifications</h2>
        <div className="space-y-4">
          <NotificationToggle
            title="New Matches"
            description="Get notified when you match with someone"
            checked={settings.newMatches}
            onToggle={() => onToggle('newMatches')}
          />
          
          <NotificationToggle
            title="Messages"
            description="Get notified when you receive a message"
            checked={settings.messages}
            onToggle={() => onToggle('messages')}
          />
          
          <NotificationToggle
            title="App Updates"
            description="Get notified about new features and updates"
            checked={settings.appUpdates}
            onToggle={() => onToggle('appUpdates')}
          />
        </div>
      </section>
      
      <section>
        <h2 className="text-xl font-semibold mb-4">Notification Methods</h2>
        <div className="space-y-4">
          <NotificationToggle
            title="Email Notifications"
            description="Receive notifications via email"
            checked={settings.emailNotifications}
            onToggle={() => onToggle('emailNotifications')}
          />
          
          <NotificationToggle
            title="Push Notifications"
            description="Receive notifications on your device"
            checked={settings.pushNotifications}
            onToggle={() => onToggle('pushNotifications')}
          />
        </div>
      </section>
    </div>
  );
};

export default NotificationsList;
