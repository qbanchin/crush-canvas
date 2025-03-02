
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
    const { userId, cardId, direction } = await req.json();
    
    // Validate the request
    if (!userId || !cardId || !direction) {
      throw new Error("Missing required fields");
    }

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

    // Only record likes (right swipes)
    if (direction === "right") {
      // Record the swipe
      const { error: insertError } = await supabaseClient
        .from("matches")
        .insert({
          user_id: userId,
          liked_user_id: cardId,
          is_match: false
        });

      if (insertError) throw insertError;

      // Check if there's a match
      const { data: matchData, error: matchError } = await supabaseClient
        .from("matches")
        .select("*")
        .eq("user_id", cardId)
        .eq("liked_user_id", userId)
        .single();

      if (matchError && matchError.code !== "PGRST116") {
        throw matchError;
      }

      // If there's a match, update both records
      if (matchData) {
        // Update the original match
        const { error: updateError1 } = await supabaseClient
          .from("matches")
          .update({ is_match: true })
          .eq("user_id", userId)
          .eq("liked_user_id", cardId);

        if (updateError1) throw updateError1;

        // Update the reciprocal match
        const { error: updateError2 } = await supabaseClient
          .from("matches")
          .update({ is_match: true })
          .eq("user_id", cardId)
          .eq("liked_user_id", userId);

        if (updateError2) throw updateError2;

        // Return with match data
        return new Response(
          JSON.stringify({ 
            success: true, 
            match: true 
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          }
        );
      }
    }

    // Return success
    return new Response(
      JSON.stringify({ 
        success: true,
        match: false 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
