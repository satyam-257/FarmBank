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
      const text = msg.text.body.trim().toUpperCase();

      // Log conversation
      await supabase.from('whatsapp_logs').insert({
        phone: phone,
        direction: 'inbound',
        message: text,
        status: 'received'
      });

      // Simple Router
      if (text === 'KISAN') {
        const menu = `🌾 Namaste! FarmBank mein aapka swagat hai.\n\nKya karna chahte hain?\n1️⃣ Naya KisanID banaye\n2️⃣ Loan ke liye apply karein\n3️⃣ Fasal beche (Marketplace)\n4️⃣ Help (Vaibhav se baat karein)\n\nReply with 1, 2, 3, or 4`;
        await sendWatiSessionMessage(phone, menu);
      }
      else if (text === '1') {
        await sendWatiSessionMessage(phone, "Aapka poora naam kya hai?");
        // Note: Real state machine logic requires session state management (Redis or DB)
      }
      else if (text === '2') {
        await sendWatiSessionMessage(phone, "Loan ke liye, kripya apna KisanID likhein:");
      }
      else if (text === '3') {
        await sendWatiSessionMessage(phone, "Kaunsi fasal bechni hai? (Udharan: Tomato 500kg)");
      }
      else if (text === '4') {
        await sendWatiSessionMessage(phone, "Vaibhav jaldi hi aapko call karenge. Emergency ke liye: +91 8840098153 par call karein.");
      }
      else {
        // Forward unknown messages directly to Admin
        await notifyAdmin(`New message from ${phone}: ${text}`);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("WATI Webhook Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
