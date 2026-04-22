"use client";

import { useRouter } from "next/navigation";
import { 
  ArrowRight, 
  Sparkles, 
  Globe, 
  Send,
  Mail,
  ArrowUp
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const router = useRouter();
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#0a0a0a] text-white  overflow-hidden pt-20 pb-10 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* TOP SECTION: NEWSLETTER */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pb-20 border-b border-white/5">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-purple-500">
              <Sparkles size={22} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">The Inner Circle</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.1]">
              Elevate your <br /> <span className="text-slate-600 font-medium italic">Inbox.</span>
            </h2>
            <p className="text-slate-500 max-w-sm font-medium leading-relaxed">
              Join 50k+ fashion enthusiasts. No spam, just curated drops and seller stories.
            </p>
          </div>

          <div className="relative">
            <div className="flex items-center bg-white/5 backdrop-blur-3xl rounded-[30px] p-2 border border-white/10 focus-within:border-white/40 transition-all duration-500 shadow-2xl">
              <Input 
                placeholder="email@example.com" 
                className="bg-transparent border-none text-white placeholder:text-slate-600 focus-visible:ring-0 focus-visible:ring-offset-0 h-14 px-6 font-bold"
              />
              <Button className="rounded-[22px] h-14 px-8 bg-white text-black hover:bg-purple-500 hover:text-white transition-all duration-500 font-black text-[11px] uppercase tracking-widest gap-2 group">
                Join <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION: LINKS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 py-20">
          
          {/* BRAND BLOCK */}
          <div className="col-span-2 md:col-span-1 space-y-10">
            <div 
              onClick={() => router.push("/")}
              className="text-4xl font-black tracking-tighter cursor-pointer hover:opacity-70 transition-opacity"
            >
              WEARIX<span className="text-purple-600">.</span>
            </div>
            
            {/* SOCIAL ICONS (Custom SVGs for Brands) */}
            <div className="flex gap-4">
              {/* Instagram */}
              <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              {/* X (Twitter) */}
              <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              {/* Facebook */}
              <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
            </div>
          </div>

          {/* SHOP LINKS */}
          <div className="space-y-8">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-600">Inventory</h4>
            <ul className="flex flex-col gap-5 text-sm font-bold text-slate-500">
              {['All Collections', 'Trending Now', 'Seller Spotlights', 'The Outlet'].map((link) => (
                <li key={link} className="hover:text-white hover:translate-x-1 transition-all cursor-pointer">{link}</li>
              ))}
            </ul>
          </div>

          {/* SUPPORT LINKS */}
          <div className="space-y-8">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-600">Concierge</h4>
            <ul className="flex flex-col gap-5 text-sm font-bold text-slate-500">
              <li onClick={() => router.push("/contact")} className="hover:text-white hover:translate-x-1 transition-all cursor-pointer">Help Center</li>
              <li className="hover:text-white hover:translate-x-1 transition-all cursor-pointer">Shipping & Returns</li>
              <li className="hover:text-white hover:translate-x-1 transition-all cursor-pointer">Authenticity Guarantee</li>
              <li className="hover:text-white hover:translate-x-1 transition-all cursor-pointer">Live Chat</li>
            </ul>
          </div>

          {/* COMPANY LINKS */}
          <div className="space-y-8">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-600">House</h4>
            <ul className="flex flex-col gap-5 text-sm font-bold text-slate-500">
              <li onClick={() => router.push("/about")} className="hover:text-white hover:translate-x-1 transition-all cursor-pointer">Our Vision</li>
              <li onClick={() => router.push("/blog")} className="hover:text-white hover:translate-x-1 transition-all cursor-pointer">The Journal</li>
              <li className="hover:text-white hover:translate-x-1 transition-all cursor-pointer">Privacy Protocol</li>
              <li className="hover:text-white hover:translate-x-1 transition-all cursor-pointer">Legal</li>
            </ul>
          </div>
        </div>

        {/* BOTTOM SECTION: COPYRIGHT */}
        <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">
              © {currentYear} WEARIX INC. ALL RIGHTS RESERVED.
            </p>
            <div className="flex items-center gap-2 text-slate-700">
               <Globe size={14} />
               <span className="text-[10px] font-black uppercase tracking-widest">Global • INR (₹)</span>
            </div>
          </div>

          {/* Scroll To Top Button */}
          <button 
            onClick={scrollToTop}
            className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors"
          >
            Back to Top 
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                <ArrowUp size={16} />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;