
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import HeaderBar from '@/components/HeaderBar';

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Check if user is already logged in
  const checkSession = async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      navigate('/');
    }
  };

  useState(() => {
    checkSession();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp && password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    setIsLoading(true);
    
    try {
      let authResponse;
      
      if (isSignUp) {
        // Sign up
        authResponse = await supabase.auth.signUp({
          email,
          password,
        });
      } else {
        // Sign in
        authResponse = await supabase.auth.signInWithPassword({
          email,
          password,
        });
      }
      
      if (authResponse.error) {
        throw authResponse.error;
      }
      
      if (isSignUp) {
        toast.success("Account created successfully! You can now log in.");
        setIsSignUp(false);
      } else {
        toast.success("Logged in successfully!");
        navigate('/');
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      toast.error(error.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <HeaderBar />
      
      <main className="flex-1 flex items-center justify-center p-4 mt-16 mb-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              {isSignUp ? 'Create an account' : 'Welcome back'}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isSignUp 
                ? 'Enter your details to create an account' 
                : 'Enter your credentials to access your account'}
            </p>
          </div>
          
          <div className="space-y-6 bg-card p-6 rounded-lg border border-border">
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  required 
                />
              </div>
              
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••" 
                    required 
                  />
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading 
                  ? 'Processing...' 
                  : isSignUp ? 'Create account' : 'Sign in'}
              </Button>
            </form>
            
            <div className="text-center pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                {isSignUp 
                  ? 'Already have an account?' 
                  : "Don't have an account?"}
                {' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-primary hover:underline font-medium"
                >
                  {isSignUp ? 'Sign in' : 'Create one'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthPage;
