import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendSurplusEmail } from '@/lib/email';
import { notifyAdmin, sendWatiSessionMessage } from '@/lib/wati';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    let farmerId = null;
    if (body.kisanId) {
      const { data: farmer } = await supabase
        .from('farmers')
        .select('id')
        .eq('kisan_id', body.kisanId)
        .single();
      if (farmer) farmerId = farmer.id;
    }

    const listingId = `LIST-${Date.now()}`;
    
    // Save to Supabase
    const { error } = await supabase
      .from('surplus_listings')
      .insert({
        listing_id: listingId,
        farmer_id: farmerId,
        full_name: body.fullName,
        phone: body.phone,
        state: body.state,
        district: body.district,
        location: body.village,
        crop_name: body.cropName,
        quantity: body.quantity,
        quantity_unit: body.quantityUnit,
        condition: body.condition,
        expected_price: body.expectedPrice ? parseFloat(body.expectedPrice) : null,
        description: body.description,
        status: 'active'
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Send WhatsApp to Farmer
    await sendWatiSessionMessage(
      body.phone, 
      `✅ Listing ho gayi.\nCrop: ${body.cropName} (${body.quantity}${body.quantityUnit})\n24 ghante mein buyer milega.`
    );

    // Send WhatsApp & Email to Admin
    await notifyAdmin(
      `🛒 NEW SURPLUS\nName: ${body.fullName}\nPhone: ${body.phone}\nCrop: ${body.cropName}\nQty: ${body.quantity}${body.quantityUnit}`
    );

    await sendSurplusEmail({
      full_name: body.fullName,
      phone: body.phone,
      crop_name: body.cropName,
      quantity: body.quantity,
      quantity_unit: body.quantityUnit,
      condition: body.condition,
      location: `${body.village}, ${body.district}`
    });

    return NextResponse.json({ success: true, listingId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
