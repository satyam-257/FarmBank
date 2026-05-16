-- Bot Users
create table if not exists bot_users (
  id uuid default gen_random_uuid() primary key,
  phone_number text unique not null,
  created_at timestamptz default now()
);

-- Conversations
create table if not exists conversations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references bot_users(id) on delete cascade,
  last_message_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Messages
create table if not exists messages (
  id uuid default gen_random_uuid() primary key,
  conversation_id uuid references conversations(id) on delete cascade,
  user_id uuid references bot_users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamptz default now()
);

-- Indexes for performance
create index if not exists idx_bot_users_phone on bot_users(phone_number);
create index if not exists idx_conversations_user on conversations(user_id);
create index if not exists idx_messages_conversation on messages(conversation_id);
create index if not exists idx_messages_created on messages(created_at);

-- RLS Policies (assuming anonymous access for API routes through service role)
alter table bot_users enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;

-- If using service role key in API routes, RLS can be bypassed.
-- But we can add basic policies if needed.
create policy "Allow service role full access to bot_users" on bot_users using (true);
create policy "Allow service role full access to conversations" on conversations using (true);
create policy "Allow service role full access to messages" on messages using (true);
