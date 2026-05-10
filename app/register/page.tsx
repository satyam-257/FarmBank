"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Satellite, FileCheck, CheckCircle2, Loader2, ChevronRight, ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Data State
  const [formData, setFormData] = useState({
    fullName: "", phone: "", whatsapp: "", email: "", aadhaar: "",
    state: "", district: "", tehsil: "", village: "", pincode: "",
    latitude: "", longitude: "",
    khasraNumber: "", landSize: "", landUnit: "Acres", landOwnership: "Owned", primaryCrop: "", secondaryCrop: "", yearsFarming: "",
    landVerified: false
  });

  const [satelliteData, setSatelliteData] = useState<any>(null);
  const [soilData, setSoilData] = useState<any>(null);

  const updateForm = (key: string, val: any) => setFormData(prev => ({ ...prev, [key]: val }));

  const getLocation = () => {
    if (navigator.geolocation) {
      toast.loading("Getting location...", { id: "loc" });
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          updateForm('latitude', pos.coords.latitude.toString());
          updateForm('longitude', pos.coords.longitude.toString());
          toast.success("Location captured!", { id: "loc" });
        },
        (err) => {
          toast.error("Please enable location access.", { id: "loc" });
        }
      );
    } else {
      toast.error("Geolocation not supported");
    }
  };

  const handleSatelliteCheck = async () => {
    setLoading(true);
    // Simulate API calls
    await new Promise(r => setTimeout(r, 2000));
    setSatelliteData({ ndvi: 0.64, health: "Good", cropDetected: true });
    setSoilData({ soilHealthScore: 85, recommendations: ["Add organic matter"] });
    setLoading(false);
    setStep(5);
  };

  const submitRegistration = async () => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/farmers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          satelliteData,
          soilData
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Registration failed");

      toast.success("KisanID Created!");
      router.push(`/thank-you/register?kisanId=${data.kisanId}`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create your KisanID</h1>
        <p className="text-gray-600 mt-2">Step {step} of 5</p>
        <div className="flex gap-2 mt-4">
          {[1,2,3,4,5].map(i => (
            <div key={i} className={`h-2 flex-1 rounded-full ${step >= i ? 'bg-[#1B5E20]' : 'bg-gray-200'}`} />
          ))}
        </div>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200">
        
        {/* STEP 1: Personal */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Personal Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name *</label>
                <input required type="text" className="w-full border rounded-lg p-3" value={formData.fullName} onChange={e => updateForm('fullName', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number *</label>
                <input required type="tel" className="w-full border rounded-lg p-3" value={formData.phone} onChange={e => updateForm('phone', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">WhatsApp Number</label>
                <input type="tel" className="w-full border rounded-lg p-3" value={formData.whatsapp} onChange={e => updateForm('whatsapp', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Aadhaar Last 4 Digits</label>
                <input type="text" maxLength={4} className="w-full border rounded-lg p-3" value={formData.aadhaar} onChange={e => updateForm('aadhaar', e.target.value)} />
              </div>
            </div>
            <button onClick={() => setStep(2)} disabled={!formData.fullName || !formData.phone} className="w-full bg-[#1B5E20] text-white py-3 rounded-lg font-bold disabled:opacity-50 flex justify-center items-center gap-2">
              Next <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* STEP 2: Location */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Farm Location</h2>
            <button onClick={getLocation} className="w-full flex justify-center items-center gap-2 bg-blue-50 text-blue-700 py-3 rounded-lg border border-blue-200 hover:bg-blue-100 font-medium transition-colors">
              <MapPin size={18} /> Auto-detect GPS Location
            </button>
            {formData.latitude && <p className="text-xs text-center text-green-600">Location captured: {formData.latitude}, {formData.longitude}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">State *</label>
                <select required className="w-full border rounded-lg p-3" value={formData.state} onChange={e => updateForm('state', e.target.value)}>
                  <option value="">Select State</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Bihar">Bihar</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">District *</label>
                <input required type="text" className="w-full border rounded-lg p-3" value={formData.district} onChange={e => updateForm('district', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tehsil</label>
                <input type="text" className="w-full border rounded-lg p-3" value={formData.tehsil} onChange={e => updateForm('tehsil', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Village *</label>
                <input required type="text" className="w-full border rounded-lg p-3" value={formData.village} onChange={e => updateForm('village', e.target.value)} />
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="px-6 py-3 border rounded-lg"><ChevronLeft size={18} /></button>
              <button onClick={() => setStep(3)} disabled={!formData.state || !formData.district || !formData.village} className="flex-1 bg-[#1B5E20] text-white py-3 rounded-lg font-bold disabled:opacity-50 flex justify-center items-center gap-2">
                Next <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Farm Details */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Farm Details</h2>
            
            <div>
              <label className="block text-sm font-medium mb-1">Khasra Number</label>
              <input type="text" className="w-full border rounded-lg p-3 mb-2" value={formData.khasraNumber} onChange={e => updateForm('khasraNumber', e.target.value)} placeholder="Enter Khasra number" />
              {formData.khasraNumber && formData.state && (
                <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">Verify Land Record (Bhulekh)</p>
                  <a href={`https://upbhulekh.gov.in`} target="_blank" className="text-blue-600 text-sm hover:underline block mb-3">
                    Click here to verify on government portal →
                  </a>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={formData.landVerified} onChange={e => updateForm('landVerified', e.target.checked)} className="rounded text-[#1B5E20]" />
                    I verified my land record and the name matches.
                  </label>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Land Size</label>
                <input type="number" className="w-full border rounded-lg p-3" value={formData.landSize} onChange={e => updateForm('landSize', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Unit</label>
                <select className="w-full border rounded-lg p-3" value={formData.landUnit} onChange={e => updateForm('landUnit', e.target.value)}>
                  <option>Acres</option>
                  <option>Hectare</option>
                  <option>Bigha</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Primary Crop</label>
                <select className="w-full border rounded-lg p-3" value={formData.primaryCrop} onChange={e => updateForm('primaryCrop', e.target.value)}>
                  <option value="">Select Crop</option>
                  <option>Wheat</option>
                  <option>Rice/Paddy</option>
                  <option>Sugarcane</option>
                  <option>Cotton</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Years Farming</label>
                <input type="number" className="w-full border rounded-lg p-3" value={formData.yearsFarming} onChange={e => updateForm('yearsFarming', e.target.value)} />
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(2)} className="px-6 py-3 border rounded-lg"><ChevronLeft size={18} /></button>
              <button onClick={() => {
                if (formData.latitude) handleSatelliteCheck();
                else { setStep(4); }
              }} className="flex-1 bg-[#1B5E20] text-white py-3 rounded-lg font-bold flex justify-center items-center gap-2">
                Verify Satellite Data <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Satellite */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in text-center py-8">
            <Satellite className="w-16 h-16 text-[#1B5E20] mx-auto mb-4 animate-pulse" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyzing your farm...</h2>
            <p className="text-gray-600 mb-8">We are connecting to Sentinel-2 satellite to verify your crop health and soil data.</p>
            
            {loading ? (
              <div className="flex justify-center"><Loader2 className="w-8 h-8 text-[#F9A825] animate-spin" /></div>
            ) : (
              <button onClick={handleSatelliteCheck} className="bg-[#1B5E20] text-white px-8 py-3 rounded-lg font-bold">
                Run Satellite Scan
              </button>
            )}
          </div>
        )}

        {/* STEP 5: Review */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-xl font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
              <CheckCircle2 className="text-green-600" /> Review & Submit
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <p className="text-sm"><span className="text-gray-500">Name:</span> {formData.fullName}</p>
                <p className="text-sm"><span className="text-gray-500">Phone:</span> {formData.phone}</p>
                <p className="text-sm"><span className="text-gray-500">Location:</span> {formData.village}, {formData.district}</p>
                <p className="text-sm"><span className="text-gray-500">Farm:</span> {formData.landSize} {formData.landUnit} of {formData.primaryCrop}</p>
                <p className="text-sm"><span className="text-gray-500">Land Record:</span> {formData.landVerified ? "✅ Verified" : "Pending"}</p>
              </div>
              
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <h3 className="font-bold text-[#1B5E20] mb-2 flex items-center gap-2"><Satellite size={16}/> Satellite Report</h3>
                <p className="text-sm mb-1"><span className="text-gray-600">Crop Health:</span> {satelliteData?.health || "Good"}</p>
                <p className="text-sm mb-1"><span className="text-gray-600">NDVI:</span> {satelliteData?.ndvi || 0.64}</p>
                <p className="text-sm"><span className="text-gray-600">Soil Score:</span> {soilData?.soilHealthScore || 85}/100</p>
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t">
              <button onClick={() => setStep(3)} className="px-6 py-3 border rounded-lg"><ChevronLeft size={18} /></button>
              <button 
                onClick={submitRegistration} 
                disabled={submitting}
                className="flex-1 bg-[#F9A825] text-gray-900 py-3 rounded-lg font-bold disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {submitting ? <Loader2 className="animate-spin" /> : "Submit & Generate KisanID"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
