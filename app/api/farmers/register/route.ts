import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendRegistrationEmail } from '@/lib/email';
import { sendWatiSessionMessage } from '@/lib/wati';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Generate KisanID
    const kisanId = `FB-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    
    // Save to Supabase
    const { data, error } = await supabase
      .from('farmers')
      .insert({
        kisan_id: kisanId,
        full_name: body.fullName,
        phone: body.phone,
        whatsapp: body.whatsapp || body.phone,
        email: body.email,
        aadhaar_last4: body.aadhaar,
        state: body.state,
        district: body.district,
        tehsil: body.tehsil,
        village: body.village,
        pincode: body.pincode,
        latitude: body.latitude ? parseFloat(body.latitude) : null,
        longitude: body.longitude ? parseFloat(body.longitude) : null,
        khasra_number: body.khasraNumber,
        land_size: body.landSize ? parseFloat(body.landSize) : null,
        land_unit: body.landUnit,
        land_ownership: body.landOwnership,
        primary_crop: body.primaryCrop,
        secondary_crop: body.secondaryCrop,
        years_farming: body.yearsFarming ? parseInt(body.yearsFarming) : null,
        land_verified: body.landVerified,
        satellite_data: body.satelliteData,
        soil_health_data: body.soilData,
        status: 'verified'
      })
      .select('id')
      .single();

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Call FarmScore calculation (async, no await to not block UI)
    fetch(`${req.headers.get('origin') || 'http://localhost:3000'}/api/farmers/score?id=${data.id}`).catch(console.error);

    // Send WhatsApp Welcome
    await sendWatiSessionMessage(
      body.phone, 
      `🌾 Namaste ${body.fullName}!\nAapka FarmBank KisanID ready hai: ${kisanId}\nVaibhav verification ke liye call karenge.\n+91 8840098153`
    );

    // Send Email to Admin
    await sendRegistrationEmail({
      full_name: body.fullName,
      phone: body.phone,
      kisan_id: kisanId,
      village: body.village,
      district: body.district,
      state: body.state
    });

    return NextResponse.json({ success: true, kisanId, id: data.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
