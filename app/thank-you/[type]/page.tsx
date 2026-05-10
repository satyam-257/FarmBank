"use client";

import { use } from "react";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function ThankYouPage({ params }: { params: Promise<{ type: string }> }) {
  const resolvedParams = use(params);
  const type = resolvedParams.type;
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const contentMap: Record<string, { title: string, desc: string, idPrefix?: string, nextLinks: { label: string, href: string }[] }> = {
    registration: {
      title: "KisanID Created! 🎉",
      desc: "Vaibhav will WhatsApp you within 2 hours to verify your registration.",
      idPrefix: "Your KisanID: ",
      nextLinks: [
        { label: "Apply for Harvest Loan", href: "/apply-loan" },
        { label: "Buy Crop Insurance", href: "/insurance" },
        { label: "List Surplus Produce", href: "/marketplace" },
      ]
    },
    loan: {
      title: "Application Received! ✅",
      desc: "Vaibhav will review your application and WhatsApp you within 24 hours with the decision.",
      idPrefix: "Application ID: ",
      nextLinks: [
        { label: "Buy Crop Insurance", href: "/insurance" },
        { label: "Back to Home", href: "/" },
      ]
    },
    insurance: {
      title: "Insurance Request Sent! 🛡️",
      desc: "Vaibhav will personally call you within 2 hours to confirm your field location before collecting the premium payment.",
      nextLinks: [
        { label: "Apply for Harvest Loan", href: "/apply-loan" },
        { label: "Back to Home", href: "/" },
      ]
    },
    marketplace: {
      title: "Surplus Listed! 📦",
      desc: "We will match you with a buyer in 24 hours. Keep your phone handy.",
      nextLinks: [
        { label: "List Another Crop", href: "/marketplace" },
        { label: "Back to Home", href: "/" },
      ]
    },
    waitlist: {
      title: "You're on the list! ✨",
      desc: "Welcome to KisanFi. We will contact you soon.",
      nextLinks: [
        { label: "Back to Home", href: "/" },
      ]
    }
  };

  const content = contentMap[type] || contentMap.waitlist;

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-xl w-full bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 text-center relative overflow-hidden">
        
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full blur-3xl opacity-50 -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-100 rounded-full blur-3xl opacity-50 -ml-10 -mb-10"></div>
        
        <div className="relative z-10">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-white shadow-sm">
            <CheckCircle className="text-[#1B5E20] w-10 h-10" />
          </div>
          
          <h1 className="text-3xl font-black text-gray-900 mb-4">{content.title}</h1>
          
          {id && content.idPrefix && (
            <div className="bg-gray-50 border border-gray-200 py-3 px-6 rounded-xl inline-block mb-6 shadow-inner">
              <p className="font-bold text-lg text-gray-800">{content.idPrefix} <span className="text-[#1B5E20]">{id}</span></p>
            </div>
          )}
          
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">{content.desc}</p>
          
          <div className="bg-yellow-50 p-4 rounded-xl mb-10 border border-yellow-200">
            <p className="font-bold text-yellow-900">Save this number to your contacts:</p>
            <p className="text-2xl font-black text-[#D35400] mt-1">+91 88400 98153</p>
          </div>
          
          <div className="space-y-3 max-w-sm mx-auto">
            {content.nextLinks.map((link, i) => (
              <Link 
                key={i} 
                href={link.href}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all ${
                  i === 0 
                    ? "bg-[#1B5E20] text-white hover:bg-[#0A3810] shadow-md hover:shadow-xl transform hover:-translate-y-1" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {link.label} {i === 0 && <ArrowRight size={18} />}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
