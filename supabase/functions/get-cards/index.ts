
import { serve } from 'https://deno.land/std@0.170.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.5.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Parse the request body
    let excludeIds: string[] = [];
    let genderPreference: string | null = null;
    let userGender: string | null = null;
    
    if (req.method === 'POST') {
      const body = await req.json();
      excludeIds = body.excludeIds || [];
      genderPreference = body.genderPreference || null;
      userGender = body.userGender || null;
    }

    console.log(`Filtering with excludeIds: ${excludeIds.length}, preference: ${genderPreference}, userGender: ${userGender}`);

    // Build the query
    let query = supabaseClient
      .from('cards')
      .select('*');
    
    // If there are profile IDs to exclude, add that to the query
    if (excludeIds.length > 0) {
      query = query.not('id', 'in', `(${excludeIds.join(',')})`);
    }
    
    // Apply gender preference filtering if both preference and gender fields are provided
    if (genderPreference === 'male') {
      query = query.eq('gender', 'male');
    } else if (genderPreference === 'female') {
      query = query.eq('gender', 'female');
    }
    
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching cards:', error);
      throw error;
    }

    // Return the cards as the response
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
