
import { useState } from 'react';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CountrySelection } from '@/components/auth/CountrySelection';
import { SignInForm } from '@/components/auth/SignInForm';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { SelectedCountryInfo } from '@/components/auth/SelectedCountryInfo';

const AuthPage = () => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const isMobile = useIsMobile();

  const handleCountryClick = (country: string) => {
    setSelectedCountry(country);
    toast.info(`Viewing profiles from ${country}`);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-sm z-10 py-3 px-2 shadow-sm">
        <div className="relative max-w-5xl mx-auto">
          <CountrySelection 
            selectedCountry={selectedCountry}
            onCountryClick={handleCountryClick}
            isMobile={isMobile}
          />
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
            <SignInForm />
          </TabsContent>
          
          <TabsContent value="signup">
            <SignUpForm />
          </TabsContent>
        </Tabs>

        <SelectedCountryInfo selectedCountry={selectedCountry} />
      </div>
    </div>
  );
};

export default AuthPage;
