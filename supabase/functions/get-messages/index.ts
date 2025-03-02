
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

// Define CORS headers for browser requests
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
    // Get request body
    const { userId, recipientId } = await req.json()
    
    // Validate inputs
    if (!userId || !recipientId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Fetching messages between ${userId} and ${recipientId}`)

    // In a real app, you would query your messages table
    // For now, we'll return mock data that has better variety to test both sides of the conversation
    const mockMessages = [
      {
        id: '1',
        senderId: userId,
        recipientId: recipientId,
        content: 'Hey there! How are you doing?',
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      },
      {
        id: '2',
        senderId: recipientId,
        recipientId: userId,
        content: "I'm doing great! Thanks for asking. How about you?",
        timestamp: new Date(Date.now() - 85400000).toISOString(), // A bit later
      },
      {
        id: '3',
        senderId: userId,
        recipientId: recipientId,
        content: "I'm good! Just checking out this new app. The interface is nice.",
        timestamp: new Date(Date.now() - 84400000).toISOString(),
      },
      {
        id: '4',
        senderId: recipientId,
        recipientId: userId,
        content: "Yeah, it's pretty cool. Would you like to meet up sometime?",
        timestamp: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
      }
    ]
    
    return new Response(
      JSON.stringify(mockMessages),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
    
  } catch (error) {
    console.error('Error:', error)
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
