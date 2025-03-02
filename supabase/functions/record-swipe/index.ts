
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Parse request body
    const { userId, cardId, direction } = await req.json()

    // Validation
    if (!userId || !cardId || !direction) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: userId, cardId, direction' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Only process right swipes (likes)
    if (direction === 'right') {
      // Record the like in the matches table
      const { data: newMatch, error: insertError } = await supabaseClient
        .from('matches')
        .insert([
          { user_id: userId, liked_user_id: cardId }
        ])
        .select()

      if (insertError) {
        console.error('Error inserting match:', insertError)
        return new Response(
          JSON.stringify({ error: insertError.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      // Check if this created a mutual match
      const { data: matchData, error: matchError } = await supabaseClient
        .from('matches')
        .select('*')
        .eq('user_id', cardId)
        .eq('liked_user_id', userId)
        .single()

      if (matchError && matchError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error('Error checking for mutual match:', matchError)
        return new Response(
          JSON.stringify({ error: matchError.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      // If there's a mutual match, update both records
      if (matchData) {
        // Update the newly created match
        const { error: updateError1 } = await supabaseClient
          .from('matches')
          .update({ is_match: true })
          .eq('id', newMatch[0].id)

        // Update the existing match
        const { error: updateError2 } = await supabaseClient
          .from('matches')
          .update({ is_match: true })
          .eq('id', matchData.id)

        if (updateError1 || updateError2) {
          console.error('Error updating match status:', updateError1 || updateError2)
        }

        return new Response(
          JSON.stringify({ 
            match: true,
            matchedUserId: cardId
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )
      }
    }

    // For left swipes or no match created
    return new Response(
      JSON.stringify({ match: false }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
