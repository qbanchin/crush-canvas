
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log("Hello from Send Message Function!")

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
    const { userId, recipientId, message } = await req.json()
    
    if (!userId || !recipientId || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
          status: 400 
        }
      )
    }
    
    // In a real implementation, you would save the message to a database
    // const { data, error } = await supabaseClient
    //   .from('messages')
    //   .insert({
    //     sender_id: userId,
    //     recipient_id: recipientId,
    //     content: message,
    //   })
    
    // Generate a unique ID for the message with timestamp for better uniqueness
    const messageId = `sent-${Date.now()}-${Math.floor(Math.random() * 10000)}`
    
    console.log(`Sending message: ${messageId} from ${userId} to ${recipientId}`)
    
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
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 200 
      }
    )
  } catch (error) {
    console.error("Error in send-message function:", error)
    
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
