
import React from 'react';
import SettingToggle, { SettingToggleProps } from '@/components/settings/SettingToggle';

const NotificationToggle: React.FC<SettingToggleProps> = (props) => {
  return <SettingToggle {...props} />;
};

export default NotificationToggle;
