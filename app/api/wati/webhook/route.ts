import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendWatiSessionMessage, notifyAdmin } from '@/lib/wati';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("Webhook received");
    console.log(JSON.stringify(body, null, 2));

    // WATI webhook payload usually contains messages array
    const messages = body.messages || [body];

    for (const msg of messages) {
      if (msg.type !== 'text') continue;

      const phone = msg.from.replace(/^91/, ''); // Strip 91 prefix if present for our DB
      const text = msg.text.body.trim();
      const textUpper = text.toUpperCase();

      // Log conversation
      await supabase.from('whatsapp_logs').insert({
        phone: phone,
        direction: 'inbound',
        message: text,
        status: 'received'
      });

      // Fetch active session
      const { data: session } = await supabase
        .from('whatsapp_sessions')
        .select('*')
        .eq('phone', phone)
        .single();

      if (!session || session.current_step === 'DONE') {
        // Start a new session
        await supabase.from('whatsapp_sessions').upsert({
          phone: phone,
          current_step: 'PURPOSE',
          purpose: null,
          eligible: null,
          name: null,
          location: null,
          updated_at: new Date().toISOString()
        });
        
        const menu = `🌾 Welcome to FarmBank! How can we assist you today?\n1️⃣ Apply for a Loan\n2️⃣ Sell Crops\n3️⃣ Buy Insurance\n4️⃣ Other Support\n*(Reply with 1, 2, 3, or 4)*`;
        await sendWatiSessionMessage(phone, menu);
        continue;
      }

      // State Machine
      const { current_step } = session;

      if (current_step === 'PURPOSE') {
        let purposeText = 'Other';
        if (text === '1') purposeText = 'Loan';
        else if (text === '2') purposeText = 'Sell Crop';
        else if (text === '3') purposeText = 'Insurance';
        else purposeText = text; // allow them to type out purpose
        
        await supabase.from('whatsapp_sessions').update({
          purpose: purposeText,
          current_step: 'ELIGIBILITY',
          updated_at: new Date().toISOString()
        }).eq('phone', phone);

        await sendWatiSessionMessage(phone, "Great! To verify your eligibility, do you have your land's Khasra Number and Aadhaar Card ready? (Reply YES or NO)");
      }
      else if (current_step === 'ELIGIBILITY') {
        const isEligible = textUpper === 'YES' || textUpper === 'Y' || textUpper === 'HAAN';
        
        if (!isEligible) {
          await supabase.from('whatsapp_sessions').update({
            eligible: false,
            current_step: 'DONE',
            updated_at: new Date().toISOString()
          }).eq('phone', phone);
          
          await sendWatiSessionMessage(phone, "No problem. Our team will contact you to help you gather the necessary documents. Have a great day!");
          await notifyAdmin(`New Lead (Missing Docs):\nPhone: ${phone}\nPurpose: ${session.purpose}`);
        } else {
          await supabase.from('whatsapp_sessions').update({
            eligible: true,
            current_step: 'NAME',
            updated_at: new Date().toISOString()
          }).eq('phone', phone);
          
          await sendWatiSessionMessage(phone, "Excellent. Please reply with your *Full Name*:");
        }
      }
      else if (current_step === 'NAME') {
        await supabase.from('whatsapp_sessions').update({
          name: text,
          current_step: 'LOCATION',
          updated_at: new Date().toISOString()
        }).eq('phone', phone);
        
        await sendWatiSessionMessage(phone, "Thank you! Please reply with your *Village and District*:");
      }
      else if (current_step === 'LOCATION') {
        await supabase.from('whatsapp_sessions').update({
          location: text,
          current_step: 'DONE',
          updated_at: new Date().toISOString()
        }).eq('phone', phone);
        
        await sendWatiSessionMessage(phone, "Thank you for the details. Our team will call you shortly to assist you with the rest of your process! 📞");
        
        await notifyAdmin(`🚨 *New Complete Lead* 🚨\nName: ${session.name}\nPhone: ${phone}\nLocation: ${text}\nPurpose: ${session.purpose}\nEligible (Docs): Yes`);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("WATI Webhook Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
