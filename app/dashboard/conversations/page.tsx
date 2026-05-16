import { getServiceSupabase } from '@/lib/supabase';
import Link from 'next/link';

export const revalidate = 0;

export default async function ConversationsPage() {
  const supabase = getServiceSupabase();

  const { data: conversations } = await supabase
    .from('conversations')
    .select(`
      id,
      last_message_at,
      bot_users (
        phone_number
      ),
      messages (
        content
      )
    `)
    .order('last_message_at', { ascending: false });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Conversations</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500 font-medium">
              <th className="px-6 py-4">User (Phone)</th>
              <th className="px-6 py-4">Latest Activity</th>
              <th className="px-6 py-4">Messages Count</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {conversations?.map((conv) => (
              <tr key={conv.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {/* @ts-ignore */}
                  {conv.bot_users?.phone_number || 'Unknown'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(conv.last_message_at).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {conv.messages?.length || 0}
                </td>
                <td className="px-6 py-4">
                  {/* Since this is an MVP, we could just link to a detail view, but for now we'll just show the count.
                      In a full WATI clone, this would open a chat interface. */}
                  <span className="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer">
                    View
                  </span>
                </td>
              </tr>
            ))}
            {(!conversations || conversations.length === 0) && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No conversations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
