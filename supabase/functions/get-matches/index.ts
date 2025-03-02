
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
    // Parse request body
    const { userId } = await req.json();
    
    if (!userId) {
      throw new Error("User ID is required");
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

    // In a real application, we would fetch actual matches from the database
    // For now, we'll return mock data since the tables might not be set up yet
    
    // This is where you'd query actual match data from your database
    // For example:
    // const { data: matchesData, error: matchesError } = await supabaseClient
    //   .from("connections")
    //   .select("*")
    //   .eq("user_id", userId);
    
    // For now, we'll return mock data that matches the expected format
    const mockProfiles = [
      {
        id: "1",
        name: "Sophie",
        age: 28,
        bio: "Passionate photographer and coffee enthusiast. Let's explore the city together!",
        distance: 3,
        images: [
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80"
        ],
        tags: ["Photography", "Coffee", "Travel"],
        hasNewMessage: false
      },
      {
        id: "2",
        name: "Alex",
        age: 30,
        bio: "Software developer by day, amateur chef by night. I make a mean pasta carbonara!",
        distance: 5,
        images: [
          "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
          "https://images.unsplash.com/photo-1488161628813-04466f872be2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80"
        ],
        tags: ["Coding", "Cooking", "Music"],
        hasNewMessage: false
      },
      {
        id: "3",
        name: "Emma",
        age: 26,
        bio: "Yoga instructor and plant mom. Looking for someone to share adventures and quiet moments with.",
        distance: 2,
        images: [
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
          "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
        ],
        tags: ["Yoga", "Plants", "Meditation"],
        hasNewMessage: false
      }
    ];

    console.log("Returning mock profiles for development");

    return new Response(JSON.stringify(mockProfiles), {
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
