
export interface NotificationSettings {
  newMatches: boolean;
  messages: boolean;
  appUpdates: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export const defaultSettings: NotificationSettings = {
  newMatches: true,
  messages: true,
  appUpdates: false,
  emailNotifications: true,
  pushNotifications: true
};
