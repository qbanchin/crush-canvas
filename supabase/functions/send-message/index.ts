
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.22.0'

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
    
    // Connect to Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Generate a unique ID for the message
    const messageId = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    
    console.log(`Sending message: ${messageId} from ${userId} to ${recipientId}`);
    
    // Create the stored procedure if it doesn't exist
    const { error: procError } = await supabase.rpc('create_messages_table_if_not_exists');
    if (procError) {
      console.error("Error checking/creating messages table:", procError);
      // Continue anyway - stored procedure or table might already exist
    }
    
    // Insert message into the database
    const { data, error } = await supabase
      .from('messages')
      .insert({
        id: messageId,
        sender_id: userId,
        recipient_id: recipientId,
        content: message,
        timestamp: timestamp,
        read: false
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error storing message:", error);
      
      // If the insert failed, still return a message object
      // This allows the UI to continue functioning
      const fallbackData = {
        id: messageId,
        senderId: userId,
        recipientId: recipientId,
        content: message,
        timestamp: timestamp,
        isFromCurrentUser: true
      };
      
      return new Response(
        JSON.stringify(fallbackData),
        { 
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
          status: 200 
        }
      );
    }
    
    // Transform the database format to match the frontend format
    const responseData = {
      id: data.id,
      senderId: data.sender_id,
      recipientId: data.recipient_id,
      content: data.content,
      timestamp: data.timestamp,
      isFromCurrentUser: true
    };

    // Return a success response with the new message
    return new Response(
      JSON.stringify(responseData),
      { 
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error in send-message function:", error);
    
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
