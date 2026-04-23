// "use client";

// import { useState, useEffect } from "react";
// import { Search, ChevronDown, Menu, X, ShoppingCart } from "lucide-react";
// import { useRouter } from "next/navigation";

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";

// import { searchProducts } from "@/services/product";
// import LoginForm from "@/components/auth/LoginForm";

// export default function Navbar() {
//   const router = useRouter();

//   // NAV STATES
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [authOpen, setAuthOpen] = useState(false);

//   // SEARCH STATES
//   const [searchOpen, setSearchOpen] = useState(false);
//   const [query, setQuery] = useState("");
//   const [results, setResults] = useState<any[]>([]);

//   // TEMP (replace later)
//   const cartCount = 2;
//   const isLoggedIn = false;

//   // 🔥 SEARCH FUNCTION
//   const handleSearch = async (value: string) => {
//     setQuery(value);

//     if (!value.trim()) {
//       setResults([]);
//       return;
//     }

//     try {
//       const res = await searchProducts(value);
//       setResults(res || []);
//     } catch (err) {
//       console.error("Search failed", err);
//     }
//   };

//   return (
//     <>
//       {/* ================= NAVBAR ================= */}
//       <nav className="w-full bg-black text-white">
//         <div className="max-w-7xl mx-auto px-4 py-4 relative">
//           <div className="flex items-center justify-between">
//             {/* LOGO */}
//             <div
//               onClick={() => router.push("/")}
//               className="font-bold text-xl cursor-pointer"
//             >
//               WEARIX
//             </div>

//             {/* DESKTOP NAV */}
//             <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex gap-8 text-sm">
//               <button onClick={() => router.push("/")}>Home</button>
//               <button onClick={() => router.push("/shop")}>Shop</button>
//               <button onClick={() => router.push("/about")}>About</button>
//               <button onClick={() => router.push("/blog")}>Blog</button>
//               <button onClick={() => router.push("/contact")}>Contact</button>
//             </div>

//             {/* RIGHT SIDE */}
//             <div className="flex items-center gap-3">
//               {/* BECOME SELLER */}
//               <button
//                 onClick={() => router.push("/seller")}
//                 className="hidden md:block bg-purple-600 px-4 py-2 rounded-full text-sm hover:bg-purple-700"
//               >
//                 Become Seller
//               </button>

//               {/* SEARCH BUTTON */}
//               <button onClick={() => setSearchOpen(true)}>
//                 <Search size={20} />
//               </button>

//               {/* CART */}
//               <div
//                 onClick={() => router.push("/cart")}
//                 className="relative cursor-pointer p-2"
//               >
//                 <ShoppingCart size={20} />
//                 <span className="absolute -top-1 -right-1 bg-purple-600 text-xs w-5 h-5 flex items-center justify-center rounded-full">
//                   {cartCount}
//                 </span>
//               </div>

//               {/* AUTH */}
//               {isLoggedIn ? (
//                 <div className="relative">
//                   <button
//                     onClick={() => setDropdownOpen(!dropdownOpen)}
//                     className="flex items-center gap-2"
//                   >
//                     <img
//                       src="/avatar.png"
//                       alt="user"
//                       className="w-8 h-8 rounded-full"
//                     />
//                     <ChevronDown size={16} />
//                   </button>

//                   {dropdownOpen && (
//                     <div className="absolute right-0 mt-3 w-40 bg-white text-black rounded-lg shadow-lg">
//                       <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
//                         Profile
//                       </button>
//                       <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
//                         Settings
//                       </button>
//                       <button className="block w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100">
//                         Logout
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <button
//                   onClick={() => setAuthOpen(true)}
//                   className="bg-white text-black px-4 py-2 rounded-full text-sm"
//                 >
//                   Sign In
//                 </button>
//               )}

//               {/* MOBILE MENU */}
//               <button
//                 onClick={() => setMenuOpen(!menuOpen)}
//                 className="md:hidden p-2"
//               >
//                 {menuOpen ? <X size={22} /> : <Menu size={22} />}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* MOBILE MENU */}
//         {menuOpen && (
//           <div className="md:hidden bg-black border-t border-white/10 px-4 py-4 space-y-4">
//             <button onClick={() => router.push("/")}>Home</button>
//             <button onClick={() => router.push("/shop")}>Shop</button>
//             <button onClick={() => router.push("/about")}>About</button>
//             <button onClick={() => router.push("/blog")}>Blog</button>
//             <button onClick={() => router.push("/contact")}>Contact</button>

//             <button
//               onClick={() => router.push("/seller")}
//               className="block w-full text-left text-purple-400"
//             >
//               Become Seller
//             </button>

