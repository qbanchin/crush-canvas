
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get request body
    const { userId, connectionId } = await req.json()

    console.log(`Deleting connection: User ID ${userId}, Connection ID ${connectionId}`)

    if (!userId || !connectionId) {
      return new Response(
        JSON.stringify({ error: 'User ID and connection ID are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Delete the match from the matches table
    const { error: deleteError } = await supabaseClient
      .from('matches')
      .delete()
      .eq('user_id', userId)
      .eq('liked_user_id', connectionId)

    if (deleteError) {
      console.error('Error deleting connection:', deleteError)
      return new Response(
        JSON.stringify({ error: 'Failed to delete connection' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Also delete the reverse match if it exists (for the other user)
    await supabaseClient
      .from('matches')
      .delete()
      .eq('user_id', connectionId)
      .eq('liked_user_id', userId)
    
    // Also delete any messages between these users
    const { error: deleteMessagesError } = await supabaseClient
      .from('messages')
      .delete()
      .or(`(sender_id.eq.${userId}.and.recipient_id.eq.${connectionId}), (sender_id.eq.${connectionId}.and.recipient_id.eq.${userId})`)

    if (deleteMessagesError) {
      console.error('Error deleting messages:', deleteMessagesError)
      // We don't want to fail the whole operation if just the messages deletion fails
      // So we'll just log the error but still return success
    }

    console.log('Connection deleted successfully')
    
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
