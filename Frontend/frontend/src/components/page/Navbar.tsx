"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import useDebounce from "@/hooks/useDebounce";
import { searchProducts } from "@/services/search";

export default function Navbar() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query);

  // autofocus search
  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  // fetch search results
  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery) {
        setResults([]);
        return;
      }

      try {
        const data = await searchProducts(debouncedQuery);
        setResults(data);
      } catch (err) {
        console.error("Search failed", err);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  return (
    <nav className="w-full bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 relative">

        <div className="flex items-center justify-between">

          {/* LEFT - LOGO */}
          <div
            onClick={() => router.push("/")}
            className="font-bold text-xl cursor-pointer"
          >
            WEARIX
          </div>

          {/* CENTER - DESKTOP NAV */}
          <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex gap-8 text-sm">
            <button onClick={() => router.push("/")}>Home</button>
            <button onClick={() => router.push("/shop")}>Shop</button>
            <button onClick={() => router.push("/about")}>About</button>
            <button onClick={() => router.push("/blog")}>Blog</button>
            <button onClick={() => router.push("/contact")}>Contact</button>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">

            {/* 🔍 SEARCH */}
            <div className="relative flex items-center bg-white/10 backdrop-blur-md rounded-full px-2 transition-all duration-300">

              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2"
              >
                <Search size={18} />
              </button>

              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && query) {
                    router.push(`/search?q=${query}`);
                    setSearchOpen(false);
                    setResults([]);
                  }
                }}
                onBlur={() => {
                  setTimeout(() => {
                    if (!query) {
                      setSearchOpen(false);
                      setResults([]);
                    }
                  }, 150);
                }}
                placeholder="Search..."
                className={`
                  bg-transparent text-sm text-white placeholder-gray-400
                  outline-none border-none
                  transition-all duration-300
                  ${searchOpen ? "w-40 ml-2 opacity-100" : "w-0 opacity-0"}
                `}
              />

              {/* SEARCH RESULTS */}
              {results.length > 0 && (
                <div className="absolute top-12 left-0 w-64 bg-white text-black rounded-lg shadow-lg overflow-hidden z-50">

                  {results.map((item: any) => (
                    <div
                      key={item._id}
                      onClick={() => {
                        router.push(`/products/${item._id}`);
                        setSearchOpen(false);
                        setQuery("");
                        setResults([]);
                      }}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <img
                        src={item.image || "/placeholder.png"}
                        className="w-8 h-8 object-cover rounded"
                      />
                      <div>
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-xs text-gray-500">
                          ₹{item.price}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* VIEW ALL */}
                  <div
                    onClick={() => {
                      router.push(`/search?q=${query}`);
                      setSearchOpen(false);
                      setResults([]);
                    }}
                    className="px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 cursor-pointer"
                  >
                    View all results
                  </div>
                </div>
              )}
            </div>

            {/* USER */}
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2"
              >
                <img
                  src="/avatar.png"
                  alt="user"
                  className="w-8 h-8 rounded-full"
                />
                <ChevronDown size={16} />
              </button>

              {open && (
                <div className="absolute right-0 mt-3 w-40 bg-white text-black rounded-lg shadow-lg overflow-hidden">
                  <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                    Profile
                  </button>
                  <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                    Settings
                  </button>
                  <button className="block w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100">
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* 🍔 HAMBURGER */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* 📱 MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden bg-black border-t border-white/10 px-4 py-4 space-y-4">

          <button
            onClick={() => {
              router.push("/");
              setMenuOpen(false);
            }}
            className="block w-full text-left"
          >
            Home
          </button>

          <button
            onClick={() => {
              router.push("/shop");
              setMenuOpen(false);
            }}
            className="block w-full text-left"
          >
            Shop
          </button>

          <button
            onClick={() => {
              router.push("/about");
              setMenuOpen(false);
            }}
            className="block w-full text-left"
          >
            About
          </button>

          <button
            onClick={() => {
              router.push("/blog");
              setMenuOpen(false);
            }}
            className="block w-full text-left"
          >
            Blog
          </button>

          <button
            onClick={() => {
              router.push("/contact");
              setMenuOpen(false);
            }}
            className="block w-full text-left"
          >
            Contact
          </button>
        </div>
      )}
    </nav>
  );
}