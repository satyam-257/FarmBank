import { getServiceSupabase } from '@/lib/supabase';
import { Users, MessageSquare, Activity, MessageCircle } from 'lucide-react';

export const revalidate = 0; // Disable caching for dashboard data

export default async function DashboardOverview() {
  const supabase = getServiceSupabase();

  // Fetch counts
  const [{ count: usersCount }, { count: convCount }, { count: msgCount }] = await Promise.all([
    supabase.from('bot_users').select('*', { count: 'exact', head: true }),
    supabase.from('conversations').select('*', { count: 'exact', head: true }),
    supabase.from('messages').select('*', { count: 'exact', head: true }),
  ]);

  // Fetch recent messages
  const { data: recentMessages } = await supabase
    .from('messages')
    .select('id, role, content, created_at, bot_users(phone_number)')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Platform Overview</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mr-4">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">{usersCount || 0}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mr-4">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Conversations</p>
            <p className="text-2xl font-bold text-gray-900">{convCount || 0}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mr-4">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Messages</p>
            <p className="text-2xl font-bold text-gray-900">{msgCount || 0}</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center">
          <Activity className="w-5 h-5 text-gray-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Recent Messages</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {recentMessages?.map((msg) => (
            <div key={msg.id} className="p-6 flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm text-gray-900">
                  {/* @ts-ignore - Supabase join typings */}
                  {msg.bot_users?.phone_number || 'Unknown'}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(msg.created_at).toLocaleString()}
                </span>
              </div>
              <div className={`p-3 rounded-lg text-sm max-w-[80%] ${
                msg.role === 'user' 
                  ? 'bg-gray-100 text-gray-800' 
                  : 'bg-blue-50 text-blue-800 ml-auto'
              }`}>
                {msg.role === 'assistant' && <span className="font-bold mr-2">AI:</span>}
                {msg.content}
              </div>
            </div>
          ))}
          {(!recentMessages || recentMessages.length === 0) && (
            <div className="p-6 text-center text-gray-500">
              No recent messages.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
