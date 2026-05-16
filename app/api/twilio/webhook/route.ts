import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { normalizeWhatsAppPhone, notifyAdminTwilio } from '@/lib/twilio';

function twiml(message?: string) {
  const body = message ? `<Message>${escapeXml(message)}</Message>` : '';
  return new NextResponse(`<Response>${body}</Response>`, {
    headers: {
      'Content-Type': 'text/xml',
    },
  });
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const from = String(formData.get('From') || '');
    const text = String(formData.get('Body') || '').trim();
    const phone = normalizeWhatsAppPhone(from);
    const textUpper = text.toUpperCase();

    if (!phone || !text) {
      return twiml('Please send a text message to continue with FarmBank.');
    }

    await supabase.from('whatsapp_logs').insert({
      phone,
      direction: 'inbound',
      message: text,
      status: 'received_twilio',
    });

    const { data: session } = await supabase
      .from('whatsapp_sessions')
      .select('*')
      .eq('phone', phone)
      .single();

    if (!session || session.current_step === 'DONE') {
      await supabase.from('whatsapp_sessions').upsert({
        phone,
        current_step: 'PURPOSE',
        purpose: null,
        eligible: null,
        name: null,
        location: null,
        updated_at: new Date().toISOString(),
      });

      return twiml(
        'Welcome to FarmBank! How can we assist you today?\n1. Apply for a Loan\n2. Sell Crops\n3. Buy Insurance\n4. Other Support\nReply with 1, 2, 3, or 4.'
      );
    }

    if (session.current_step === 'PURPOSE') {
      let purposeText = 'Other';
      if (text === '1') purposeText = 'Loan';
      else if (text === '2') purposeText = 'Sell Crop';
      else if (text === '3') purposeText = 'Insurance';
      else if (text === '4') purposeText = 'Other Support';
      else purposeText = text;

      await supabase.from('whatsapp_sessions').update({
        purpose: purposeText,
        current_step: 'ELIGIBILITY',
        updated_at: new Date().toISOString(),
      }).eq('phone', phone);

      return twiml("Great! To verify your eligibility, do you have your land's Khasra Number and Aadhaar Card ready? Reply YES or NO.");
    }

    if (session.current_step === 'ELIGIBILITY') {
      const isEligible = textUpper === 'YES' || textUpper === 'Y' || textUpper === 'HAAN';

      if (!isEligible) {
        await supabase.from('whatsapp_sessions').update({
          eligible: false,
          current_step: 'DONE',
          updated_at: new Date().toISOString(),
        }).eq('phone', phone);

        await notifyAdminTwilio(`New Lead (Missing Docs):\nPhone: ${phone}\nPurpose: ${session.purpose}`);
        return twiml('No problem. Our team will contact you to help you gather the necessary documents. Have a great day!');
      }

      await supabase.from('whatsapp_sessions').update({
        eligible: true,
        current_step: 'NAME',
        updated_at: new Date().toISOString(),
      }).eq('phone', phone);

      return twiml('Excellent. Please reply with your Full Name:');
    }

    if (session.current_step === 'NAME') {
      await supabase.from('whatsapp_sessions').update({
        name: text,
        current_step: 'LOCATION',
        updated_at: new Date().toISOString(),
      }).eq('phone', phone);

      return twiml('Thank you! Please reply with your Village and District:');
    }

    if (session.current_step === 'LOCATION') {
      await supabase.from('whatsapp_sessions').update({
        location: text,
        current_step: 'DONE',
        updated_at: new Date().toISOString(),
      }).eq('phone', phone);

      await notifyAdminTwilio(`New Complete Lead\nName: ${session.name}\nPhone: ${phone}\nLocation: ${text}\nPurpose: ${session.purpose}\nEligible (Docs): Yes`);

      return twiml('Thank you for the details. Our team will call you shortly to assist you with the rest of your process!');
    }

    return twiml('Please reply with KISAN to start again.');
  } catch (err: unknown) {
    console.error('Twilio Webhook Error:', err);
    const message = err instanceof Error ? err.message : 'Unexpected Twilio webhook error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
