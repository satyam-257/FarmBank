import Link from "next/link";
import { Wheat, MapPin, Phone, Mail, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & About */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Wheat className="w-8 h-8 text-[#F9A825]" />
              <span className="font-bold text-2xl text-white">FarmBank</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Grow More. Earn More. Waste Nothing. India's First Financial OS for Farmers built on AgriStack.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="hover:text-[#F9A825] transition-colors">Home</Link></li>
              <li><Link href="/register" className="hover:text-[#F9A825] transition-colors">Create KisanID</Link></li>
              <li><Link href="/apply-loan" className="hover:text-[#F9A825] transition-colors">Harvest Loans</Link></li>
              <li><Link href="/marketplace" className="hover:text-[#F9A825] transition-colors">Zero Waste Marketplace</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="hover:text-[#F9A825] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#F9A825] transition-colors">Terms of Service</Link></li>
              <li><Link href="/grievance" className="hover:text-[#F9A825] transition-colors">Grievance Redressal</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#F9A825] shrink-0 mt-0.5" />
                <span className="text-sm">Kolkata, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#F9A825] shrink-0" />
                <a href="tel:+918840098153" className="text-sm hover:text-[#F9A825]">+91 88400 98153</a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-[#F9A825] shrink-0" />
                <a href="https://wa.me/918840098153" className="text-sm hover:text-[#F9A825]">WhatsApp Us</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#F9A825] shrink-0" />
                <a href="mailto:krishiyogi28@gmail.com" className="text-sm hover:text-[#F9A825]">krishiyogi28@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} FarmBank. All rights reserved. Founded by Vaibhav Adarsh.
          </p>
          <div className="flex gap-4">
            <span className="text-xs text-gray-600">Built with 💚 for Indian Farmers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
