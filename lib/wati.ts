export async function sendWatiTemplate(phone: string, templateName: string, parameters: {name: string, value: string}[]) {
  const endpoint = process.env.WATI_API_ENDPOINT;
  const token = process.env.WATI_ACCESS_TOKEN;

  if (!endpoint || !token) {
    console.warn("WATI credentials missing. Skipping WhatsApp template message.");
    return;
  }

  try {
    const response = await fetch(`${endpoint}/api/v1/sendTemplateMessage?whatsappNumber=91${phone}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        template_name: templateName,
        broadcast_name: templateName,
        parameters: parameters
      })
    });

    if (!response.ok) {
      console.error(`WATI Template Error: ${response.statusText}`);
    }
  } catch (error) {
    console.error("WATI Template Exception:", error);
  }
}

export async function sendWatiSessionMessage(phone: string, message: string) {
  const endpoint = process.env.WATI_API_ENDPOINT;
  const token = process.env.WATI_ACCESS_TOKEN;

  if (!endpoint || !token) {
    console.warn("WATI credentials missing. Skipping WhatsApp session message to: " + phone, "Message:", message);
    return;
  }

  try {
    const response = await fetch(`${endpoint}/api/v1/sendSessionMessage/91${phone}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message_text: message
      })
    });

    if (!response.ok) {
      console.error(`WATI Session Message Error: ${response.statusText}`);
    }
  } catch (error) {
    console.error("WATI Session Message Exception:", error);
  }
}

export async function notifyAdmin(message: string) {
  const adminPhone = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '8840098153';
  await sendWatiSessionMessage(adminPhone, message);
}
