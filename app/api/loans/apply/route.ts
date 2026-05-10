import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendLoanEmail } from '@/lib/email';
import { sendWatiSessionMessage, notifyAdmin } from '@/lib/wati';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Check if farmer exists
    const { data: farmer, error: farmerError } = await supabase
      .from('farmers')
      .select('id')
      .eq('kisan_id', body.kisanId)
      .single();

    if (farmerError && body.kisanId) {
      console.warn("Farmer not found by KisanID, creating standalone loan app.");
    }

    const applicationId = `LOAN-${Date.now()}`;
    
    // Save to Supabase
    const { error } = await supabase
      .from('loan_applications')
      .insert({
        application_id: applicationId,
        farmer_id: farmer?.id || null,
        kisan_id: body.kisanId,
        full_name: body.fullName,
        phone: body.phone,
        crop_name: body.crop,
        crop_quantity: body.cropQuantity,
        crop_unit: 'Quintal',
        crop_value_estimate: body.cropValue,
        loan_amount: body.loanAmount,
        status: 'pending'
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Send WhatsApp to Farmer
    await sendWatiSessionMessage(
      body.phone, 
      `✅ Namaste ${body.fullName}!\nLoan application mili.\nApplication ID: ${applicationId}\nAmount: ₹${body.loanAmount}\nVaibhav 24 ghante mein review karenge.`
    );

    // Send WhatsApp to Admin
    await notifyAdmin(
      `💰 NEW LOAN APPLICATION\nName: ${body.fullName}\nPhone: ${body.phone}\nAmount: ₹${body.loanAmount}\nCrop: ${body.crop}\nKisanID: ${body.kisanId}\nReply to approve/reject`
    );

    // Send Email to Admin
    await sendLoanEmail({
      full_name: body.fullName,
      phone: body.phone,
      loan_amount: body.loanAmount,
      crop_name: body.crop,
      crop_quantity: body.cropQuantity,
      crop_unit: 'Quintal'
    });

    return NextResponse.json({ success: true, applicationId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
