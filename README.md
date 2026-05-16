# WhatsApp AI Chatbot Platform

A complete, production-ready WhatsApp AI chatbot platform built as a lightweight alternative to WATI. It uses Next.js 15, Supabase, Twilio/Meta API, and OpenAI.

## Features

- 📱 **WhatsApp Integration**: Receive and send messages via Twilio Sandbox or Meta Cloud API.
- 🧠 **AI Powered**: Integrated with OpenAI (`gpt-4o-mini`) with context memory.
- 💾 **Supabase Database**: Stores users, conversations, and messages.
- 📊 **Admin Dashboard**: Modern UI to view conversations, users, and platform stats.
- 💬 **Website Chat Widget**: Reusable floating chat widget that connects to the same AI logic.
- 🔌 **Provider Abstraction Layer**: Switch between Twilio and Meta without changing business logic.

---

## Getting Started

### 1. Database Setup (Supabase)

1. Create a new Supabase project at [database.new](https://database.new) (or use your existing one).
2. Go to the SQL Editor and paste the contents of `supabase/schema_bot.sql`.
3. Run the SQL to create the `bot_users`, `conversations`, and `messages` tables.
4. Get your `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` from Project Settings > API.

### 2. Environment Variables

Rename `.env.example` to `.env.local` and fill in the values:

```bash
WHATSAPP_PROVIDER=twilio
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Local Development & ngrok Setup

Since Twilio/Meta need to send webhooks to your local machine, you must use `ngrok`.

1. Start the Next.js app:
```bash
npm install
npm run dev
```

2. In a new terminal, start ngrok on port 3000:
```bash
ngrok http 3000
```

3. Note the HTTPS URL provided by ngrok (e.g., `https://abc-123.ngrok-free.app`).

### 4. Twilio Sandbox Setup

1. Go to Twilio Console > Messaging > Try it out > Send a WhatsApp message.
2. Under "Sandbox Settings", paste your ngrok URL + `/api/whatsapp` in the "WHEN A MESSAGE COMES IN" field:
   `https://abc-123.ngrok-free.app/api/whatsapp`
3. Save the settings.
4. Send a WhatsApp message to the sandbox number to start the AI conversation!

### 5. Meta Cloud API Migration Guide

When you are ready to switch from Twilio Sandbox to Meta Cloud API:

1. Go to [Meta for Developers](https://developers.facebook.com/) and create a WhatsApp Business app.
2. In your `.env.local`, change `WHATSAPP_PROVIDER=meta`.
3. Add your `META_ACCESS_TOKEN` and `META_PHONE_NUMBER_ID` from the Meta dashboard.
4. In the Meta dashboard under WhatsApp > Configuration, set your Webhook URL to:
   `https://your-domain.com/api/whatsapp`
5. The platform will automatically start using the Meta API for messaging!

---

## Deployment (Vercel)

1. Push your code to GitHub.
2. Go to [Vercel](https://vercel.com/) and import your repository.
3. Add all the Environment Variables from your `.env.local` to Vercel.
4. Click Deploy.
5. Update your Twilio/Meta Webhook URL to use your new Vercel production domain (e.g., `https://your-vercel-app.vercel.app/api/whatsapp`).

## API Flow

1. WhatsApp user sends a message.
2. Twilio/Meta triggers a POST request to `/api/whatsapp`.
3. The Provider Abstraction layer parses the payload into a standard format.
4. Supabase checks if the user exists, creates them if not.
5. Supabase fetches recent conversation history.
6. OpenAI generates a response based on the history and the system prompt.
7. The message is saved to Supabase.
8. The provider replies to the user (via TwiML or async API call).
