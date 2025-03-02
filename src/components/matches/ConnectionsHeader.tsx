
import React from 'react';
import { CheckCircle } from 'lucide-react';

interface ConnectionsHeaderProps {
  useTestData: boolean;
  toggleTestData: () => void;
  clearNotifications?: () => void;
}

const ConnectionsHeader: React.FC<ConnectionsHeaderProps> = ({ 
  useTestData, 
  toggleTestData,
  clearNotifications
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Your Connections</h1>
      <div className="flex items-center gap-2">
        {clearNotifications && (
          <button
            onClick={clearNotifications}
            className="text-sm px-3 py-1 rounded-full bg-green-100 text-green-800 hover:bg-green-200 transition-colors flex items-center gap-1"
          >
            <CheckCircle size={14} className="fill-green-500 text-green-500" />
            <span>Clear Notifications</span>
          </button>
        )}
        <button 
          onClick={toggleTestData}
          className="text-sm px-3 py-1 rounded-full bg-muted hover:bg-muted/80 transition-colors"
        >
          {useTestData ? "Try API" : "Use Test Data"}
        </button>
      </div>
    </div>
  );
};

export default ConnectionsHeader;