//             {!isLoggedIn && (
//               <button
//                 onClick={() => setAuthOpen(true)}
//                 className="block w-full text-left"
//               >
//                 Sign In
//               </button>
//             )}
//           </div>
//         )}
//       </nav>
//       <Dialog open={authOpen} onOpenChange={setAuthOpen}>
//         {/* Changed max-w-md to sm:max-w-[500px] and added padding */}
//         <DialogContent className="sm:max-w-125 p-0 overflow-hidden border-none shadow-2xl">
//           <div className="bg-white p-8">
//             <DialogHeader className="space-y-3 mb-6">
//               <DialogTitle className="text-2xl font-bold text-center tracking-tight">
//                 Welcome Back
//               </DialogTitle>
//               <DialogDescription className="text-center text-gray-500 text-base">
//                 Enter your credentials to access your account and manage your
//                 orders.
//               </DialogDescription>
//             </DialogHeader>

//             <div className="py-2">
//               <LoginForm onSuccess={() => setAuthOpen(false)} />
//             </div>

//             {/* Optional: Add a footer or divider if your LoginForm doesn't have a "Sign Up" link */}
//             <div className="mt-6 text-center text-sm text-gray-400">
//               By continuing, you agree to our Terms of Service.
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* ================= SEARCH MODAL ================= */}
//       <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
//         <DialogContent className="max-w-3xl">
//           <DialogHeader>
//             <DialogTitle>Search</DialogTitle>
//           </DialogHeader>

//           {/* INPUT */}
//           <input
//             autoFocus
//             value={query}
//             onChange={(e) => handleSearch(e.target.value)}
//             placeholder="Search products..."
//             className="w-full border rounded-lg p-3 outline-none"
//           />

//           {/* RESULTS */}
//           <div className="mt-4 max-h-80 overflow-y-auto">
//             {results.length === 0 && query && (
//               <p className="text-gray-500 text-sm">No results found</p>
//             )}

//             {results.map((item: any) => (
//               <div
//                 key={item._id}
//                 onClick={() => {
//                   router.push(`/product/${item._id}`);
//                   setSearchOpen(false);
//                   setQuery("");
//                 }}
//                 className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer"
//               >
//                 <img
//                   src={item.image || "/placeholder.png"}
//                   className="w-10 h-10 object-cover rounded"
//                 />

//                 <div>
//                   <p className="font-medium">{item.title}</p>
//                   <p className="text-sm text-gray-500">₹{item.price}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import { Search, ChevronDown, Menu, X, ShoppingCart } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { usePathname } from "next/navigation";

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";

// import { searchProducts } from "@/services/product";
// import LoginForm from "@/components/auth/LoginForm";

//  const Navbar=()=> {
//   const router = useRouter();

//   // NAV STATES
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [authOpen, setAuthOpen] = useState(false);

//   // 🔥 SCROLL STATE
//   const [scrolled, setScrolled] = useState(false);

//   // SEARCH STATES
//   const [searchOpen, setSearchOpen] = useState(false);
//   const [query, setQuery] = useState("");
//   const [results, setResults] = useState<any[]>([]);

//   const cartCount = 2;
//   const isLoggedIn = false;

//   const pathname = usePathname();
//   const isHome = pathname === "/";

//   // 🔥 SCROLL LOGIC
//   useEffect(() => {
//     if (!isHome) return;

//     const handleScroll = () => {
//       const heroHeight = window.innerHeight;

//       if (window.scrollY > heroHeight - 80) {
//         setScrolled(true);
//       } else {
//         setScrolled(false);
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [isHome]);

//   // 🔥 SEARCH FUNCTION
//   const handleSearch = async (value: string) => {
//     setQuery(value);

//     if (!value.trim()) {
//       setResults([]);
//       return;
//     }

//     try {
//       const res = await searchProducts(value);
//       setResults(res || []);
//     } catch (err) {
//       console.error("Search failed", err);
//     }
//   };

//   return (
//     <>
//       {/* ================= NAVBAR ================= */}
//       <nav
//         className={`fixed top-0 w-full z-50 transition-all duration-500 ${
//           isHome
//             ? scrolled
//               ? "bg-black/90 backdrop-blur text-white shadow-md"
//               : "bg-transparent text-white"
//             : "bg-black text-white shadow-md "
//         }`}
//       >
//         <div className="max-w-7xl mx-auto px-4 py-4 relative">
//           <div className="flex items-center justify-between">
//             {/* LOGO */}
//             <div
//               onClick={() => router.push("/")}
//               className="font-bold text-xl cursor-pointer"
//             >
//               WEARIX
//             </div>

