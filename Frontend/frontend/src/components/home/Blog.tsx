"use client";

import { ArrowUpRight } from "lucide-react";

const posts = [
  { title: "Summer Palette 2026", date: "April 15", category: "Trends", img: "/blog1.jpg" },
  { title: "The Art of Minimalism", date: "April 12", category: "Style", img: "/blog2.jpg" },
  { title: "Investing in Timeless Pieces", date: "April 10", category: "Guide", img: "/blog3.jpg" }
];

const BlogPage = () => {
  return (
    <main className="max-w-7xl mx-auto px-6 py-20 space-y-16">
      <header className="space-y-4">
        <h1 className="text-5xl font-black tracking-tighter text-slate-900">The Journal</h1>
        <p className="text-slate-500 font-medium">Stories, Style Guides, and Market Trends.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {posts.map((post, i) => (
          <div key={i} className="group cursor-pointer">
            <div className="aspect-16/10 bg-slate-100 rounded-[32px] overflow-hidden mb-6">
              <img src={post.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={post.title} />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-purple-600">{post.category}</span>
                <span className="text-[10px] font-bold text-slate-400">{post.date}</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight group-hover:underline underline-offset-4 decoration-2">
                {post.title}
              </h2>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                Read Story <ArrowUpRight size={16} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default BlogPage;