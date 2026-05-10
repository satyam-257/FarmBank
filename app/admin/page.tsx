"use client";

import { useState } from "react";
import { Lock, LayoutDashboard, FileText, IndianRupee, Shield, Store } from "lucide-react";

// Mock Data
const mockLoans = [
  { id: "LOAN-2025-001", name: "Ramesh Kumar", crop: "Wheat", amount: "₹1,40,000", date: "Oct 24, 2025", status: "pending" },
  { id: "LOAN-2025-002", name: "Sunita Devi", crop: "Tomato", amount: "₹45,000", date: "Oct 23, 2025", status: "approved" },
  { id: "LOAN-2025-003", name: "Suresh Patel", crop: "Cotton", amount: "₹2,10,000", date: "Oct 22, 2025", status: "rejected" },
];

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("loans");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "kisanfi2025") {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center">
          <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#1B5E20]">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-500 mb-8">Enter password to access applications.</p>
          
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl p-4 text-center tracking-widest focus:border-[#1B5E20] outline-none mb-6"
              placeholder="••••••••"
            />
            <button type="submit" className="w-full bg-[#1B5E20] text-white font-bold py-4 rounded-xl hover:bg-[#0A3810] transition-colors">
              Access Dashboard
            </button>
          </form>
          <p className="mt-6 text-xs text-gray-400">Password: kisanfi2025</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-[#1B5E20] text-white flex-shrink-0 md:min-h-screen p-6">
        <div className="flex items-center gap-2 mb-10">
          <LayoutDashboard />
          <span className="font-bold text-xl">Admin Panel</span>
        </div>
        
        <nav className="space-y-2">
          {[
            { id: "loans", name: "Loan Applications", icon: <IndianRupee size={18} /> },
            { id: "farmers", name: "Farm Registrations", icon: <FileText size={18} /> },
            { id: "insurance", name: "Insurance", icon: <Shield size={18} /> },
            { id: "surplus", name: "Surplus Listings", icon: <Store size={18} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === tab.id ? 'bg-[#F5B041] text-gray-900 font-bold' : 'hover:bg-white/10 text-green-100'}`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-black text-gray-900 capitalize">{activeTab}</h2>
            <p className="text-gray-500">Welcome back, Vaibhav.</p>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="text-gray-500 hover:text-gray-900 font-medium">
            Logout
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {activeTab === "loans" ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="p-4 font-bold text-gray-600 text-sm">Application ID</th>
                    <th className="p-4 font-bold text-gray-600 text-sm">Applicant</th>
                    <th className="p-4 font-bold text-gray-600 text-sm">Crop</th>
                    <th className="p-4 font-bold text-gray-600 text-sm">Amount Requested</th>
                    <th className="p-4 font-bold text-gray-600 text-sm">Date</th>
                    <th className="p-4 font-bold text-gray-600 text-sm">Status</th>
                    <th className="p-4 font-bold text-gray-600 text-sm text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mockLoans.map((loan, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-sm font-medium text-gray-900">{loan.id}</td>
                      <td className="p-4 text-sm text-gray-600">{loan.name}</td>
                      <td className="p-4 text-sm text-gray-600">{loan.crop}</td>
                      <td className="p-4 font-bold text-[#1B5E20]">{loan.amount}</td>
                      <td className="p-4 text-sm text-gray-500">{loan.date}</td>
                      <td className="p-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                          loan.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          loan.status === 'approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {loan.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button className="text-[#1B5E20] font-bold text-sm hover:underline">Review</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500">
              <FileText className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-lg">No records found for {activeTab} yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
