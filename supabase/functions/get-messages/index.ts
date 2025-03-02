
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 200,
    })
  }
  
  try {
    // Parse request body
    const { userId, recipientId } = await req.json()
    
    if (!userId || !recipientId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          headers: { 'Content-Type': 'application/json', ...corsHeaders }, 
          status: 400 
        }
      )
    }
    
    // In a real implementation, you would fetch messages from a database
    // const { data, error } = await supabaseClient
    //   .from('messages')
    //   .select('*')
    //   .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    //   .or(`sender_id.eq.${recipientId},recipient_id.eq.${recipientId}`)
    //   .order('created_at', { ascending: true })
    
    // For demo, we'll generate some fake messages
    const now = new Date()
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    
    const messages = [
      {
        id: "1",
        senderId: userId,
        recipientId: recipientId,
        content: "Hey there! How are you doing?",
        timestamp: new Date(oneDayAgo.getTime()).toISOString()
      },
      {
        id: "2",
        senderId: recipientId,
        recipientId: userId,
        content: "I'm doing great! Thanks for asking. How about you?",
        timestamp: new Date(oneDayAgo.getTime() + 1000000).toISOString()
      },
      {
        id: "3",
        senderId: userId,
        recipientId: recipientId,
        content: "I'm good! Just checking out this new app. The interface is nice.",
        timestamp: new Date(oneDayAgo.getTime() + 2000000).toISOString()
      },
      {
        id: "4",
        senderId: recipientId,
        recipientId: userId,
        content: "Yeah, it's pretty cool. Would you like to meet up sometime?",
        timestamp: new Date(oneDayAgo.getTime() + 43200000).toISOString()
      }
    ]

    console.log("Messages loaded:", messages);
    
    // Return messages
    return new Response(
      JSON.stringify(messages),
      { 
        headers: { 'Content-Type': 'application/json', ...corsHeaders }, 
        status: 200 
      }
    )
  } catch (error) {
    // Handle errors
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 'Content-Type': 'application/json', ...corsHeaders }, 
        status: 500 
      }
    )
  }
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/get-messages' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"userId":"123", "recipientId":"456"}'
