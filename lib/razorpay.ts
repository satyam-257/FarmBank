import crypto from 'crypto';

export async function createRazorpayOrder(amount: number, loanApplicationId: string, name: string) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    console.warn("Razorpay credentials missing. Mocking order.");
    return {
      id: "order_" + Math.random().toString(36).substring(7),
      amount: amount * 100,
      currency: "INR"
    };
  }

  try {
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: amount * 100, // Amount in paise
        currency: "INR",
        receipt: loanApplicationId,
        notes: {
          farmer_name: name,
          loan_id: loanApplicationId,
          purpose: "Loan Repayment FarmBank"
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Razorpay Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Razorpay Order Exception:", error);
    throw error;
  }
}

export function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) return true; // Bypass for mock

  const generatedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(orderId + '|' + paymentId)
    .digest('hex');
    
  return generatedSignature === signature;
}
