
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Flame, MessageSquare, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavBarProps {
  className?: string;
}

const NavBar: React.FC<NavBarProps> = ({ className }) => {
  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 flex justify-around items-center py-4 px-6 bg-background/80 backdrop-blur-md border-t z-10",
      className
    )}>
      <NavLink 
        to="/" 
        className={({ isActive }) => cn(
          "flex flex-col items-center gap-1 text-sm transition-all",
          isActive ? "text-primary" : "text-muted-foreground"
        )}
        end
      >
        <Flame size={24} />
        <span>Discover</span>
      </NavLink>
      
      <NavLink 
        to="/matches" 
        className={({ isActive }) => cn(
          "flex flex-col items-center gap-1 text-sm transition-all",
          isActive ? "text-primary" : "text-muted-foreground"
        )}
      >
        <MessageSquare size={24} />
        <span>Matches</span>
      </NavLink>
      
      <NavLink 
        to="/profile" 
        className={({ isActive }) => cn(
          "flex flex-col items-center gap-1 text-sm transition-all",
          isActive ? "text-primary" : "text-muted-foreground"
        )}
      >
        <User size={24} />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
};

export default NavBar;
