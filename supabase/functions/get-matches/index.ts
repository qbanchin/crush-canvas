
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get the request body
    const { userId } = await req.json();
    
    // Validate the request
    if (!userId) {
      throw new Error("Missing userId");
    }

    console.log("Getting matches for user:", userId);

    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Get the user's matches
    const { data: matchesData, error: matchesError } = await supabaseClient
      .from("matches")
      .select("liked_user_id")
      .eq("user_id", userId)
      .eq("is_match", true);

    if (matchesError) {
      console.error("Error fetching matches:", matchesError);
      throw matchesError;
    }

    console.log("Found matches:", matchesData?.length || 0);

    if (!matchesData || matchesData.length === 0) {
      return new Response(JSON.stringify([]), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Get the profiles of the matched users
    const matchedUserIds = matchesData.map(match => match.liked_user_id);
    
    console.log("Fetching profiles for matched users:", matchedUserIds);
    
    const { data: profilesData, error: profilesError } = await supabaseClient
      .from("cards")
      .select("*")
      .in("id", matchedUserIds);

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      throw profilesError;
    }

    console.log("Found profiles:", profilesData?.length || 0);

    // Return the matched profiles
    return new Response(JSON.stringify(profilesData || []), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in get-matches function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
