
import React from 'react';

interface ConnectionsHeaderProps {
  useTestData: boolean;
  toggleTestData: () => void;
}

const ConnectionsHeader: React.FC<ConnectionsHeaderProps> = ({ 
  useTestData, 
  toggleTestData 
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Your Connections</h1>
      <button 
        onClick={toggleTestData}
        className="text-sm px-3 py-1 rounded-full bg-muted hover:bg-muted/80 transition-colors"
      >
        {useTestData ? "Try API" : "Use Test Data"}
      </button>
    </div>
  );
};

export default ConnectionsHeader;
