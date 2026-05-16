import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { generateAIResponse } from '@/lib/openai';

export async function POST(req: NextRequest) {
  const supabase = getServiceSupabase();

  try {
    const { message, sessionId } = await req.json();

    if (!message || !sessionId) {
      return NextResponse.json({ error: 'Missing message or sessionId' }, { status: 400 });
    }

    // Treat sessionId as phone number for web users (e.g. 'web-12345')
    const phoneNumber = `web-${sessionId}`;

    // 1. Find or Create User
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
      
      if (createError) throw createError;
      user = newUser;
    }

    // 2. Find or Create active Conversation
    let { data: conversation } = await supabase
      .from('conversations')
      .select('id, last_message_at')
      .eq('user_id', user!.id)
      .order('last_message_at', { ascending: false })
      .limit(1)
      .single();

    const isOldConversation = conversation ? 
      (new Date().getTime() - new Date(conversation.last_message_at).getTime()) > 24 * 60 * 60 * 1000 
      : false;

    if (!conversation || isOldConversation) {
      const { data: newConv, error: convError } = await supabase
        .from('conversations')
        .insert([{ user_id: user!.id }])
        .select()
        .single();

      if (convError) throw convError;
      conversation = newConv;
    }

    // 3. Save incoming user message
    await supabase.from('messages').insert([{
      conversation_id: conversation!.id,
      user_id: user!.id,
      role: 'user',
      content: message
    }]);

    await supabase
      .from('conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', conversation!.id);

    // 4. Generate AI Response
    const aiResponse = await generateAIResponse(conversation!.id, message);

    // 5. Save AI Response
    await supabase.from('messages').insert([{
      conversation_id: conversation!.id,
      user_id: user!.id,
      role: 'assistant',
      content: aiResponse
    }]);

    await supabase
      .from('conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', conversation!.id);

    return NextResponse.json({ reply: aiResponse });

  } catch (error) {
    console.error('Web Chat API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
