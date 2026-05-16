import { ReactNode } from 'react';
import Link from 'next/link';
import { MessageSquare, Users, Settings, LayoutDashboard } from 'lucide-react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <MessageSquare className="w-6 h-6 text-blue-600 mr-2" />
          <span className="text-xl font-bold">WatiClone</span>
        </div>
        <nav className="flex-1 py-4">
          <ul className="space-y-1">
            <li>
              <Link href="/dashboard" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-blue-600">
                <LayoutDashboard className="w-5 h-5 mr-3" />
                Overview
              </Link>
            </li>
            <li>
              <Link href="/dashboard/conversations" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-blue-600">
                <MessageSquare className="w-5 h-5 mr-3" />
                Conversations
              </Link>
            </li>
            <li>
              <Link href="/dashboard/users" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-blue-600">
                <Users className="w-5 h-5 mr-3" />
                Users
              </Link>
            </li>
            <li>
              <Link href="/dashboard/settings" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-blue-600">
                <Settings className="w-5 h-5 mr-3" />
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
             <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                A
             </div>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
