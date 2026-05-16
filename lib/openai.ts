import OpenAI from 'openai';
import { getServiceSupabase } from './supabase';
import { MessageContext } from '@/types/bot';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

const SYSTEM_PROMPT = "You are a helpful AI assistant for FarmBank. Reply professionally, clearly, and briefly.";

export async function generateAIResponse(
  conversationId: string,
  userMessage: string
): Promise<string> {
  const supabase = getServiceSupabase();

  try {
    // 1. Fetch recent conversation history (last 10 messages to save tokens)
    const { data: historyData, error: historyError } = await supabase
      .from('messages')
      .select('role, content')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (historyError) {
      console.error('Error fetching conversation history:', historyError);
    }

    // Format history for OpenAI (reverse to chronological order)
    const formattedHistory = (historyData || [])
      .reverse()
      .map((msg) => ({
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content,
      }));

    // 2. Prepare messages payload
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...formattedHistory,
      { role: 'user', content: userMessage },
    ];

    // 3. Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      temperature: 0.7,
      max_tokens: 500, // keep it brief as per prompt
    });

    const aiMessage = completion.choices[0]?.message?.content;

    if (!aiMessage) {
      throw new Error('No message generated from OpenAI');
    }

    return aiMessage;
  } catch (error) {
    console.error('Error generating AI response:', error);
    return "I'm sorry, I'm having trouble processing your request right now. Please try again later.";
  }
}
