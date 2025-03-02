
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
    // Parse request body or URL parameters
    const url = new URL(req.url)
    const userId = url.searchParams.get('userId') || (await req.json()).userId

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameter: userId' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Get all matched profiles for this user
    const { data: matchData, error: matchError } = await supabaseClient
      .from('matches')
      .select('*')
      .eq('user_id', userId)
      .eq('is_match', true)

    if (matchError) {
      console.error('Error fetching matches:', matchError)
      return new Response(
        JSON.stringify({ error: matchError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Get the matched user profiles
    const matchedUserIds = matchData.map(match => match.liked_user_id)
    if (matchedUserIds.length === 0) {
      return new Response(
        JSON.stringify([]),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    const { data: profilesData, error: profilesError } = await supabaseClient
      .from('cards')
      .select('*')
      .in('id', matchedUserIds)

    if (profilesError) {
      console.error('Error fetching matched profiles:', profilesError)
      return new Response(
        JSON.stringify({ error: profilesError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    return new Response(
      JSON.stringify(profilesData),
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
