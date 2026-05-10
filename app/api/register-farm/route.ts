import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServiceSupabase } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');
const adminEmail = process.env.ADMIN_EMAIL || 'vaibhavadarsh07@gmail.com';

const schema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(10),
  whatsapp: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  state: z.string().min(2),
  district: z.string().min(2),
  village: z.string().min(2),
  pincode: z.string().min(6),
  landSize: z.string(),
  landUnit: z.string(),
  landOwnership: z.string(),
  primaryCrop: z.string().min(2),
  secondaryCrop: z.string().optional(),
  yearsFarming: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate
    const validatedData = schema.parse(body);
    
    // Generate KisanID
    const kisanId = `KF-2025-${Math.floor(100000 + Math.random() * 900000)}`;

    const supabase = getServiceSupabase();
    
    // Insert into DB
    const { error: dbError } = await supabase
      .from('farm_registrations')
      .insert({
        full_name: validatedData.fullName,
        phone: validatedData.phone,
        whatsapp: validatedData.whatsapp,
        email: validatedData.email,
        village: validatedData.village,
        district: validatedData.district,
        state: validatedData.state,
        land_size: parseFloat(validatedData.landSize),
        land_unit: validatedData.landUnit,
        primary_crop: validatedData.primaryCrop,
        secondary_crop: validatedData.secondaryCrop,
        land_ownership: validatedData.landOwnership,
        kisan_id: kisanId,
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
        from: 'KisanFi Platform <onboarding@resend.dev>', // Use verified domain in prod
        to: adminEmail,
        subject: `🌾 New KisanID Registration — ${validatedData.fullName} — ${validatedData.phone}`,
        html: `
          <h2>New KisanID Registration</h2>
          <p><strong>KisanID:</strong> ${kisanId}</p>
          <table border="1" cellpadding="5" cellspacing="0">
            <tr><td>Name</td><td>${validatedData.fullName}</td></tr>
            <tr><td>Phone</td><td>${validatedData.phone}</td></tr>
            <tr><td>Location</td><td>${validatedData.village}, ${validatedData.district}, ${validatedData.state}</td></tr>
            <tr><td>Land</td><td>${validatedData.landSize} ${validatedData.landUnit} (${validatedData.landOwnership})</td></tr>
            <tr><td>Crop</td><td>${validatedData.primaryCrop}</td></tr>
          </table>
          <br/>
          <a href="https://wa.me/91${validatedData.phone}" style="display:inline-block;padding:10px 20px;background:#25D366;color:white;text-decoration:none;border-radius:5px;">📱 WhatsApp Farmer Now</a>
        `
      });
    }

    return NextResponse.json({ success: true, kisanId });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
