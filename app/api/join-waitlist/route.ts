import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');
const adminEmail = process.env.ADMIN_EMAIL || 'vaibhavadarsh07@gmail.com';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    if (!body.name || !body.phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = getServiceSupabase();
    
    const { error: dbError } = await supabase
      .from('waitlist')
      .insert({
        full_name: body.name,
        phone: body.phone,
        email: body.email,
        user_type: body.type,
        state: body.state,
      })
      .select()
      .single();

    if (dbError && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://mock.supabase.co') {
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'KisanFi Waitlist <onboarding@resend.dev>',
        to: adminEmail,
        subject: `✨ New KisanFi Waitlist — ${body.name} (${body.type})`,
        html: `
          <h2>New Waitlist Signup</h2>
          <p><strong>Name:</strong> ${body.name}</p>
          <p><strong>Phone:</strong> ${body.phone}</p>
          <p><strong>Email:</strong> ${body.email || 'N/A'}</p>
          <p><strong>Type:</strong> ${body.type}</p>
          <p><strong>State:</strong> ${body.state}</p>
          <br/>
          <a href="https://wa.me/91${body.phone}?text=Hi%20${encodeURIComponent(body.name)},%20welcome%20to%20KisanFi!%20I'm%20Vaibhav,%20the%20founder." style="display:inline-block;padding:10px 20px;background:#25D366;color:white;text-decoration:none;border-radius:5px;">📱 Welcome WhatsApp</a>
        `
      });
    }

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