//             {/* DESKTOP NAV */}
//             <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex gap-8 text-sm">
//               <button onClick={() => router.push("/")}>Home</button>
//               <button onClick={() => router.push("/shop")}>Shop</button>
//               <button onClick={() => router.push("/about")}>About</button>
//               <button onClick={() => router.push("/blog")}>Blog</button>
//               <button onClick={() => router.push("/contact")}>Contact</button>
//             </div>

//             {/* RIGHT SIDE */}
//             <div className="flex items-center gap-3">
//               {/* SELLER */}
//               <button
//                 onClick={() => router.push("/seller")}
//                 className="hidden md:block bg-purple-600 px-4 py-2 rounded-full text-sm hover:bg-purple-700"
//               >
//                 Become Seller
//               </button>

//               {/* SEARCH */}
//               <button onClick={() => setSearchOpen(true)}>
//                 <Search size={20} />
//               </button>

//               {/* CART */}
//               <div
//                 onClick={() => router.push("/cart")}
//                 className="relative cursor-pointer p-2"
//               >
//                 <ShoppingCart size={20} />
//                 <span className="absolute -top-1 -right-1 bg-purple-600 text-xs w-5 h-5 flex items-center justify-center rounded-full">
//                   {cartCount}
//                 </span>
//               </div>

//               {/* AUTH */}
//               {isLoggedIn ? (
//                 <div className="relative">
//                   <button
//                     onClick={() => setDropdownOpen(!dropdownOpen)}
//                     className="flex items-center gap-2"
//                   >
//                     <img
//                       src="/avatar.png"
//                       alt="user"
//                       className="w-8 h-8 rounded-full"
//                     />
//                     <ChevronDown size={16} />
//                   </button>

//                   {dropdownOpen && (
//                     <div className="absolute right-0 mt-3 w-40 bg-white text-black rounded-lg shadow-lg">
//                       <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
//                         Profile
//                       </button>
//                       <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
//                         Settings
//                       </button>
//                       <button className="block w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100">
//                         Logout
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <button
//                   onClick={() => setAuthOpen(true)}
//                   className="bg-white text-black px-4 py-2 rounded-full text-sm"
//                 >
//                   Sign In
//                 </button>
//               )}

//               {/* MOBILE MENU */}
//               <button
//                 onClick={() => setMenuOpen(!menuOpen)}
//                 className="md:hidden p-2"
//               >
//                 {menuOpen ? <X size={22} /> : <Menu size={22} />}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* MOBILE MENU */}
//         {menuOpen && (
//           <div className="md:hidden bg-black border-t border-white/10 px-4 py-4 space-y-4">
//             <button onClick={() => router.push("/")}>Home</button>
//             <button onClick={() => router.push("/shop")}>Shop</button>
//             <button onClick={() => router.push("/about")}>About</button>
//             <button onClick={() => router.push("/blog")}>Blog</button>
//             <button onClick={() => router.push("/contact")}>Contact</button>

//             <button
//               onClick={() => router.push("/seller")}
//               className="block w-full text-left text-purple-400"
//             >
//               Become Seller
//             </button>

//             {!isLoggedIn && (
//               <button
//                 onClick={() => setAuthOpen(true)}
//                 className="block w-full text-left"
//               >
//                 Sign In
//               </button>
//             )}
//           </div>
//         )}
//       </nav>

//       {/* ================= AUTH MODAL ================= */}
//       <Dialog open={authOpen} onOpenChange={setAuthOpen}>
//         <DialogContent className="sm:max-w-125 p-0 overflow-hidden border-none shadow-2xl">
//           <div className="bg-white p-8">
//             <DialogHeader className="space-y-3 mb-6">
//               <DialogTitle className="text-2xl font-bold text-center">
//                 Welcome Back
//               </DialogTitle>
//               <DialogDescription className="text-center text-gray-500">
//                 Enter your credentials to access your account.
//               </DialogDescription>
//             </DialogHeader>

//             <LoginForm onSuccess={() => setAuthOpen(false)} />
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* ================= SEARCH MODAL ================= */}
//       <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
//         <DialogContent className="max-w-3xl">
//           <DialogHeader>
//             <DialogTitle>Search</DialogTitle>
//           </DialogHeader>

//           <input
//             autoFocus
//             value={query}
//             onChange={(e) => handleSearch(e.target.value)}
//             placeholder="Search products..."
//             className="w-full border rounded-lg p-3 outline-none"
//           />

