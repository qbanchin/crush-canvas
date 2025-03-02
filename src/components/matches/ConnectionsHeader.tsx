
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNotificationBadges } from '@/hooks/useNotificationBadges';

interface ConnectionsHeaderProps {
  useTestData: boolean;
  toggleTestData: () => void;
}

const ConnectionsHeader: React.FC<ConnectionsHeaderProps> = ({ 
  useTestData, 
  toggleTestData,
}) => {
  const isMobile = useIsMobile();
  const { clearAllBadges } = useNotificationBadges();
  
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">
      <h1 className="text-xl sm:text-2xl font-bold">Your Connections</h1>
      <div className="flex items-center gap-2 flex-wrap justify-start sm:justify-end">
        <button
          onClick={clearAllBadges}
          className={cn(
            "text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full",
            "bg-green-100 text-green-800 hover:bg-green-200 transition-colors",
            "flex items-center gap-1 flex-shrink-0"
          )}
        >
          <CheckCircle size={isMobile ? 12 : 14} className="fill-green-500 text-green-500" />
          <span>{isMobile ? "Clear" : "Clear Notifications"}</span>
        </button>
        <button 
          onClick={toggleTestData}
          className="text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full bg-muted hover:bg-muted/80 transition-colors flex-shrink-0"
        >
          {useTestData ? "Try API" : "Use Test Data"}
        </button>
      </div>
    </div>
  );
};

export default ConnectionsHeader;
