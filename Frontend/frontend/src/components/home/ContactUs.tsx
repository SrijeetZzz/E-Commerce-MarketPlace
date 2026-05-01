"use client";

import { Send, MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ContactPage = () => {
  return (
    <main className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Left: Info */}
        <div className="space-y-12">
          <div className="space-y-4">
            <h1 className="text-6xl font-black tracking-tighter text-slate-900">
              Let&apos;s talk.
            </h1>
            <p className="text-slate-500 font-medium text-lg">
              Have a question about an order or want to become a seller? Our
              team is here for you.
            </p>
          </div>

          <div className="space-y-8">
            {[
              { icon: <Mail />, label: "Email", value: "hello@wearix.com" },
              { icon: <Phone />, label: "Support", value: "+91 98765 43210" },
              { icon: <MapPin />, label: "Studio", value: "New Delhi, India" },
            ].map((item, i) => (
              <div key={i} className="flex gap-6 items-center">
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200">
                  {item.icon}
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {item.label}
                  </p>
                  <p className="text-lg font-bold text-slate-900">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Form */}
        <div className="bg-slate-50 p-10 rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200">
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Name
                </label>
                <Input
                  placeholder="Your name"
                  className="rounded-2xl h-12 border-none bg-white shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Email
                </label>
                <Input
                  placeholder="Your email"
                  className="rounded-2xl h-12 border-none bg-white shadow-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Message
              </label>
              <textarea
                className="w-full min-h-37.5 rounded-[24px] border-none bg-white shadow-sm p-4 text-sm font-medium outline-none focus:ring-2 focus:ring-purple-500/20"
                placeholder="What's on your mind?"
              />
            </div>
            <Button className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-xs gap-3">
              Send Message <Send size={16} />
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default ContactPage;
