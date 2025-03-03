import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSwipe } from '@/hooks/useSwipe';

const topRowCountries = [
  'Spain',
  'Portugal',
  'Thailand',
  'Philippines',
  'Vietnam',
  'Cambodia'
];

const bottomRowCountries = [
  'Indonesia',
  'Colombia',
  'Panama',
  'Mexico',
  'Nicaragua',
  'Costa Rica'
];

const countries = [...topRowCountries, ...bottomRowCountries];

const AuthPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');
  const topRowRef = useRef<HTMLDivElement>(null);
  const bottomRowRef = useRef<HTMLDivElement>(null);
  const desktopMenuRef = useRef<HTMLDivElement>(null);
  
  const { 
    handleTouchStart: handleTopRowTouchStart, 
    handleTouchMove: handleTopRowTouchMove, 
    handleTouchEnd: handleTopRowTouchEnd, 
    handleMouseDown: handleTopRowMouseDown, 
    handleMouseMove: handleTopRowMouseMove, 
    handleMouseUp: handleTopRowMouseUp, 
    handleSwipe: handleTopRowSwipe,
    swipeDirection: topRowSwipeDirection,
    isMobile
  } = useSwipe({ 
    containerRef: topRowRef,
    onSwipe: (direction) => {
      console.log(`Top row swiped ${direction}`);
    } 
  });
  
  const { 
    handleTouchStart: handleBottomRowTouchStart, 
    handleTouchMove: handleBottomRowTouchMove, 
    handleTouchEnd: handleBottomRowTouchEnd, 
    handleMouseDown: handleBottomRowMouseDown, 
    handleMouseMove: handleBottomRowMouseMove, 
    handleMouseUp: handleBottomRowMouseUp, 
    handleSwipe: handleBottomRowSwipe,
    swipeDirection: bottomRowSwipeDirection
  } = useSwipe({ 
    containerRef: bottomRowRef,
    onSwipe: (direction) => {
      console.log(`Bottom row swiped ${direction}`);
    } 
  });
  
  const { 
    handleTouchStart: handleDesktopTouchStart, 
    handleTouchMove: handleDesktopTouchMove, 
    handleTouchEnd: handleDesktopTouchEnd, 
    handleMouseDown: handleDesktopMouseDown, 
    handleMouseMove: handleDesktopMouseMove, 
    handleMouseUp: handleDesktopMouseUp, 
    handleSwipe: handleDesktopSwipe,
    swipeDirection: desktopSwipeDirection
  } = useSwipe({ 
    containerRef: desktopMenuRef,
    onSwipe: (direction) => {
      console.log(`Desktop menu swiped ${direction}`);
    } 
  });

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!name.trim()) {
        throw new Error("Please enter your name");
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      });
      
      if (authError) throw authError;

      if (authData?.user) {
        console.log("User created with ID:", authData.user.id);
        
        const { error: profileError } = await supabase
          .from('cards')
          .insert({
            id: authData.user.id,
            name: name,
            age: 25,
            bio: "New to Single Expats",
            images: ["/placeholder.svg"],
            tags: ["New User"],
            distance: 0
          });

        if (profileError) {
          console.error("Failed to create profile:", profileError);
          toast.error("Account created but profile setup failed. Please contact support.");
        } else {
          toast.success('Account created successfully! Redirecting to your profile.');
          
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (signInError) {
            throw signInError;
          }
          
          navigate('/profile');
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      navigate('/profile');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCountryClick = (country: string) => {
    setSelectedCountry(country);
    toast.info(`Viewing profiles from ${country}`);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-sm z-10 py-3 px-2 shadow-sm">
        <div className="relative max-w-5xl mx-auto">
          {isMobile ? (
            <div className="flex flex-col gap-3 px-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-shrink-0 font-medium text-muted-foreground flex items-center gap-1">
                  <Globe size={16} />
                  <span>Explore:</span>
                </div>
              </div>
              
              <div className="relative">
                <div 
                  ref={topRowRef}
                  className={`flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted transition-transform ${
                    topRowSwipeDirection === 'left' ? 'animate-slide-out-left' : 
                    topRowSwipeDirection === 'right' ? 'animate-slide-out-right' : ''
                  }`}
                  onTouchStart={handleTopRowTouchStart}
                  onTouchMove={handleTopRowTouchMove}
                  onTouchEnd={handleTopRowTouchEnd}
                  onMouseDown={handleTopRowMouseDown}
                  onMouseMove={handleTopRowMouseMove}
                  onMouseUp={handleTopRowMouseUp}
                >
                  {topRowCountries.map((country) => (
                    <Button
                      key={country}
                      variant="outline"
                      size="sm"
                      className={`flex-shrink-0 rounded-full px-3 py-1 text-xs ${selectedCountry === country ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}`}
                      onClick={() => handleCountryClick(country)}
                    >
                      {country}
                    </Button>
                  ))}
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm rounded-full p-1 h-8 w-8"
                  onClick={() => handleTopRowSwipe('right')}
                >
                  <ChevronLeft size={18} />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm rounded-full p-1 h-8 w-8"
                  onClick={() => handleTopRowSwipe('left')}
                >
                  <ChevronRight size={18} />
                </Button>
              </div>
              
              <div className="relative">
                <div 
                  ref={bottomRowRef}
                  className={`flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted transition-transform ${
                    bottomRowSwipeDirection === 'left' ? 'animate-slide-out-left' : 
                    bottomRowSwipeDirection === 'right' ? 'animate-slide-out-right' : ''
                  }`}
                  onTouchStart={handleBottomRowTouchStart}
                  onTouchMove={handleBottomRowTouchMove}
                  onTouchEnd={handleBottomRowTouchEnd}
                  onMouseDown={handleBottomRowMouseDown}
                  onMouseMove={handleBottomRowMouseMove}
                  onMouseUp={handleBottomRowMouseUp}
                >
                  {bottomRowCountries.map((country) => (
                    <Button
                      key={country}
                      variant="outline"
                      size="sm"
                      className={`flex-shrink-0 rounded-full px-3 py-1 text-xs ${selectedCountry === country ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}`}
                      onClick={() => handleCountryClick(country)}
                    >
                      {country}
                    </Button>
                  ))}
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm rounded-full p-1 h-8 w-8"
                  onClick={() => handleBottomRowSwipe('right')}
                >
                  <ChevronLeft size={18} />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm rounded-full p-1 h-8 w-8"
                  onClick={() => handleBottomRowSwipe('left')}
                >
                  <ChevronRight size={18} />
                </Button>
              </div>
            </div>
          ) : (
            <div className="relative">
              <div 
                ref={desktopMenuRef}
                className={`flex items-center gap-2 overflow-x-hidden pb-2 scrollbar-thin scrollbar-thumb-muted transition-transform ${
                  desktopSwipeDirection === 'left' ? 'animate-slide-out-left' : 
                  desktopSwipeDirection === 'right' ? 'animate-slide-out-right' : ''
                }`}
                onTouchStart={handleDesktopTouchStart}
                onTouchMove={handleDesktopTouchMove}
                onTouchEnd={handleDesktopTouchEnd}
                onMouseDown={handleDesktopMouseDown}
                onMouseMove={handleDesktopMouseMove}
                onMouseUp={handleDesktopMouseUp}
              >
                <div className="flex-shrink-0 font-medium text-muted-foreground flex items-center gap-1 pl-2">
                  <Globe size={16} />
                  <span>Explore:</span>
                </div>
                {countries.map((country) => (
                  <Button
                    key={country}
                    variant="outline"
                    size="sm"
                    className={`flex-shrink-0 rounded-full px-3 py-1 text-xs ${selectedCountry === country ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}`}
                    onClick={() => handleCountryClick(country)}
                  >
                    {country}
                  </Button>
                ))}
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm rounded-full p-1 h-8 w-8"
                onClick={() => handleDesktopSwipe('right')}
              >
                <ChevronLeft size={18} />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm rounded-full p-1 h-8 w-8"
                onClick={() => handleDesktopSwipe('left')}
              >
                <ChevronRight size={18} />
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <div className="w-full max-w-md space-y-6 mt-16">
        <div className="text-center space-y-4">
          <img 
            src="/lovable-uploads/045f4838-7fe0-4265-943a-0d7ba5dec7de.png" 
            alt="Single Expats Logo" 
            className="w-32 h-32 mx-auto"
          />
          <h1 className="text-3xl font-bold">
            <span className="text-secondary">Single</span> <span className="text-primary">Expats</span>
          </h1>
          <p className="text-muted-foreground mt-2">Sign in or create an account to continue</p>
        </div>
        
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="your@email.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  type="text" 
                  placeholder="Your Name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input 
                  id="signup-email" 
                  type="email" 
                  placeholder="your@email.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input 
                  id="signup-password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {selectedCountry && (
          <div className="mt-8 p-4 border rounded-lg bg-card">
            <h3 className="text-lg font-medium mb-2">Profiles in {selectedCountry}</h3>
            <p className="text-muted-foreground text-sm">
              Create an account to see profiles from {selectedCountry} and start connecting!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
