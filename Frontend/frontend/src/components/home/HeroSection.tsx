"use client";

import { useState } from "react";

const slides = [
  { image: "/banner1.jpg", tag: "Top", subtitle: "Best Quality Wear", title: "Premium wear for modern living" },
  { image: "/banner2.jpg", tag: "Soft", subtitle: "Minimal Lifestyle", title: "Clean aesthetics for everyday life" },
  { image: "/banner3.jpg", tag: "Tech", subtitle: "Modern Electronics", title: "Smart devices for your lifestyle" },
  { image: "/banner4.jpg", tag: "Home", subtitle: "Living Essentials", title: "Elevate your space with simplicity" },
  { image: "/banner5.jpg", tag: "Beauty", subtitle: "Self Care", title: "Premium care for your skin" },
  { image: "/banner8.jpg", tag: "Sneakers", subtitle: "Street Style", title: "Walk with confidence" },
  { image: "/banner9.jpg", tag: "Men", subtitle: "Modern Fashion", title: "Sharp looks, timeless fits" },
  { image: "/banner10.jpg", tag: "Women", subtitle: "Elegant Wear", title: "Grace in every detail" },
  { image: "/banner11.jpg", tag: "Women", subtitle: "Elegant Wear", title: "Grace in every detail" },
  { image: "/banner14.jpg", tag: "Women", subtitle: "Elegant Wear", title: "Grace in every detail" },
];

const HeroSection = () => {
  const [active, setActive] = useState(0);
  const current = slides[active];

  return (
    <div className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 h-screen overflow-hidden">

      {/* 🔥 BACKGROUND */}
      <div
        className="absolute inset-0 bg-cover bg-position-[center_top] transition-all duration-700"
        style={{ backgroundImage: `url(${current.image})` }}
      />

      {/* 🔥 OVERLAY */}
      <div className="absolute inset-0 bg-black/40" />

      {/* 🔥 CONTENT */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">

        {/* TAGS */}
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-white text-black text-xs font-bold px-3 py-1 rounded-full">
            {current.tag}
          </span>
          <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur">
            {current.subtitle}
          </span>
        </div>

        {/* TITLE */}
        <h1 className="text-4xl md:text-6xl font-bold text-white max-w-3xl leading-tight">
          {current.title}
        </h1>

        {/* BUTTONS */}
        <div className="flex gap-4 mt-6">
          <button className="bg-white text-black px-6 py-3 rounded-full font-semibold">
            See all collections
          </button>
          <button className="bg-white/20 text-white px-6 py-3 rounded-full font-semibold backdrop-blur">
            Contact us
          </button>
        </div>

        {/* 🔥 THUMBNAILS */}
        <div className="absolute bottom-6 w-full flex justify-center">
          <div className="flex gap-2 px-4">

            {slides.map((slide, index) => (
              <div
                key={index}
                onClick={() => setActive(index)}
                className="cursor-pointer"
              >
                <div
                  className={`rounded-md overflow-hidden transition-all duration-300 ${
                    active === index
                      ? "scale-125 origin-bottom border-2 border-white -translate-y-1"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={slide.image}
                    className="w-16 h-12 object-cover"
                    alt="thumb"
                  />
                </div>
              </div>
            ))}

          </div>
        </div>

      </div>
    </div>
  );
};

export default HeroSection;