//           <div className="mt-4 max-h-80 overflow-y-auto">
//             {results.length === 0 && query && (
//               <p className="text-gray-500 text-sm">No results found</p>
//             )}

//             {results.map((item: any) => (
//               <div
//                 key={item._id}
//                 onClick={() => {
//                   router.push(`/product/${item._id}`);
//                   setSearchOpen(false);
//                   setQuery("");
//                 }}
//                 className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer"
//               >
//                 <img
//                   src={item.image || "/placeholder.png"}
//                   className="w-10 h-10 object-cover rounded"
//                 />
//                 <div>
//                   <p className="font-medium">{item.title}</p>
//                   <p className="text-sm text-gray-500">₹{item.price}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }

// export default Navbar;
"use client";

import { useState, useEffect } from "react";
import { Search, ChevronDown, Menu, X, ShoppingCart } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { searchProducts } from "@/services/product";
import LoginForm from "@/components/auth/LoginForm";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";

  const { user, logout } = useAuth(); // 🔥 REAL AUTH
  const isLoggedIn = !!user;

  // UI STATE
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // SEARCH
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const cartCount = 2;

  // 🔥 SCROLL
  useEffect(() => {
    if (!isHome) return;

    const handleScroll = () => {
      setScrolled(window.scrollY > window.innerHeight - 80);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  // 🔥 SEARCH
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
      console.error("Search failed", err);
    }
  };

  // 🔥 LOGOUT HANDLER
  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <>
      {/* NAVBAR */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isHome
            ? scrolled
              ? "bg-black/90 backdrop-blur text-white shadow-md"
              : "bg-transparent text-white"
            : "bg-black text-white shadow-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 relative">
          <div className="flex items-center justify-between">

            {/* LOGO */}
            <div
              onClick={() => router.push("/")}
              className="font-bold text-xl cursor-pointer"
            >
              WEARIX
            </div>

            {/* DESKTOP NAV */}
            <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex gap-8 text-sm">
              <button onClick={() => router.push("/")}>Home</button>
              <button onClick={() => router.push("/shop")}>Shop</button>
              <button onClick={() => router.push("/about")}>About</button>
              <button onClick={() => router.push("/blog")}>Blog</button>
              <button onClick={() => router.push("/contact")}>Contact</button>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-3">

              {/* SELLER */}
              <button
                onClick={() => router.push("/seller")}
                className="hidden md:block bg-purple-600 px-4 py-2 rounded-full text-sm"
              >
                Become Seller
              </button>

              {/* SEARCH */}
              <button onClick={() => setSearchOpen(true)}>
                <Search size={20} />
              </button>

              {/* CART */}
              <div
                onClick={() => router.push("/cart")}
                className="relative cursor-pointer p-2"
              >
                <ShoppingCart size={20} />
                <span className="absolute -top-1 -right-1 bg-purple-600 text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              </div>

              {/* AUTH */}
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2"
                  >
                    <img
                      src="/avatar.png"
                      className="w-8 h-8 rounded-full"
                    />
                    <ChevronDown size={16} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-3 w-40 bg-white text-black rounded-lg shadow-lg">
                      <button
                        onClick={() => router.push("/profile")}
                        className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                      >
                        Profile
                      </button>

                      <button
                        onClick={() => router.push("/orders")}
                        className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                      >
                        Orders
                      </button>

                      <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setAuthOpen(true)}
                  className="bg-white text-black px-4 py-2 rounded-full text-sm"
                >
                  Sign In
                </button>
              )}

              {/* MOBILE */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="md:hidden bg-black px-4 py-4 space-y-4">
            <button onClick={() => router.push("/")}>Home</button>
            <button onClick={() => router.push("/shop")}>Shop</button>
            <button onClick={() => router.push("/about")}>About</button>

            {!isLoggedIn && (
              <button onClick={() => setAuthOpen(true)}>
                Sign In
              </button>
            )}
          </div>
        )}
      </nav>

      {/* AUTH MODAL */}
      <Dialog open={authOpen} onOpenChange={setAuthOpen}>
        <DialogContent className="sm:max-w-125 p-0">
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

      {/* SEARCH */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Search</DialogTitle>
          </DialogHeader>

          <input
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full border p-3 rounded"
          />

          <div className="mt-4 max-h-80 overflow-y-auto">
            {results.map((item: any) => (
              <div
                key={item._id}
                onClick={() => router.push(`/product/${item._id}`)}
                className="flex gap-3 p-2 hover:bg-gray-100 cursor-pointer"
              >
                <img src={item.image} className="w-10 h-10" />
                <div>
                  <p>{item.title}</p>
                  <p className="text-sm">₹{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Navbar;