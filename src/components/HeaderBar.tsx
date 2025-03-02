
import React from 'react';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';

interface HeaderBarProps {
  className?: string;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ className }) => {
  const location = useLocation();
  
  // Determine the title based on the current route
  let title = "Discover";
  if (location.pathname === "/matches") {
    title = "Matches";
  } else if (location.pathname === "/profile") {
    title = "Profile";
  }

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 flex justify-center items-center h-16 bg-background/80 backdrop-blur-md border-b z-10",
      className
    )}>
      <div className="flex items-center">
        {title === "Discover" && (
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/290973f2-f16b-4e56-8cfe-afb3b85e2239.png" 
              alt="Global Love" 
              className="h-10 w-10 object-contain" 
            />
          </div>
        )}
        {title !== "Discover" && (
          <h1 className="text-lg font-semibold">{title}</h1>
        )}
      </div>
    </header>
  );
};

export default HeaderBar;
