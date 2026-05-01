"use client";

import { Leaf, ShieldCheck, Globe } from "lucide-react";

const AboutPage = () => {
  return (
    <main className="min-h-screen bg-white">
      {/* Editorial Hero */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <div className="flex items-center gap-2 text-purple-600">
              <div className="h-1 w-12 bg-purple-600 rounded-full" />
              <span className="text-xs font-black uppercase tracking-[0.3em]">
                Our Story
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9]">
              Elevating Every <br />{" "}
              <span className="text-slate-400">Standard.</span>
            </h1>
            <p className="text-lg text-slate-500 max-w-lg font-medium leading-relaxed">
              Wearix was founded on a simple principle: high-end fashion
              shouldn't be high-barrier. We curate the world's most unique
              sellers into one seamless experience.
            </p>
          </div>
          <div className="flex-1 relative">
            <div className="w-full aspect-4/5 bg-slate-100 rounded-[40px] overflow-hidden rotate-2 shadow-2xl shadow-slate-200">
              <img
                src="/about.png"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                alt="Brand vibe"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="text-black rounded-[60px]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16">
          {[
            {
              icon: <Leaf />,
              title: "Sustainable",
              desc: "We partner with ethical creators.",
            },
            {
              icon: <ShieldCheck />,
              title: "Authentic",
              desc: "Every item is verified by our experts.",
            },
            {
              icon: <Globe />,
              title: "Global",
              desc: "Curated styles from every corner of the world.",
            },
          ].map((val, i) => (
            <div key={i} className="space-y-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-purple-400">
                {val.icon}
              </div>
              <h3 className="text-2xl font-bold tracking-tight">{val.title}</h3>
              <p className="text-slate-400 font-medium leading-relaxed">
                {val.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
