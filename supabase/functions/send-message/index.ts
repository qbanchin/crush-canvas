
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

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
    // Create a Supabase client with the Auth context of the function
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get the request body
    const { userId, recipientId, message } = await req.json()

    // Validate inputs
    if (!userId || !recipientId || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`User ${userId} sending message to ${recipientId}: ${message}`)

    // In a real implementation, you would store the message in your database
    // For example:
    // const { data, error } = await supabase
    //   .from('messages')
    //   .insert({
    //     sender_id: userId,
    //     recipient_id: recipientId,
    //     content: message,
    //   })
    
    // Generate a unique ID for the message
    const messageId = `sent-${Date.now()}-${Math.floor(Math.random() * 10000)}`
    
    // For now, we'll just simulate a successful message send
    const data = {
      id: messageId,
      senderId: userId,
      recipientId: recipientId,
      content: message,
      timestamp: new Date().toISOString(),
    }

    // Return a success response with the new message
    return new Response(
      JSON.stringify(data),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      },
    )
  } catch (error) {
    console.error('Error:', error)
    
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      },
    )
  }
})
