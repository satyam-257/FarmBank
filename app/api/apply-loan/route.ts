import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');
const adminEmail = process.env.ADMIN_EMAIL || 'vaibhavadarsh07@gmail.com';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Quick validation (simplified for mockup)
    if (!body.fullName || !body.phone || !body.loanAmount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = getServiceSupabase();
    
    // Insert into DB
    const { error: dbError } = await supabase
      .from('loan_applications')
      .insert({
        full_name: body.fullName,
        phone: body.phone,
        crop_name: body.cropName,
        crop_quantity: parseFloat(body.quantity || '0'),
        crop_quantity_unit: body.quantityUnit,
        stored_location: body.storedLocation,
        loan_amount_requested: parseFloat(body.loanAmount),
        repayment_date: body.repaymentDate,
        purpose: body.purpose,
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
        subject: `💰 New Loan Application — ${body.fullName} — ₹${body.loanAmount}`,
        html: `
          <h2>New Harvest Credit Application</h2>
          <table border="1" cellpadding="5" cellspacing="0">
            <tr><td>Name</td><td>${body.fullName}</td></tr>
            <tr><td>Phone</td><td>${body.phone}</td></tr>
            <tr><td>Crop</td><td>${body.quantity} ${body.quantityUnit} of ${body.cropName}</td></tr>
            <tr><td>Location</td><td>${body.storedLocation}</td></tr>
            <tr><td>Amount Requested</td><td>₹${body.loanAmount}</td></tr>
            <tr><td>Purpose</td><td>${body.purpose}</td></tr>
            <tr><td>Repayment</td><td>${body.repaymentDate}</td></tr>
          </table>
          <br/>
          <a href="https://wa.me/91${body.phone}?text=Hi%20${encodeURIComponent(body.fullName)},%20your%20KisanFi%20loan%20application%20of%20₹${body.loanAmount}%20has%20been%20received" style="display:inline-block;padding:10px 20px;background:#25D366;color:white;text-decoration:none;border-radius:5px;">📱 WhatsApp Applicant Now</a>
        `
      });
    }

    return NextResponse.json({ success: true, message: 'Loan application submitted' });
    
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
