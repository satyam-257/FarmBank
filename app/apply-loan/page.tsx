"use client";

import { useState } from "react";
import { Calculator, Wheat, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ApplyLoanPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Calculator State
  const [crop, setCrop] = useState("Wheat");
  const [qty, setQty] = useState(50);
  const [price, setPrice] = useState(2200);

  // Form State
  const [kisanId, setKisanId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loanAmount, setLoanAmount] = useState(50000);

  const cropValue = qty * price;
  const eligibleAmount = Math.floor(cropValue * 0.7);

  const mlInterest = Math.floor(loanAmount * 0.03 * 3); // 3% for 3 months
  const fbInterest = Math.floor(loanAmount * 0.02 * 3); // 2% for 3 months
  const savings = mlInterest - fbInterest;

  // Comparison
  const todayTotal = cropValue;
  const futureEstimated = Math.floor(cropValue * 1.35); // 35% historically
  const netProfit = futureEstimated - fbInterest;
  const extraEarning = netProfit - todayTotal;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch('/api/loans/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kisanId, fullName: name, phone, loanAmount, crop, cropQuantity: qty, cropValue
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed");

      toast.success("Application Submitted!");
      router.push(`/thank-you/loan?id=${data.applicationId}`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Harvest Loans at 2%</h1>
          <p className="text-lg text-gray-600">Don't sell your crop at throwaway prices today. Get a loan against your stored harvest and sell when prices rise.</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          
          {/* Eligibility Calculator (Sticky on desktop) */}
          <div className="lg:col-span-2 space-y-6 lg:sticky lg:top-32 h-fit">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <Calculator className="text-[#F9A825]" /> Eligibility Calculator
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Crop</label>
                  <select value={crop} onChange={e=>setCrop(e.target.value)} className="w-full border rounded-lg p-2 bg-gray-50">
                    <option>Wheat</option>
                    <option>Rice/Paddy</option>
                    <option>Soyabean</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Quantity (Qtl)</label>
                    <input type="number" value={qty} onChange={e=>setQty(Number(e.target.value))} className="w-full border rounded-lg p-2 bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Mandi Price</label>
                    <input type="number" value={price} onChange={e=>setPrice(Number(e.target.value))} className="w-full border rounded-lg p-2 bg-gray-50" />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Crop Value:</span>
                  <span className="font-bold text-lg">₹{cropValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg border border-green-200">
                  <span className="text-[#1B5E20] font-bold">Loan Eligible (70%):</span>
                  <span className="text-[#1B5E20] font-black text-xl">₹{eligibleAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 bg-[#1B5E20] text-white p-4 rounded-xl">
                <h3 className="font-bold mb-2">Live Market Comparison</h3>
                <p className="text-sm opacity-90 mb-1">If sold today: ₹{todayTotal.toLocaleString()}</p>
                <p className="text-sm opacity-90 mb-3">Estimated value in 3 mos: ₹{futureEstimated.toLocaleString()}</p>
                <div className="border-t border-white/20 pt-2">
                  <p className="font-bold text-[#F9A825]">EXTRA EARNING: ₹{extraEarning.toLocaleString()} 🎉</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Area */}
          <div className="lg:col-span-3">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200">
              
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 border-b pb-4">Check KisanID</h2>
                  <p className="text-gray-600 mb-6">Enter your FarmBank KisanID or registered Phone Number to proceed.</p>
                  
                  <div>
                    <input 
                      type="text" 
                      placeholder="e.g., FB-2024-123456 or 9876543210" 
                      className="w-full text-lg border rounded-xl p-4 bg-gray-50 focus:ring-2 focus:ring-[#1B5E20] outline-none"
                      value={kisanId}
                      onChange={e=>setKisanId(e.target.value)}
                    />
                  </div>
                  
                  <button 
                    onClick={() => {
                      if(kisanId) setStep(2);
                    }}
                    className="w-full bg-[#1B5E20] text-white py-4 rounded-xl font-bold text-lg"
                  >
                    Fetch My Details
                  </button>
                  
                  <div className="text-center pt-4">
                    <p className="text-sm text-gray-500">Don't have a KisanID?</p>
                    <button onClick={() => router.push('/register')} className="text-[#F9A825] font-bold mt-1">Create one for free →</button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in">
                  <h2 className="text-2xl font-bold text-gray-900 border-b pb-4">Loan Application</h2>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Full Name</label>
                      <input required type="text" className="w-full border rounded-lg p-3" value={name} onChange={e=>setName(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Phone</label>
                      <input required type="tel" className="w-full border rounded-lg p-3" value={phone} onChange={e=>setPhone(e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">How much loan do you need?</label>
                    <input 
                      type="range" 
                      min="10000" 
                      max={eligibleAmount || 100000} 
                      step="5000"
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1B5E20]"
                      value={loanAmount}
                      onChange={e=>setLoanAmount(Number(e.target.value))}
                    />
                    <div className="text-center mt-4">
                      <span className="text-4xl font-black text-[#1B5E20]">₹{loanAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-start gap-3">
                    <AlertCircle className="text-blue-500 mt-0.5 shrink-0" />
                    <div className="text-sm text-blue-900">
                      <p className="font-bold">Transparent Interest</p>
                      <p>You pay ₹{(loanAmount * 0.02).toLocaleString()} per month. Compared to a local moneylender (3%), you save ₹{(loanAmount * 0.01).toLocaleString()} every month!</p>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full bg-[#F9A825] hover:bg-[#F57F17] text-gray-900 py-4 rounded-xl font-bold text-lg transition-colors flex justify-center items-center gap-2 shadow-lg"
                  >
                    {submitting ? <Loader2 className="animate-spin" /> : "Submit Application"}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
