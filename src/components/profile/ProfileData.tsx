
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { useProfileContext } from '@/contexts/ProfileContext';

const ProfileData: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const {
    setUser,
    setLoading,
    setEditForm
  } = useProfileContext();

  // Fetch the user's profile data when the component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      
      try {
        // Get the current authenticated user
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (!authUser) {
          // If no authenticated user, redirect to auth page
          navigate('/auth');
          return;
        }
        
        // Fetch the user's profile from the cards table
        const { data, error } = await supabase
          .from('cards')
          .select('*')
          .eq('id', authUser.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
          toast({
            title: "Error loading profile",
            description: error.message,
            variant: "destructive"
          });
          return;
        }
        
        if (data) {
          // Get user metadata for additional info
          const fullName = authUser.user_metadata?.full_name || data.name;
          
          // Ensure images is an array and has at least the placeholder
          const userImages = data.images && Array.isArray(data.images) && data.images.length > 0
            ? data.images
            : ["/placeholder.svg"];

          // Format location from distance
          const userLocation = data.distance 
            ? `${data.distance} km away` 
            : "Your location"; // Default location if not set
          
          console.log('Setting user profile with location:', userLocation, 'Distance value:', data.distance);
          
          setUser({
            name: fullName,
            age: data.age || 0,
            bio: data.bio || "",
            location: userLocation,
            images: userImages,
            interests: data.tags || []
          });
          
          setEditForm({
            name: fullName,
            age: data.age || 0,
            location: userLocation
          });
          
          console.log('EditForm set with location:', userLocation);
        }
      } catch (error: any) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [navigate, setLoading, setUser, setEditForm, toast]);

  return <>{children}</>;
};

export default ProfileData;
