
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Binoculars, MessageSquare, User, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface NavBarProps {
  className?: string;
}

const NavBar: React.FC<NavBarProps> = ({ className }) => {
  const [hasNewActivity, setHasNewActivity] = useState(false);
  
  useEffect(() => {
    // Check for new connections or messages
    const checkForNewActivity = async () => {
      try {
        const { data: user } = await supabase.auth.getUser();
        const userId = user?.user?.id || "temp-user-id";
        
        // Subscribe to new connections and messages
        const channel = supabase
          .channel('connection-notifications')
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
                setHasNewActivity(true);
                toast.success("You have a new connection!");
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
                setHasNewActivity(true);
                toast.success("You have a new message!");
              }
            }
          )
          .subscribe();
          
        // For development - simulate a new notification after 5 seconds
        if (import.meta.env.DEV) {
          setTimeout(() => {
            setHasNewActivity(true);
          }, 5000);
        }
        
        return () => {
          supabase.removeChannel(channel);
        };
      } catch (error) {
        console.error("Error setting up activity notification:", error);
      }
    };
    
    checkForNewActivity();
  }, []);
  
  const clearNotification = () => {
    setHasNewActivity(false);
  };

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
        <Binoculars size={24} />
        <span>Explore</span>
      </NavLink>
      
      <NavLink 
        to="/matches" 
        className={({ isActive }) => cn(
          "flex flex-col items-center gap-1 text-sm transition-all relative",
          isActive ? "text-primary" : "text-muted-foreground"
        )}
        onClick={clearNotification}
      >
        <div className="relative">
          <MessageSquare size={24} />
          {hasNewActivity && (
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
