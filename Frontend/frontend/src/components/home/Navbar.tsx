"use client";

import { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  Menu,
  X,
  ShoppingCart,
  Store,
  User,
  Package,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";
import toast from "react-hot-toast";
import api from "@/services/api";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import { searchProducts } from "@/services/product";
import LoginForm from "@/components/auth/LoginForm";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";

  const { user, logout, cartCount } = useAuth();
  const isLoggedIn = !!user;

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [activeCatId, setActiveCatId] = useState<string | null>(null);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data?.data || []);
      } catch (err) {
        console.error("Category fetch failed", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Subcategories
  useEffect(() => {
    if (!activeCatId) return;
    const fetchSub = async () => {
      try {
        const res = await api.get(
          `/categories/subcategories?categoryId=${activeCatId}`,
        );
        const payload = res?.data ?? res;
        setSubcategories(payload.data || []);
      } catch (err) {
        console.error("Subcategory fetch failed", err);
      }
    };
    fetchSub();
  }, [activeCatId]);

  useEffect(() => {
    if (!isHome) return;
    const handleScroll = () =>
      setScrolled(window.scrollY > window.innerHeight - 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  const handleSearch = async (value: string) => {
    setQuery(value);
    if (!value.trim()) {
      setResults([]);
      return;
    }
    try {
      const res = await searchProducts(value);
      setResults(res || []);
    } catch (err) {
      toast.error("Search failed");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      setMenuOpen(false);
      router.push("/");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isHome
            ? scrolled
              ? "bg-black/90 backdrop-blur text-white shadow-md"
              : "bg-transparent text-white"
            : "bg-black text-white shadow-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* LOGO */}
          <div
            onClick={() => router.push("/")}
            className="font-bold text-2xl cursor-pointer shrink-0"
          >
            WEARIX
          </div>

          {/* DESKTOP CATEGORIES & SEARCH */}
          <div className="hidden md:flex flex-1 items-center gap-4 max-w-3xl">
            <div
              className="relative group h-16 flex items-center"
              onMouseEnter={() => setCategoryOpen(true)}
              onMouseLeave={() => {
                setCategoryOpen(false);
                setActiveCatId(null);
                setSubcategories([]);
              }}
            >
              <button className="flex items-center gap-1 px-4 py-2 hover:bg-white/10 rounded-md transition-colors text-sm font-medium">
                Categories <ChevronDown size={14} />
              </button>

              {categoryOpen && (
                <div className="absolute top-16 left-0 w-150 bg-white shadow-2xl rounded-b-xl flex text-black overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="w-1/3 bg-gray-50 border-r py-4">
                    {categories.map((cat) => (
                      <div
                        key={cat._id}
                        onMouseEnter={() => setActiveCatId(cat._id)}
                        onClick={() => {
                          router.push(`/category/${cat._id}`);
                          setCategoryOpen(false);
                        }}
                        className={`px-4 py-3 cursor-pointer text-sm font-medium transition-colors ${activeCatId === cat._id ? "bg-white text-purple-600 border-r-2 border-purple-600" : "hover:bg-gray-100"}`}
                      >
                        {cat.name}
                      </div>
                    ))}
                  </div>
                  <div className="w-2/3 p-6 grid grid-cols-2 gap-4">
                    {subcategories.map((sub) => (
                      <div
                        key={sub._id}
                        onClick={() => {
                          router.push(
                            `/category/${activeCatId}?subCategory=${sub._id}`,
                          );
                          setCategoryOpen(false);
                        }}
                        className="text-sm text-gray-600 hover:text-purple-600 cursor-pointer"
                      >
                        {sub.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div
              onClick={() => setSearchOpen(true)}
              className="flex-1 flex items-center gap-3 bg-white/10 border border-white/20 hover:border-white/40 px-4 py-2 rounded-lg cursor-text transition-all group"
            >
              <Search size={18} className="text-white/60" />
              <span className="text-white/50 text-sm">Search products...</span>
            </div>
          </div>

          {/* MOBILE SEARCH ICON (Visible only on mobile) */}
          <div className="md:hidden flex-1 flex justify-end px-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 bg-white/10 rounded-full"
            >
              <Search size={20} />
            </button>
          </div>

          {/* RIGHT SIDE ICONS */}
          <div className="flex items-center gap-2 md:gap-4">
            <div
              onClick={() => router.push("/cart")}
              className="relative cursor-pointer p-2"
            >
              <ShoppingCart size={22} />
              <span className="absolute top-0 right-0 bg-purple-600 text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-black">
                {cartCount}
              </span>
            </div>

            {/* DESKTOP PROFILE */}
            <div className="hidden md:block">
              {isLoggedIn ? (
                <div
                  className="relative h-16 flex items-center"
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <div className="flex items-center gap-2 cursor-pointer">
                    <img
                      src={
                        user?.avatar
                          ? `http://localhost:5000${user.avatar}`
                          : "/images/placeholder.jpg"
                      }
                      className="w-9 h-9 rounded-full object-cover border border-white/20"
                    />
                    <ChevronDown size={16} />
                  </div>
                  {dropdownOpen && (
                    <div className="absolute right-0 top-14 w-52 bg-white text-black rounded-lg shadow-xl border p-1 animate-in fade-in zoom-in-95">
                      <button
                        onClick={() => router.push("/profile")}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-100 rounded-md"
                      >
                        <User size={16} /> Profile
                      </button>
                      <button
                        onClick={() => router.push("/orders")}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-100 rounded-md"
                      >
                        <Package size={16} /> Orders
                      </button>
                      <button
                        onClick={() => router.push("/seller/apply")}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-md font-semibold"
                      >
                        <Store size={16} /> Become Seller
                      </button>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-md"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setAuthOpen(true)}
                  className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* MOBILE MENU TOGGLE */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2"
            >
              {menuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* MOBILE DRAWER */}
        {menuOpen && (
          <div className="md:hidden fixed inset-0 top-16 bg-black z-40 overflow-y-auto animate-in slide-in-from-right">
            <div className="p-4 space-y-6">
              {/* Profile Section */}
              {isLoggedIn ? (
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                  <img
                    src={
                      user?.avatar
                        ? `http://localhost:5000${user.avatar}`
                        : "/placeholder.png"
                    }
                    className="w-12 h-12 rounded-full border border-purple-500"
                  />
                  <div>
                    <p className="font-bold">{user.name || "User"}</p>
                    <p className="text-xs text-white/50">{user.email}</p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAuthOpen(true);
                    setMenuOpen(false);
                  }}
                  className="w-full py-4 bg-white text-black font-bold rounded-xl"
                >
                  Sign In / Register
                </button>
              )}

              {/* Mobile Categories */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-2">
                  Categories
                </p>
                <div className="grid grid-cols-1 gap-1">
                  {categories.map((cat) => (
                    <details key={cat._id} className="group">
                      <summary className="list-none flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer">
                        <span className="text-sm font-medium">{cat.name}</span>
                        <ChevronRight
                          size={16}
                          className="group-open:rotate-90 transition-transform"
                        />
                      </summary>
                      <div className="pl-4 py-2 grid grid-cols-1 gap-2">
                        <button
                          onClick={() => {
                            router.push(`/category/${cat._id}`);
                            setMenuOpen(false);
                          }}
                          className="text-left text-sm text-purple-400 py-1 font-bold"
                        >
                          View All
                        </button>
                        {/* Note: In a real app, you'd fetch subcategories for the specific category here or pre-fetch them */}
                        <p className="text-[10px] text-white/30 italic">
                          Explore sub-segments in {cat.name}
                        </p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>

              {/* Account Links */}
              {isLoggedIn && (
                <div className="space-y-2 border-t border-white/10 pt-6">
                  <button
                    onClick={() => {
                      router.push("/profile");
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-4 p-3 hover:bg-white/5 rounded-lg"
                  >
                    <User size={20} /> Profile
                  </button>
                  <button
                    onClick={() => {
                      router.push("/orders");
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-4 p-3 hover:bg-white/5 rounded-lg"
                  >
                    <Package size={20} /> My Orders
                  </button>
                  <button
                    onClick={() => {
                      router.push("/seller");
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-4 p-3 bg-purple-600 rounded-lg font-bold"
                  >
                    <Store size={20} /> Become a Seller
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 p-3 text-red-400 hover:bg-red-400/10 rounded-lg"
                  >
                    <LogOut size={20} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* SEARCH MODAL (Shared for Mobile & Desktop) */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden bg-white sm:rounded-2xl border-none shadow-2xl [&>button]:hidden">
          {/* ^ Note the [&>button]:hidden class above. It hides the default Shadcn close button for this specific modal */}

          <VisuallyHidden>
            <DialogTitle>Search Products</DialogTitle>
          </VisuallyHidden>

          {/* Input Header */}
          <div className="p-6 flex items-center gap-4 bg-white">
            <Search className="text-purple-600 shrink-0" size={22} />
            <input
              autoFocus
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search for brands, products..."
              className="w-full bg-transparent border-none focus:ring-0 text-xl outline-none text-black placeholder:text-gray-300 font-light"
            />

            {/* Dynamic Action Button: Clear or Close */}
            {query ? (
              <button
                onClick={() => {
                  setQuery("");
                  setResults([]);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
              >
                <X size={20} />
              </button>
            ) : (
              <button
                onClick={() => setSearchOpen(false)}
                className="text-xs font-medium text-gray-400 hover:text-black transition-colors border px-2 py-1 rounded"
              >
                ESC
              </button>
            )}
          </div>

          {/* Results Area */}
          <div className="max-h-[60vh] overflow-y-auto bg-gray-50/40 border-t">
            {results.length > 0 ? (
              <div className="p-4 space-y-2">
                <p className="text-[10px] font-bold text-gray-400 px-2 uppercase tracking-[0.2em] mb-3">
                  Top Results
                </p>
                {results.map((item: any) => (
                  <div
                    key={item._id}
                    onClick={() => {
                      router.push(`/product/${item._id}`);
                      setSearchOpen(false);
                    }}
                    className="group flex items-center gap-4 p-3 bg-white hover:shadow-md hover:shadow-purple-500/5 rounded-xl transition-all cursor-pointer border border-transparent hover:border-purple-100"
                  >
                    {/* Image with subtle shadow */}
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-white shrink-0 border border-gray-100 shadow-sm">
                      <img
                        src={
                          item.images[0]?.startsWith("http")
                            ? item.images[0]
                            : `http://localhost:5000${item.images[0]}`
                        }
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        alt={item.title}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded tracking-wide">
                          {item.brand}
                        </span>
                        <span className="text-[10px] text-gray-400 truncate font-medium">
                          {item.category} • {item.subCategory}
                        </span>
                      </div>
                      <h4 className="font-medium text-gray-900 truncate group-hover:text-purple-600 transition-colors">
                        {item.title}
                      </h4>
                    </div>

                    {/* Price Tag */}
                    <div className="text-right">
                      <p className="font-bold text-base text-gray-900">
                        ₹{item.minPrice.toLocaleString()}
                      </p>
                      {item.totalListings > 1 && (
                        <p className="text-[9px] text-blue-500 font-semibold bg-blue-50 px-1 rounded-sm inline-block">
                          {item.totalListings} SELLERS
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : query.length > 2 ? (
              <div className="py-24 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                  <Search className="text-gray-300" size={24} />
                </div>
                <p className="text-gray-900 font-medium text-sm">
                  No results for "{query}"
                </p>
                <p className="text-gray-400 text-xs mt-1 font-light">
                  Try searching for something else like "iPhone" or "Yoga Mat"
                </p>
              </div>
            ) : (
              <div className="p-8">
                <div className="grid grid-cols-1 gap-2">
                  <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-2 px-2">
                    Popular suggestions
                  </p>
                  {["Smartphones", "Fitness Gear", "Home Decor"].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleSearch(tag)}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors group"
                    >
                      <Search
                        size={14}
                        className="text-gray-300 group-hover:text-purple-600"
                      />
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* AUTH MODAL */}
      <Dialog open={authOpen} onOpenChange={setAuthOpen}>
        <DialogContent className="sm:max-w-125 p-0 rounded-3xl overflow-hidden">
          <div className="bg-white p-8">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl text-center">
                Welcome Back
              </DialogTitle>
              <DialogDescription className="text-center">
                Enter your credentials
              </DialogDescription>
            </DialogHeader>

            <LoginForm onSuccess={() => setAuthOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Navbar;
