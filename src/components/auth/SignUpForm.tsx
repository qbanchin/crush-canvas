
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const SignUpForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

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

  return (
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
  );
};
