import { NextRequest } from 'next/server';
import { getProvider } from '@/providers';
import { getServiceSupabase } from '@/lib/supabase';
import { generateAIResponse } from '@/lib/openai';

export async function POST(req: NextRequest) {
  const provider = getProvider();
  const supabase = getServiceSupabase();

  try {
    // 1. Parse the incoming request using the provider
    const parsedData = await provider.parseRequest(req);
    
    if (!parsedData) {
      return new Response('Bad Request or unsupported provider payload', { status: 400 });
    }

    const { from: phoneNumber, body: userMessage } = parsedData;

    // 2. Find or Create User
    let { data: user } = await supabase
      .from('bot_users')
      .select('id')
      .eq('phone_number', phoneNumber)
      .single();

    if (!user) {
      const { data: newUser, error: createError } = await supabase
        .from('bot_users')
        .insert([{ phone_number: phoneNumber }])
        .select()
        .single();
      
      if (createError) {
        console.error('Error creating user:', createError);
        return new Response('Internal Server Error', { status: 500 });
      }
      user = newUser;
    }

    // 3. Find or Create active Conversation (within last 24 hours, or just create new if you prefer long sessions. Here we just use latest or create new)
    // Find the latest conversation
    let { data: conversation } = await supabase
      .from('conversations')
      .select('id, last_message_at')
      .eq('user_id', user!.id)
      .order('last_message_at', { ascending: false })
      .limit(1)
      .single();

    // If no conversation or it's older than 24h, create a new one
    const isOldConversation = conversation ? 
      (new Date().getTime() - new Date(conversation.last_message_at).getTime()) > 24 * 60 * 60 * 1000 
      : false;

    if (!conversation || isOldConversation) {
      const { data: newConv, error: convError } = await supabase
        .from('conversations')
        .insert([{ user_id: user!.id }])
        .select()
        .single();

      if (convError) {
        console.error('Error creating conversation:', convError);
        return new Response('Internal Server Error', { status: 500 });
      }
      conversation = newConv;
    }

    // 4. Save incoming user message
    await supabase.from('messages').insert([{
      conversation_id: conversation!.id,
      user_id: user!.id,
      role: 'user',
      content: userMessage
    }]);

    // Update conversation last_message_at
    await supabase
      .from('conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', conversation!.id);

    // 5. Generate AI Response
    const aiResponse = await generateAIResponse(conversation!.id, userMessage);

    // 6. Save AI Response
    await supabase.from('messages').insert([{
      conversation_id: conversation!.id,
      user_id: user!.id,
      role: 'assistant',
      content: aiResponse
    }]);

    // Update conversation last_message_at again
    await supabase
      .from('conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', conversation!.id);

    // 7. If provider supports immediate webhook response (like Twilio TwiML), generate it
    // If it's Meta, we might need to call provider.sendMessage asynchronously and return 200 OK.
    
    // For MVP, if it's Twilio, generateWebhookResponse with message will do the job.
    // If it's Meta, generateWebhookResponse returns empty 200 OK, so we MUST call sendMessage
    if (process.env.WHATSAPP_PROVIDER === 'meta') {
       // Meta requires async send
       await provider.sendMessage(phoneNumber, aiResponse);
       return provider.generateWebhookResponse();
    } else {
       // Twilio can just reply in the TwiML
       return provider.generateWebhookResponse(aiResponse);
    }

  } catch (error) {
    console.error('Webhook error:', error);
    // Even on error, we should return a standard response so provider doesn't retry endlessly
    return new Response('Internal Server Error', { status: 500 });
  }
}
