"use client";

import { useState } from "react";

export default function LoanCalculator() {
  const [crop, setCrop] = useState("Wheat");
  const [quantity, setQuantity] = useState(100);
  const [currentPrice, setCurrentPrice] = useState(2500);
  const [futurePrice, setFuturePrice] = useState(3000);
  const [loanAmount, setLoanAmount] = useState(175000);

  const maxLoanAmount = quantity * currentPrice * 0.7;
  const currentTotal = quantity * currentPrice;
  const futureTotal = quantity * futurePrice;
  
  // 2% monthly for 8 weeks (2 months) = 4% total interest
  const interest = loanAmount * 0.04;
  
  const netFutureEarning = futureTotal - interest;
  const extraProfit = netFutureEarning - currentTotal;

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-green-100 flex flex-col md:flex-row">
      {/* Input Section */}
      <div className="p-8 bg-gray-50 flex-1 border-r border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Enter Your Details</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Crop</label>
            <select 
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full rounded-lg border-gray-300 border p-3 focus:ring-[#1B5E20] focus:border-[#1B5E20]"
            >
              <option value="Wheat">Wheat</option>
              <option value="Paddy">Paddy / Rice</option>
              <option value="Maize">Maize</option>
              <option value="Cotton">Cotton</option>
              <option value="Soyabean">Soyabean</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity (Quintals): <span className="font-bold text-[#1B5E20]">{quantity} qtl</span>
            </label>
            <input 
              type="range" 
              min="10" 
              max="500" 
              step="10"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full accent-[#1B5E20]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Today&apos;s Price / qtl</label>
              <input 
                type="number" 
                value={currentPrice}
                onChange={(e) => setCurrentPrice(Number(e.target.value))}
                className="w-full rounded-lg border-gray-300 border p-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected in 6 weeks</label>
              <input 
                type="number" 
                value={futurePrice}
                onChange={(e) => setFuturePrice(Number(e.target.value))}
                className="w-full rounded-lg border-gray-300 border p-3"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loan Amount Required: <span className="font-bold text-[#1B5E20]">₹{loanAmount.toLocaleString()}</span>
            </label>
            <input 
              type="range" 
              min="10000" 
              max={maxLoanAmount} 
              step="5000"
              value={Math.min(loanAmount, maxLoanAmount)}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full accent-[#F5B041]"
            />
            <p className="text-xs text-gray-500 mt-1">Max 70% of current value (₹{maxLoanAmount.toLocaleString()})</p>
          </div>
        </div>
      </div>

      {/* Result Section */}
      <div className="p-8 flex-1 bg-white flex flex-col justify-center">
        <h3 className="text-xl font-bold text-gray-800 mb-8 text-center">Your Estimated Earnings</h3>
        
        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center p-3 rounded-lg bg-red-50 text-red-900">
            <span>If you sell today:</span>
            <span className="font-bold">₹{currentTotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-lg bg-green-50 text-green-900">
            <span>If you wait 8 weeks with KisanFi:</span>
            <span className="font-bold">₹{futureTotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-lg border border-gray-200 text-gray-600 text-sm">
            <span>Loan interest (2% / mo for 2 mos):</span>
            <span className="font-medium">- ₹{interest.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-[#1B5E20] text-white p-6 rounded-xl text-center shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 bg-white opacity-10 rounded-full blur-xl"></div>
          <div className="absolute bottom-0 left-0 -ml-4 -mb-4 w-20 h-20 bg-[#F5B041] opacity-20 rounded-full blur-xl"></div>
          <p className="text-green-100 mb-1">Your extra profit 🎉</p>
          <h4 className="text-4xl font-black text-[#F5B041]">₹{extraProfit > 0 ? extraProfit.toLocaleString() : "0"}</h4>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-3">Ready to earn more this harvest?</p>
          <a 
            href="/apply-loan" 
            className="inline-block w-full bg-[#F5B041] hover:bg-[#F8C471] text-gray-900 font-bold py-4 px-8 rounded-xl transition-all hover:shadow-lg transform hover:-translate-y-1"
          >
            Apply for Harvest Loan →
          </a>
        </div>
      </div>
    </div>
  );
}
