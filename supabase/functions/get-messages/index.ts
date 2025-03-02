
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

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
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    const body = await req.json()
    const { userId, recipientId } = body

    if (!userId || !recipientId) {
      return new Response(
        JSON.stringify({ error: 'User ID and recipient ID are required' }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          } 
        }
      )
    }

    console.log(`Fetching messages between ${userId} and ${recipientId}`)

    // This is a mock implementation for now
    // In a real app, you would query your messages table

    // Include more varied mock messages
    const mockMessages = [
      {
        id: '1',
        senderId: userId,
        recipientId: recipientId,
        content: 'Hey there! How are you?',
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
        isFromCurrentUser: true
      },
      {
        id: '2',
        senderId: recipientId,
        recipientId: userId,
        content: 'I\'m doing great! Your profile caught my attention.',
        timestamp: new Date(Date.now() - 43200000), // 12 hours ago
        isFromCurrentUser: false
      },
      {
        id: '3',
        senderId: userId,
        recipientId: recipientId,
        content: 'Thanks! I noticed we have some common interests. Would you like to chat more?',
        timestamp: new Date(Date.now() - 21600000), // 6 hours ago
        isFromCurrentUser: true
      },
      {
        id: '4',
        senderId: recipientId,
        recipientId: userId,
        content: 'Absolutely! I\'d love to know more about your hobbies.',
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        isFromCurrentUser: false
      }
    ]

    console.log(`Retrieved ${mockMessages.length} messages between ${userId} and ${recipientId}`)

    return new Response(
      JSON.stringify(mockMessages),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    )
  } catch (error) {
    console.error('Error:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    )
  }
})
