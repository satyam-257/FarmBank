import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');
const adminEmail = process.env.ADMIN_EMAIL || 'vaibhavadarsh07@gmail.com';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    if (!body.fullName || !body.phone || !body.planSelected) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = getServiceSupabase();
    
    // Insert into DB
    const { error: dbError } = await supabase
      .from('insurance_applications')
      .insert({
        full_name: body.fullName,
        phone: body.phone,
        village: body.village,
        district: body.district,
        state: body.state,
        crop_name: body.cropName,
        land_size: parseFloat(body.landSize || '0'),
        plan_selected: body.planSelected,
        season: body.season,
        status: 'pending'
      })
      .select()
      .single();

    if (dbError && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://mock.supabase.co') {
      console.error("DB Error:", dbError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // Send Email
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'KisanFi Platform <onboarding@resend.dev>',
        to: adminEmail,
        subject: `🛡️ New Insurance Application — ${body.fullName} — ${body.planSelected}`,
        html: `
          <h2>New Crop Insurance Request</h2>
          <table border="1" cellpadding="5" cellspacing="0">
            <tr><td>Name</td><td>${body.fullName}</td></tr>
            <tr><td>Phone</td><td>${body.phone}</td></tr>
            <tr><td>Plan</td><td>${body.planSelected}</td></tr>
            <tr><td>Crop</td><td>${body.cropName} (${body.season})</td></tr>
            <tr><td>Land Size</td><td>${body.landSize} Acres</td></tr>
            <tr><td>Location</td><td>${body.village}, ${body.district}, ${body.state}</td></tr>
          </table>
          <br/>
          <a href="https://wa.me/91${body.phone}?text=Hi%20${encodeURIComponent(body.fullName)},%20your%20KisanFi%20insurance%20application%20for%20the%20${body.planSelected}%20plan%20is%20received." style="display:inline-block;padding:10px 20px;background:#25D366;color:white;text-decoration:none;border-radius:5px;">📱 WhatsApp Applicant Now</a>
        `
      });
    }

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
