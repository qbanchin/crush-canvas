
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from './integrations/supabase/client';
import { Toaster } from './components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import NotFound from './pages/NotFound';
import Index from './pages/Index';
import ProfilePage from './pages/ProfilePage';
import ExploreSettingsPage from './pages/ExploreSettingsPage';
import PrivacySettingsPage from './pages/PrivacySettingsPage';
import NotificationsSettingsPage from './pages/NotificationsSettingsPage';
import HelpPage from './pages/HelpPage';
import MatchesPage from './pages/MatchesPage';
import AuthPage from './pages/AuthPage';
import './App.css';

function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Protected route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
    
    if (!session) {
      return <Navigate to="/auth" replace />;
    }
    
    return <>{children}</>;
  };

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        
        <Route path="/matches" element={
          <ProtectedRoute>
            <MatchesPage />
          </ProtectedRoute>
        } />
        
        <Route path="/settings/explore" element={
          <ProtectedRoute>
            <ExploreSettingsPage />
          </ProtectedRoute>
        } />
        
        <Route path="/settings/privacy" element={
          <ProtectedRoute>
            <PrivacySettingsPage />
          </ProtectedRoute>
        } />
        
        <Route path="/settings/notifications" element={
          <ProtectedRoute>
            <NotificationsSettingsPage />
          </ProtectedRoute>
        } />
        
        <Route path="/help" element={
          <ProtectedRoute>
            <HelpPage />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
      <SonnerToaster position="top-center" />
    </Router>
  );
}

export default App;
