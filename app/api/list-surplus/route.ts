import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');
const adminEmail = process.env.ADMIN_EMAIL || 'vaibhavadarsh07@gmail.com';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    if (!body.fullName || !body.phone || !body.cropName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = getServiceSupabase();
    
    const { error: dbError } = await supabase
      .from('surplus_listings')
      .insert({
        full_name: body.fullName,
        phone: body.phone,
        location: body.location,
        crop_name: body.cropName,
        quantity: parseFloat(body.quantity || '0'),
        quantity_unit: body.quantityUnit,
        condition: body.condition,
        expected_price: body.expectedPrice ? parseFloat(body.expectedPrice) : null,
        description: body.description,
        status: 'active'
      })
      .select()
      .single();

    if (dbError && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://mock.supabase.co') {
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'KisanFi Marketplace <onboarding@resend.dev>',
        to: adminEmail,
        subject: `📦 New Surplus Listing — ${body.cropName} from ${body.location}`,
        html: `
          <h2>New Surplus Produce Listed</h2>
          <table border="1" cellpadding="5" cellspacing="0">
            <tr><td>Name</td><td>${body.fullName}</td></tr>
            <tr><td>Phone</td><td>${body.phone}</td></tr>
            <tr><td>Location</td><td>${body.location}</td></tr>
            <tr><td>Crop</td><td>${body.cropName}</td></tr>
            <tr><td>Quantity</td><td>${body.quantity} ${body.quantityUnit}</td></tr>
            <tr><td>Condition</td><td>${body.condition}</td></tr>
            <tr><td>Expected Price</td><td>₹${body.expectedPrice}/kg</td></tr>
            <tr><td>Notes</td><td>${body.description}</td></tr>
          </table>
          <br/>
          <a href="https://wa.me/91${body.phone}?text=Hi%20${encodeURIComponent(body.fullName)},%20I%20saw%20your%20${body.cropName}%20listing%20on%20KisanFi" style="display:inline-block;padding:10px 20px;background:#25D366;color:white;text-decoration:none;border-radius:5px;">📱 WhatsApp Farmer Now</a>
        `
      });
    }

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
