"use client";

import { useState } from "react";
import { Shield, Check, X, Info } from "lucide-react";
import toast from "react-hot-toast";

const plans = [
  {
    id: "Basic",
    name: "Drought Shield",
    price: 500,
    payout: 15000,
    features: ["Covers 1 season (Kharif or Rabi)", "GPS-verified automatic payout", "Direct to bank account"],
    notIncluded: ["Flood not covered", "Pest outbreak not covered", "Hailstorm not covered"],
    color: "bg-green-50 border-green-200",
    buttonColor: "bg-green-600 hover:bg-green-700",
    popular: false
  },
  {
    id: "Standard",
    name: "Standard Shield",
    price: 800,
    payout: 25000,
    features: ["Drought + Flood + Hailstorm", "Priority claim processing", "Crop price alert notifications", "Direct to bank account"],
    notIncluded: ["Pest outbreak not covered"],
    color: "bg-white border-[#F5B041] shadow-2xl scale-105",
    buttonColor: "bg-[#F5B041] hover:bg-[#F8C471] text-gray-900",
    popular: true
  },
  {
    id: "Full Shield",
    name: "Full Shield",
    price: 1200,
    payout: 40000,
    features: ["All weather risks covered", "Pest outbreak included", "Direct Vaibhav contact line", "Priority everything", "Direct to bank account"],
    notIncluded: [],
    color: "bg-blue-50 border-blue-200",
    buttonColor: "bg-blue-600 hover:bg-blue-700",
    popular: false
  }
];

export default function InsurancePage() {
  const [selectedPlan, setSelectedPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("Application Submitted Successfully!");
      window.location.href = "/thank-you/insurance";
    } catch (error) {
      console.error(error);
      toast.error("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex bg-white p-3 rounded-2xl shadow-sm mb-4">
            <Shield size={40} className="text-[#1B5E20]" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">Protect Your Crop</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Satellite-detected. Auto-payout in 48 hours. Zero paperwork.</p>
        </div>

        {/* Visual Flow */}
        <div className="hidden md:flex justify-center items-center gap-4 mb-16 max-w-4xl mx-auto">
          <div className="bg-white p-4 rounded-xl shadow-sm text-center flex-1 border border-gray-100">
            <p className="font-bold text-[#1B5E20]">1. Buy Coverage</p>
          </div>
          <div className="text-gray-400">→</div>
          <div className="bg-white p-4 rounded-xl shadow-sm text-center flex-1 border border-gray-100">
            <p className="font-bold text-[#1B5E20]">2. Satellite Monitors</p>
          </div>
          <div className="text-gray-400">→</div>
          <div className="bg-white p-4 rounded-xl shadow-sm text-center flex-1 border border-gray-100 bg-red-50">
            <p className="font-bold text-red-700">3. Disaster Detected</p>
          </div>
          <div className="text-gray-400">→</div>
          <div className="bg-[#1B5E20] text-white p-4 rounded-xl shadow-sm text-center flex-1">
            <p className="font-bold">4. Auto-Payout</p>
          </div>
        </div>

        {/* Plans */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 items-center mb-24 transition-all duration-500 ${selectedPlan ? 'hidden' : ''}`}>
          {plans.map((plan) => (
            <div key={plan.id} className={`rounded-3xl p-8 border-2 relative ${plan.color}`}>
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
                  MOST POPULAR
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-black">₹{plan.price}</span>
                <span className="text-gray-500"> / season</span>
              </div>
              <div className="bg-white/50 rounded-xl p-4 mb-6 border border-white/40">
                <p className="text-sm text-gray-500 mb-1">Guaranteed Payout</p>
                <p className="text-2xl font-black text-[#1B5E20]">₹{plan.payout.toLocaleString()}</p>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="text-green-500 shrink-0" size={20} />
                    <span className="text-sm font-medium text-gray-700">{feature}</span>
                  </li>
                ))}
                {plan.notIncluded.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 opacity-50">
                    <X className="text-red-500 shrink-0" size={20} />
                    <span className="text-sm font-medium text-gray-500 line-through">{feature}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => setSelectedPlan(plan.id)}
                className={`w-full py-4 rounded-xl font-bold text-white transition-all transform hover:-translate-y-1 ${plan.buttonColor}`}
              >
                Buy {plan.id} — ₹{plan.price}
              </button>
            </div>
          ))}
        </div>

        {/* Application Form */}
        {selectedPlan && (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="bg-[#1B5E20] text-white p-6 flex justify-between items-center">
              <div>
                <p className="text-green-100 text-sm">Selected Plan</p>
                <h2 className="text-2xl font-bold">{selectedPlan}</h2>
              </div>
              <button onClick={() => setSelectedPlan("")} className="text-green-200 hover:text-white underline text-sm">Change Plan</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                  <input required type="text" className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-[#1B5E20] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number *</label>
                  <input required type="tel" className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-[#1B5E20] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">KisanID (Optional)</label>
                  <input type="text" className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-[#1B5E20] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Crop Name *</label>
                  <input required type="text" className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-[#1B5E20] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Season *</label>
                  <select required className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-[#1B5E20] outline-none bg-white">
                    <option value="">Select Season</option>
                    <option value="Kharif">Kharif</option>
                    <option value="Rabi">Rabi</option>
                    <option value="Zaid">Zaid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Land Size (Acres) *</label>
                  <input required type="number" step="0.1" className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-[#1B5E20] outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Location (Village, District, State) *</label>
                  <input required type="text" className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-[#1B5E20] outline-none" />
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 mb-8 flex items-start gap-3">
                <Info className="text-[#F5B041] shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-900 font-medium">Payment: Vaibhav will personally call you within 2 hours to confirm your field location before collecting the premium payment.</p>
              </div>

              <button type="submit" disabled={loading} className={`w-full bg-[#1B5E20] text-white font-black py-4 rounded-xl text-lg transition-all ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#0A3810] hover:shadow-xl transform hover:-translate-y-1'}`}>
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
