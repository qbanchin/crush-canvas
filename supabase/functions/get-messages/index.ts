
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.22.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log("Hello from Get Messages Function!")

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
    
    // Connect to Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log(`Getting messages between ${userId} and ${recipientId}`);
    
    // Create the stored procedure if it doesn't exist
    const { error: procError } = await supabase.rpc('create_messages_table_if_not_exists');
    if (procError) {
      console.error("Error checking/creating messages table:", procError);
      // Continue anyway - stored procedure or table might already exist
    }
    
    // Get messages between these two users (in both directions)
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
      .or(`sender_id.eq.${recipientId},recipient_id.eq.${recipientId}`)
      .order('timestamp', { ascending: true });
    
    if (error) {
      console.error("Error retrieving messages:", error);
      
      // Return empty array if there's an error
      return new Response(
        JSON.stringify([]),
        { 
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
          status: 200 
        }
      );
    }
    
    // Filter for only messages between these two users
    const filteredMessages = messages.filter(msg => 
      (msg.sender_id === userId && msg.recipient_id === recipientId) ||
      (msg.sender_id === recipientId && msg.recipient_id === userId)
    );
    
    // Transform the database format to match the frontend format
    const responseData = filteredMessages.map(msg => ({
      id: msg.id,
      senderId: msg.sender_id,
      recipientId: msg.recipient_id,
      content: msg.content,
      timestamp: msg.timestamp
    }));

    // Return the messages
    return new Response(
      JSON.stringify(responseData),
      { 
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error in get-messages function:", error);
    
    // Handle errors
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 500 
      }
    );
  }
});
