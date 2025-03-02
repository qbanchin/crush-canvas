
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

    // Get the current user's ID
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error("Not authenticated");
    }

    // Get request body
    const { cardId, direction } = await req.json();
    
    console.log(`Recording swipe: User ${user.id} swiped ${direction} on card ${cardId}`);
    
    // Check if this is a right swipe (like)
    const isMatch = direction === "right";
    
    // Check if there's already a record to avoid duplicates
    const { data: existingRecord, error: checkError } = await supabaseClient
      .from("matches")
      .select("*")
      .eq("user_id", user.id)
      .eq("liked_user_id", cardId)
      .single();
      
    if (checkError && checkError.code !== "PGRST116") {
      // If error is not "no rows returned", then it's a real error
      console.error("Error checking existing record:", checkError);
      throw checkError;
    }
    
    // If record already exists, don't insert again
    if (existingRecord) {
      console.log("Record already exists, not inserting again");
      return new Response(
        JSON.stringify({ 
          success: true, 
          match: false, 
          message: "Record already exists"
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Insert the new match/reject record
    const { error: insertError } = await supabaseClient
      .from("matches")
      .insert({
        user_id: user.id,
        liked_user_id: cardId,
        is_match: isMatch
      });

    if (insertError) {
      console.error("Error inserting match record:", insertError);
      throw insertError;
    }

    // If it was a right swipe, check if there's a mutual match
    let match = false;
    if (isMatch) {
      const { data: mutualMatch, error: mutualError } = await supabaseClient
        .from("matches")
        .select("*")
        .eq("user_id", cardId)
        .eq("liked_user_id", user.id)
        .eq("is_match", true)
        .single();

      if (mutualError && mutualError.code !== "PGRST116") {
        console.error("Error checking mutual match:", mutualError);
      } else if (mutualMatch) {
        match = true;
        console.log("Mutual match found!");
      }
    }

    return new Response(
      JSON.stringify({ success: true, match }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in record-swipe function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400 
      }
    );
  }
});
