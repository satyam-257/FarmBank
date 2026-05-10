"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Wheat, Smartphone, ShieldCheck, Leaf, ArrowRight, MessageCircle, BarChart3, Satellite, Globe, Droplets, Banknote, Sun } from "lucide-react";

export default function Home() {
  const [lat, setLat] = useState<string>("");
  const [lng, setLng] = useState<string>("");
  const [satResult, setSatResult] = useState<any>(null);
  const [loadingSat, setLoadingSat] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistType, setWaitlistType] = useState("Farmer");
  const [waitlistStatus, setWaitlistStatus] = useState("");

  const handleSatelliteCheck = async () => {
    if (!lat || !lng) return;
    setLoadingSat(true);
    // Simulate Sentinel API call
    setTimeout(() => {
      setSatResult({
        ndvi: (Math.random() * 0.4 + 0.4).toFixed(2), // 0.4 to 0.8
        health: "Good",
        vegetation: "85%"
      });
      setLoadingSat(false);
    }, 1500);
  };

  const handleWaitlist = (e: any) => {
    e.preventDefault();
    setWaitlistStatus("Joined! We'll contact you soon.");
    setWaitlistEmail("");
  };

  // Simple animated counter effect
  const Counter = ({ end, suffix }: { end: number, suffix: string }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
      let start = 0;
      const duration = 2000;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start > end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }, [end]);
    return <span>{count}{suffix}</span>;
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-white pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-[#1B5E20] font-medium text-sm mb-6 border border-green-200">
                <Globe size={16} /> Built on India's AgriStack
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
                India's First Financial OS for Farmers
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-lg">
                Credit. Markets. Identity. All through WhatsApp. No smartphone needed — works on any phone.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/register" 
                  className="bg-[#1B5E20] hover:bg-[#2E7D32] text-white px-8 py-4 rounded-lg font-bold text-lg text-center transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  🌾 Create KisanID Free
                </Link>
                <a 
                  href="https://wa.me/918840098153?text=KISAN" 
                  target="_blank"
                  className="bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-4 rounded-lg font-bold text-lg text-center transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <MessageCircle size={24} /> WhatsApp Now
                </a>
              </div>
              <div className="mt-4">
                <a href="tel:+918840098153" className="text-gray-500 hover:text-[#1B5E20] font-medium flex items-center gap-2">
                  📞 Call +91 88400 98153
                </a>
              </div>
            </div>

            {/* Dashboard Mockup */}
            <div className="relative mx-auto w-full max-w-md lg:max-w-full">
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform lg:rotate-2 transition-transform hover:rotate-0 duration-500">
                <div className="bg-[#1B5E20] p-4 text-white flex justify-between items-center">
                  <div className="flex items-center gap-2 font-bold text-lg">
                    <Wheat size={20} /> FarmBank
                  </div>
                  <div className="text-xs bg-white/20 px-2 py-1 rounded">Ramesh Kumar</div>
                </div>
                <div className="p-6 bg-gray-50 space-y-4">
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">FarmScore</p>
                      <p className="text-3xl font-black text-[#1B5E20]">742</p>
                    </div>
                    <div className="bg-green-100 text-[#1B5E20] px-3 py-1 rounded-full text-sm font-bold">Excellent</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                      <p className="text-xs text-gray-500 uppercase font-bold">Loan Available</p>
                      <p className="text-xl font-bold text-gray-900 mt-1">₹75,000</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                      <p className="text-xs text-gray-500 uppercase font-bold">Listed Surplus</p>
                      <p className="text-xl font-bold text-gray-900 mt-1">2 Active</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center gap-3">
                    <Satellite className="text-blue-600" size={24} />
                    <div>
                      <p className="text-sm font-bold text-blue-900">Satellite Status</p>
                      <p className="text-xs text-blue-700">✅ Farm Verified • NDVI 0.64</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -z-10 top-1/2 right-0 transform translate-x-1/3 -translate-y-1/2 w-64 h-64 bg-[#F9A825] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
              <div className="absolute -z-10 top-0 left-0 transform -translate-x-1/4 translate-y-1/4 w-72 h-72 bg-[#1B5E20] rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Demo Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Phone Mockup */}
            <div className="relative mx-auto w-full max-w-[300px]">
              <div className="border-[12px] border-gray-900 rounded-[2.5rem] h-[600px] w-full bg-[#E5DDD5] overflow-hidden shadow-2xl relative">
                {/* Header */}
                <div className="bg-[#075E54] text-white p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <Wheat className="text-[#075E54]" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold">FarmBank Bot</h3>
                    <p className="text-xs opacity-80">online</p>
                  </div>
                </div>
                {/* Chat Area */}
                <div className="p-4 space-y-4 overflow-y-auto h-full pb-20">
                  <div className="flex justify-end">
                    <div className="bg-[#DCF8C6] p-2 rounded-lg rounded-tr-none shadow-sm max-w-[85%] text-sm">
                      KISAN
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[85%] text-sm">
                      <p>🌾 Namaste! FarmBank mein aapka swagat hai.</p>
                      <p className="mt-2 text-gray-600">Kya karna chahte hain?</p>
                      <div className="mt-2 space-y-1 font-mono text-xs">
                        <p>1️⃣ Naya KisanID banaye</p>
                        <p>2️⃣ Loan ke liye apply karein</p>
                        <p>3️⃣ Fasal beche (Marketplace)</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-[#DCF8C6] p-2 rounded-lg rounded-tr-none shadow-sm max-w-[85%] text-sm">
                      1
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-white p-2 rounded-lg rounded-tl-none shadow-sm max-w-[85%] text-sm">
                      Aapka poora naam kya hai?
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-[#DCF8C6] p-2 rounded-lg rounded-tr-none shadow-sm max-w-[85%] text-sm">
                      Ramesh Kumar
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Everything happens on WhatsApp.</h2>
              <p className="text-lg text-gray-600 mb-8">
                No apps to download. No complex menus. Farmers simply send "KISAN" to our WhatsApp number and our AI bot handles registration, loans, and selling surplus crop automatically in their local language.
              </p>
              <a 
                href="https://wa.me/918840098153?text=KISAN" 
                target="_blank"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#128C7E] transition-colors shadow-lg"
              >
                <MessageCircle size={24} /> Start This Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Numbers */}
      <section className="py-16 bg-[#1B5E20] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl md:text-5xl font-black text-[#F9A825] mb-2">
                <Counter end={8.4} suffix="Cr" />
              </p>
              <p className="text-sm md:text-base font-medium opacity-90">AgriStack Farmer IDs</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-black text-[#F9A825] mb-2">
                <Counter end={100} suffix="M+" />
              </p>
              <p className="text-sm md:text-base font-medium opacity-90">Farmers We Serve</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-black text-[#F9A825] mb-2">
                36%
              </p>
              <p className="text-sm md:text-base font-medium opacity-90">Moneylender Rate We Fight</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-black text-[#F9A825] mb-2">
                ₹1.5L Cr
              </p>
              <p className="text-sm md:text-base font-medium opacity-90">Food Waste Problem</p>
            </div>
          </div>
        </div>
      </section>

      {/* Satellite Demo Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Satellite className="w-16 h-16 text-[#1B5E20] mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            We Use NASA & ESA Satellites To Verify Your Farm
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
            Sentinel-2 satellite passes over every 5 days. We check your crop health, verify your land size, and update your FarmScore automatically. No physical visit required.
          </p>

          <div className="max-w-2xl mx-auto bg-gray-50 p-6 rounded-2xl border border-gray-200 text-left">
            <h3 className="font-bold text-gray-900 mb-4">Live Satellite Check Demo</h3>
            <div className="flex gap-4 mb-4">
              <input 
                type="text" 
                placeholder="Latitude (e.g. 26.8467)" 
                value={lat} 
                onChange={e => setLat(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-md"
              />
              <input 
                type="text" 
                placeholder="Longitude (e.g. 80.9462)" 
                value={lng} 
                onChange={e => setLng(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-md"
              />
              <button 
                onClick={handleSatelliteCheck}
                disabled={!lat || !lng || loadingSat}
                className="bg-[#1B5E20] text-white px-6 py-2 rounded-md font-medium hover:bg-[#2E7D32] disabled:opacity-50"
              >
                {loadingSat ? "Scanning..." : "Check"}
              </button>
            </div>

            {satResult && (
              <div className="bg-white p-4 rounded-xl border border-green-200 mt-4 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-gray-900">Analysis Result</span>
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">Live Data</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Crop Health</p>
                    <p className="text-lg font-bold text-[#1B5E20]">{satResult.health}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">NDVI Index</p>
                    <p className="text-lg font-bold text-gray-900">{satResult.ndvi}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Vegetation</p>
                    <p className="text-lg font-bold text-gray-900">{satResult.vegetation}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Zero Waste Marketplace Preview */}
      <section className="py-24 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Zero Waste Marketplace
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
            Ugly tomatoes? Excess onions? Don't let it rot. We connect farmers directly with industrial buyers who need processing-grade crops.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { icon: Droplets, name: "Juice Factories", color: "text-orange-500" },
              { icon: Leaf, name: "Animal Feed", color: "text-green-600" },
              { icon: Sun, name: "Biogas Plants", color: "text-yellow-600" },
              { icon: Banknote, name: "D2C Food Brands", color: "text-blue-600" }
            ].map((cat, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-3">
                <cat.icon className={`w-10 h-10 ${cat.color}`} />
                <span className="font-bold text-gray-900">{cat.name}</span>
              </div>
            ))}
          </div>

          <Link href="/marketplace" className="inline-block bg-[#F9A825] hover:bg-[#F57F17] text-gray-900 font-bold px-8 py-4 rounded-lg shadow-lg transition-colors">
            List Your Surplus Free
          </Link>
        </div>
      </section>

      {/* Waitlist Form */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Join the Waitlist</h2>
          <p className="text-gray-600 mb-8">Be the first to know when we launch in your district.</p>
          
          <form onSubmit={handleWaitlist} className="space-y-4 text-left">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                type="email" 
                required
                value={waitlistEmail}
                onChange={e => setWaitlistEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5E20] focus:border-[#1B5E20] outline-none" 
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">I am a</label>
              <select 
                value={waitlistType}
                onChange={e => setWaitlistType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5E20] focus:border-[#1B5E20] outline-none bg-white"
              >
                <option>Farmer</option>
                <option>Buyer / Company</option>
                <option>Investor</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-[#1B5E20] text-white font-bold py-3 rounded-lg hover:bg-[#2E7D32] transition-colors">
              Join Waitlist
            </button>
            {waitlistStatus && (
              <p className="text-green-600 text-center font-medium mt-2">{waitlistStatus}</p>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}
