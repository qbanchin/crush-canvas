
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useCurrentUser() {
  const [currentUserID, setCurrentUserID] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          setCurrentUserID(data.user.id);
          setLoading(false);
          return data.user.id;
        }
        // Fall back to test user id for development
        const tempUserId = "temp-user-id";
        setCurrentUserID(tempUserId);
        setLoading(false);
        return tempUserId;
      } catch (error) {
        console.error("Error getting current user:", error);
        const tempUserId = "temp-user-id";
        setCurrentUserID(tempUserId);
        setLoading(false);
        return tempUserId;
      }
    };

    getCurrentUser();
  }, []);

  return { currentUserID, loading };
}
