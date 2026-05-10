import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY || 're_mock');

export async function sendEmail({
  to,
  subject,
  html
}: {
  to: string | string[];
  subject: string;
  html: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY missing. Mocking email send to:", to);
    console.warn("Subject:", subject);
    return { id: "mock_id" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'FarmBank <noreply@resend.dev>', // Use verified domain in prod
      to: typeof to === 'string' ? [to] : to,
      subject,
      html,
    });

    if (error) {
      console.error("Resend Error:", error);
      return null;
    }
    return data;
  } catch (error) {
    console.error("Resend Exception:", error);
    return null;
  }
}

export async function sendRegistrationEmail(data: any) {
  const html = `
    <h2>New Farmer Registration: ${data.full_name}</h2>
    <table border="1" cellpadding="5" cellspacing="0">
      <tr><td>Name</td><td>${data.full_name}</td></tr>
      <tr><td>Phone</td><td>${data.phone}</td></tr>
      <tr><td>KisanID</td><td>${data.kisan_id}</td></tr>
      <tr><td>Location</td><td>${data.village}, ${data.district}, ${data.state}</td></tr>
    </table>
    <br/>
    <a href="https://wa.me/91${data.phone}">Contact Farmer on WhatsApp</a>
  `;
  return sendEmail({
    to: 'krishiyogi28@gmail.com',
    subject: `🌾 New Farmer — ${data.full_name} — ${data.kisan_id} — ${data.phone}`,
    html
  });
}

export async function sendLoanEmail(data: any) {
  const html = `
    <h2>New Loan Application: ${data.full_name}</h2>
    <table border="1" cellpadding="5" cellspacing="0">
      <tr><td>Name</td><td>${data.full_name}</td></tr>
      <tr><td>Phone</td><td>${data.phone}</td></tr>
      <tr><td>Amount</td><td>₹${data.loan_amount}</td></tr>
      <tr><td>Crop</td><td>${data.crop_name} (${data.crop_quantity} ${data.crop_unit})</td></tr>
    </table>
  `;
  return sendEmail({
    to: 'krishiyogi28@gmail.com',
    subject: `💰 LOAN APPLICATION — ${data.full_name} — ₹${data.loan_amount} — ${data.phone}`,
    html
  });
}

export async function sendSurplusEmail(data: any) {
  const html = `
    <h2>New Surplus Listing: ${data.crop_name}</h2>
    <table border="1" cellpadding="5" cellspacing="0">
      <tr><td>Crop</td><td>${data.crop_name}</td></tr>
      <tr><td>Quantity</td><td>${data.quantity} ${data.quantity_unit}</td></tr>
      <tr><td>Condition</td><td>${data.condition}</td></tr>
      <tr><td>Farmer Name</td><td>${data.full_name}</td></tr>
      <tr><td>Location</td><td>${data.location}</td></tr>
    </table>
    <br/>
    <a href="https://wa.me/91${data.phone}">Contact Farmer</a>
  `;
  return sendEmail({
    to: 'krishiyogi28@gmail.com', // changed from vaibhavadarsh07 per instructions context where krishiyogi28 is the admin email
    subject: `🛒 New Surplus — ${data.crop_name} — ${data.quantity}${data.quantity_unit} — ${data.location}`,
    html
  });
}
