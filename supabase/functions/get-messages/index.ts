
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
    const { userId, recipientId } = await req.json()

    // Validate inputs
    if (!userId || !recipientId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Fetching messages between ${userId} and ${recipientId}`)

    // In a real implementation, you would fetch messages from your database
    // For example:
    // const { data, error } = await supabase
    //   .from('messages')
    //   .select('*')
    //   .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    //   .or(`sender_id.eq.${recipientId},recipient_id.eq.${recipientId}`)
    //   .order('created_at', { ascending: true })
    
    // For now, we'll just return simulated messages
    const now = new Date()
    const oneDay = 24 * 60 * 60 * 1000
    
    const mockMessages = [
      {
        id: '1',
        senderId: userId,
        recipientId: recipientId,
        content: 'Hey there! How are you doing?',
        timestamp: new Date(now.getTime() - oneDay).toISOString(),
      },
      {
        id: '2',
        senderId: recipientId,
        recipientId: userId,
        content: "I'm doing great! Thanks for asking. How about you?",
        timestamp: new Date(now.getTime() - oneDay + 1000 * 60 * 16.8).toISOString(),
      },
      {
        id: '3',
        senderId: userId,
        recipientId: recipientId,
        content: "I'm good! Just checking out this new app. The interface is nice.",
        timestamp: new Date(now.getTime() - oneDay + 1000 * 60 * 33.5).toISOString(),
      },
      {
        id: '4',
        senderId: recipientId,
        recipientId: userId,
        content: "Yeah, it's pretty cool. Would you like to meet up sometime?",
        timestamp: new Date(now.getTime() - 1000 * 60 * 720).toISOString(),
      }
    ]

    // Return the mock messages
    return new Response(
      JSON.stringify(mockMessages),
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
