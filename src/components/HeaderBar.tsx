
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MenuIcon, XIcon, ChevronLeftIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const HeaderBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  
  const isAuthPage = location.pathname === '/auth';
  const showBackButton = location.pathname !== '/' && location.pathname !== '/matches' && !isAuthPage;

  const getTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Discover';
    if (path === '/matches') return 'Connections';
    if (path === '/profile') return 'Profile';
    if (path === '/auth') return 'Account';
    if (path.includes('/settings/explore')) return 'Discover Settings';
    if (path.includes('/settings/privacy')) return 'Privacy Settings';
    if (path.includes('/settings/notifications')) return 'Notifications';
    if (path === '/help') return 'Help & Support';
    return '';
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
      navigate('/auth');
    } catch (error: any) {
      toast.error('Error logging out: ' + error.message);
    }
    setMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-background border-b border-border z-50 px-4 flex items-center justify-between">
      <div className="flex items-center">
        {showBackButton ? (
          <button 
            onClick={() => navigate(-1)} 
            className="mr-3 p-1 rounded-full hover:bg-muted"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
        ) : null}
        
        <h1 className="text-lg font-semibold">{getTitle()}</h1>
      </div>
      
      {!isAuthPage && (
        <div className="relative">
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-full hover:bg-muted"
          >
            {menuOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
          </button>
          
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg border border-border overflow-hidden z-50">
              <div className="py-1">
                <Link 
                  to="/profile" 
                  className="block px-4 py-2 text-sm hover:bg-muted"
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link 
                  to="/settings/explore" 
                  className="block px-4 py-2 text-sm hover:bg-muted"
                  onClick={() => setMenuOpen(false)}
                >
                  Settings
                </Link>
                <Link 
                  to="/help" 
                  className="block px-4 py-2 text-sm hover:bg-muted"
                  onClick={() => setMenuOpen(false)}
                >
                  Help
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-muted text-destructive"
                >
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default HeaderBar;
