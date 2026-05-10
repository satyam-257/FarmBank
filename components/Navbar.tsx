"use client";

import { useState } from "react";
import Link from "next/link";
import { Wheat, Menu, X, Phone, MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/apply-loan" }, // Routing to loan for now
    { name: "Marketplace", href: "/marketplace" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col">
      {/* Top Bar */}
      <div className="bg-[#1B5E20] text-white text-xs sm:text-sm py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <a href="tel:+918840098153" className="flex items-center gap-1 hover:text-[#F9A825] transition-colors">
            <Phone size={14} /> +91 88400 98153
          </a>
          <a href="https://wa.me/918840098153" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[#F9A825] transition-colors">
            <MessageCircle size={14} /> WhatsApp Us
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Wheat className="w-8 h-8 text-[#1B5E20]" />
              <span className="font-bold text-xl text-gray-900 tracking-tight">FarmBank</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    pathname === link.href 
                      ? "text-[#1B5E20] border-b-2 border-[#1B5E20] pb-1"
                      : "text-gray-600 hover:text-[#1B5E20]"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <a 
                href="https://wa.me/918840098153" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1B5E20] hover:bg-green-50 px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 border border-[#1B5E20] transition-colors"
              >
                <MessageCircle size={16} /> WhatsApp
              </a>
              <Link 
                href="/register" 
                className="bg-[#1B5E20] text-white px-5 py-2 rounded-md font-medium text-sm hover:bg-[#2E7D32] transition-colors shadow-sm"
              >
                🌾 Create KisanID
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-gray-600 hover:text-[#1B5E20] focus:outline-none"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-0 left-0 w-full h-screen bg-white z-50 overflow-y-auto">
          <div className="flex justify-between items-center px-4 h-16 border-b border-gray-100 mt-10">
            <div className="flex items-center gap-2">
              <Wheat className="w-8 h-8 text-[#1B5E20]" />
              <span className="font-bold text-xl text-gray-900">FarmBank</span>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <X size={24} />
            </button>
          </div>
          <div className="px-4 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-lg font-medium p-2 rounded-md ${
                  pathname === link.href ? "text-[#1B5E20] bg-green-50" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="mt-6 flex flex-col gap-3">
              <Link 
                href="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-[#1B5E20] text-white font-medium py-3 rounded-md text-center shadow-sm"
              >
                🌾 Create KisanID Free
              </Link>
              <a 
                href="https://wa.me/918840098153"
                className="border border-[#1B5E20] text-[#1B5E20] font-medium py-3 rounded-md text-center flex items-center justify-center gap-2"
              >
                <MessageCircle size={20} /> WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
