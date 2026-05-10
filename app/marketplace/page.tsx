"use client";

import { useState } from "react";
import { Upload, Leaf, ShieldCheck, MapPin, Search, ArrowRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState<"sell" | "buy">("sell");
  const [submitting, setSubmitting] = useState(false);

  // Listing Form State
  const [formData, setFormData] = useState({
    fullName: "", phone: "", kisanId: "",
    state: "", district: "", village: "",
    cropName: "Tomato", quantity: "", quantityUnit: "kg",
    condition: "Fresh Surplus", expectedPrice: "", description: ""
  });

  const updateForm = (k: string, v: any) => setFormData(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch('/api/marketplace/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed");

      toast.success("Listing created! We will match you with a buyer in 24 hours.");
      // Reset form
      setFormData({
        fullName: "", phone: "", kisanId: "", state: "", district: "", village: "",
        cropName: "Tomato", quantity: "", quantityUnit: "kg", condition: "Fresh Surplus", expectedPrice: "", description: ""
      });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Zero Waste Marketplace</h1>
          <p className="text-lg text-gray-600">Connecting farmers with factories, D2C brands, and biogas plants to ensure no crop goes to waste.</p>
        </div>

        {/* Custom Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-1 rounded-xl shadow-sm inline-flex border border-gray-200">
            <button 
              className={`px-8 py-3 rounded-lg font-bold transition-colors ${activeTab === 'sell' ? 'bg-[#1B5E20] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('sell')}
            >
              Sell Surplus
            </button>
            <button 
              className={`px-8 py-3 rounded-lg font-bold transition-colors ${activeTab === 'buy' ? 'bg-[#F9A825] text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('buy')}
            >
              Find Produce
            </button>
          </div>
        </div>

        {activeTab === 'sell' && (
          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-lg mb-4">How it works</h3>
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-[#1B5E20] font-bold">1</div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-gray-200 shadow-sm ml-4 md:ml-0">
                      <p className="font-bold text-gray-900">List Details</p>
                      <p className="text-sm text-gray-600">Tell us what you have and its condition.</p>
                    </div>
                  </div>
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-[#1B5E20] font-bold">2</div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-gray-200 shadow-sm ml-4 md:ml-0">
                      <p className="font-bold text-gray-900">We Match</p>
                      <p className="text-sm text-gray-600">We find factories or buyers in 24 hrs.</p>
                    </div>
                  </div>
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-[#1B5E20] font-bold">3</div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-gray-200 shadow-sm ml-4 md:ml-0">
                      <p className="font-bold text-gray-900">Get Paid</p>
                      <p className="text-sm text-gray-600">Buyer pays directly via UPI.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 border-b pb-4">Create Listing</h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-1">Farmer Name *</label><input required type="text" className="w-full border rounded-lg p-3 bg-gray-50" value={formData.fullName} onChange={e=>updateForm('fullName', e.target.value)}/></div>
                  <div><label className="block text-sm font-medium mb-1">Phone *</label><input required type="tel" className="w-full border rounded-lg p-3 bg-gray-50" value={formData.phone} onChange={e=>updateForm('phone', e.target.value)}/></div>
                </div>
                
                <div><label className="block text-sm font-medium mb-1">KisanID (Optional)</label><input type="text" className="w-full border rounded-lg p-3 bg-gray-50" value={formData.kisanId} onChange={e=>updateForm('kisanId', e.target.value)}/></div>

                <div className="grid md:grid-cols-3 gap-4 border-t pt-6">
                  <div><label className="block text-sm font-medium mb-1">State *</label><input required type="text" className="w-full border rounded-lg p-3 bg-gray-50" value={formData.state} onChange={e=>updateForm('state', e.target.value)}/></div>
                  <div><label className="block text-sm font-medium mb-1">District *</label><input required type="text" className="w-full border rounded-lg p-3 bg-gray-50" value={formData.district} onChange={e=>updateForm('district', e.target.value)}/></div>
                  <div><label className="block text-sm font-medium mb-1">Village *</label><input required type="text" className="w-full border rounded-lg p-3 bg-gray-50" value={formData.village} onChange={e=>updateForm('village', e.target.value)}/></div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 border-t pt-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Crop Type *</label>
                    <select className="w-full border rounded-lg p-3 bg-gray-50" value={formData.cropName} onChange={e=>updateForm('cropName', e.target.value)}>
                      <option>Tomato</option><option>Onion</option><option>Potato</option><option>Banana</option><option>Mango</option><option>Other</option>
                    </select>
                  </div>
                  <div><label className="block text-sm font-medium mb-1">Quantity *</label><input required type="number" className="w-full border rounded-lg p-3 bg-gray-50" value={formData.quantity} onChange={e=>updateForm('quantity', e.target.value)}/></div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Unit</label>
                    <select className="w-full border rounded-lg p-3 bg-gray-50" value={formData.quantityUnit} onChange={e=>updateForm('quantityUnit', e.target.value)}>
                      <option>kg</option><option>Quintal</option><option>Tons</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Condition *</label>
                  <select className="w-full border rounded-lg p-3 bg-gray-50" value={formData.condition} onChange={e=>updateForm('condition', e.target.value)}>
                    <option>🟢 Fresh Surplus — excess good quality</option>
                    <option>🟡 Near Expiry — 2-3 days shelf life</option>
                    <option>🟠 Ugly/Misshaped — odd shapes</option>
                    <option>🔴 Processing Grade — for factories only</option>
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Expected Price (Optional)</label>
                    <input type="number" placeholder="Leave blank to let buyers compete" className="w-full border rounded-lg p-3 bg-gray-50" value={formData.expectedPrice} onChange={e=>updateForm('expectedPrice', e.target.value)}/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Photo Upload</label>
                    <div className="w-full border border-dashed border-gray-300 rounded-lg p-3 bg-gray-50 text-center text-sm text-gray-500 cursor-pointer hover:bg-gray-100 flex items-center justify-center gap-2">
                      <Upload size={16} /> Click to upload
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full bg-[#1B5E20] hover:bg-[#2E7D32] text-white py-4 rounded-xl font-bold text-lg transition-colors flex justify-center items-center gap-2 shadow-lg mt-6"
                >
                  {submitting ? <Loader2 className="animate-spin" /> : "Submit Listing"}
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'buy' && (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-200 text-center max-w-2xl mx-auto">
            <Search className="w-16 h-16 text-[#F9A825] mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Are you a buyer?</h2>
            <p className="text-gray-600 mb-8">Whether you are a juice factory, animal feed producer, or a biogas plant, we can supply you with continuous raw material at the best prices directly from farmers.</p>
            <a 
              href="mailto:krishiyogi28@gmail.com" 
              className="inline-flex items-center gap-2 bg-[#F9A825] hover:bg-[#F57F17] text-gray-900 px-8 py-4 rounded-lg font-bold transition-colors shadow-sm"
            >
              Contact Sales Team
            </a>
          </div>
        )}

      </div>
    </div>
  );
}
