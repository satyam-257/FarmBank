import { getServiceSupabase } from '@/lib/supabase';

export const revalidate = 0;

export default async function UsersPage() {
  const supabase = getServiceSupabase();

  const { data: users } = await supabase
    .from('bot_users')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Users</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500 font-medium">
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Phone Number</th>
              <th className="px-6 py-4">Joined At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users?.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-gray-500">
                  {user.id}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {user.phone_number}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(user.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
            {(!users || users.length === 0) && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
