
import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Binoculars, MessageSquare, User, CheckCircle, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNotificationBadges } from '@/hooks/useNotificationBadges';

interface NavBarProps {
  className?: string;
}

const NavBar: React.FC<NavBarProps> = ({ className }) => {
  const { badges, clearBadge } = useNotificationBadges();
  
  useEffect(() => {
    // Show toasts for new notifications
    if (badges.connections) {
      toast.success("You have a new connection!");
    }
    if (badges.messages) {
      toast.success("You have a new message!");
    }
  }, [badges]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 flex justify-center items-center py-4 px-6 bg-background/80 backdrop-blur-md border-b z-10">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <Globe size={28} className="text-primary" />
          <span className="font-semibold text-sm">DigitalNomad</span>
        </NavLink>
      </header>
      
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
          <Binoculars size={24} />
          <span>Explore</span>
        </NavLink>
        
        <NavLink 
          to="/matches" 
          className={({ isActive }) => cn(
            "flex flex-col items-center gap-1 text-sm transition-all relative",
            isActive ? "text-primary" : "text-muted-foreground"
          )}
          onClick={() => clearBadge('connections')}
        >
          <div className="relative">
            <MessageSquare size={24} />
            {badges.connections && (
              <CheckCircle 
                size={16} 
                className="absolute -top-1 -right-2 text-green-500 fill-green-500" 
              />
            )}
          </div>
          <span>Connections</span>
        </NavLink>
        
        <NavLink 
          to="/profile" 
          className={({ isActive }) => cn(
            "flex flex-col items-center gap-1 text-sm transition-all relative",
            isActive ? "text-primary" : "text-muted-foreground"
          )}
        >
          <div className="relative">
            <User size={24} />
            {badges.profile && (
              <CheckCircle 
                size={16} 
                className="absolute -top-1 -right-2 text-green-500 fill-green-500" 
              />
            )}
          </div>
          <span>Profile</span>
        </NavLink>
      </nav>
    </>
  );
};

export default NavBar;
