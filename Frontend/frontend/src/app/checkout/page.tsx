"use client";

import { useEffect, useState } from "react";
import { Cart } from "@/types/cart";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, ShoppingBag, Plus, Check, Loader2, Star } from "lucide-react";
import { Address, AddressForm } from "@/types/order";
import { getCart } from "@/services/cart";



const CheckoutPage=()=> {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  const [addressForm, setAddressForm] = useState<AddressForm>({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const router = useRouter();

  const mapToForm = (addr: Address): AddressForm => ({
    fullName: addr.fullName,
    phone: addr.phone,
    street: addr.street,
    city: addr.city,
    state: addr.state,
    pincode: addr.pincode,
  });

  const fetchData = async () => {
    try {
      const res = await api.get("/user/address");
      const data: Address[] = res?.data?.data || [];
      setAddresses(data);

      const defaultAddr = data.find((a) => a.isDefault);
      if (defaultAddr && !selectedAddressId) {
        setSelectedAddressId(defaultAddr._id);
        setAddressForm(mapToForm(defaultAddr));
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    const fetchCart = async () => {
        try {
          const data = await getCart();
          setCart(data);
          await fetchData(); 
        } catch (err) {
          console.error("Cart fetch failed", err);
        } finally {
          setLoading(false);
        }
      };
    fetchCart();
  }, [router]);

  const subtotal = cart?.items.reduce((sum, item) => sum + item.priceAtAdd * item.quantity, 0) || 0;
  const shipping = subtotal > 1000 ? 0 : 100;
  const convenienceFee = 50;
  const total = subtotal + shipping + convenienceFee;

  // 🔥 TOGGLE DEFAULT
  const handleSetDefault = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevents selecting card for checkout
    try {
      await api.patch(`/user/address/${id}/default`);
      await fetchData(); // Refresh list to see the badge move
    } catch (err) {
      alert("Failed to update default address.");
    }
  };

  const handleAddAddress = async () => {
    if (!addressForm.fullName || !addressForm.phone || !addressForm.pincode) return;
    try {
      setSavingAddress(true);
      await api.post("/user/address", addressForm);
      await fetchData();
      alert("Address saved successfully!");
    } catch {
      alert("Failed to add address");
    } finally {
      setSavingAddress(false);
    }
  };

  const handleCheckout = async () => {
    if (!addressForm.fullName) {
      alert("Please select or enter a delivery address");
      return;
    }
    try {
      setPlacing(true);
      const res = await api.post("/checkout", { address: addressForm });
      router.push(`/payment/${res.data.data._id}`);
    } catch {
      alert("Checkout failed");
    } finally {
      setPlacing(false);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <header className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Checkout</h1>
          <p className="text-slate-500">Securely complete your purchase</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="bg-white border-b border-slate-100">
                <CardTitle className="flex gap-2 items-center text-lg font-semibold text-slate-800">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                  Delivery Address
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6 md:p-8 space-y-8 bg-white">
                
                {/* SAVED ADDRESSES GRID */}
                {addresses.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr._id}
                        onClick={() => {
                          setSelectedAddressId(addr._id);
                          setAddressForm(mapToForm(addr));
                        }}
                        className={`group relative p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                          selectedAddressId === addr._id 
                            ? "border-indigo-600 bg-indigo-50/50 shadow-md" 
                            : "border-slate-100 hover:border-slate-200 bg-slate-50/30"
                        }`}
                      >
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <p className="font-bold text-slate-900">{addr.fullName}</p>
                            {selectedAddressId === addr._id && (
                              <Check className="w-4 h-4 text-indigo-600" />
                            )}
                          </div>
                          <p className="text-sm text-slate-600 leading-snug mb-3 line-clamp-2">
                            {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/50">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">
                            {addr.phone}
                          </p>

                          {/* DEFAULT BADGE OR SET BUTTON */}
                          {addr.isDefault ? (
                            <span className="flex items-center gap-1 text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">
                              <Star size={10} fill="currentColor" /> Default
                            </span>
                          ) : (
                            <button
                              onClick={(e) => handleSetDefault(e, addr._id)}
                              className="text-[9px] text-indigo-600 font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                            >
                              Set as Default
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="relative py-2 text-center">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
                  <span className="relative bg-white px-4 text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                    Add New Address
                  </span>
                </div>

                {/* FORM */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-left">
                      <Label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">Full Name</Label>
                      <Input 
                        placeholder="Receiver's name" 
                        value={addressForm.fullName}
                        onChange={(e) => {
                          setSelectedAddressId(null);
                          setAddressForm(p => ({ ...p, fullName: e.target.value }));
                        }}
                        className="rounded-xl h-11"
                      />
                    </div>
                    <div className="space-y-1.5 text-left">
                      <Label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">Phone</Label>
                      <Input 
                        placeholder="Mobile number" 
                        value={addressForm.phone}
                        onChange={(e) => {
                          setSelectedAddressId(null);
                          setAddressForm(p => ({ ...p, phone: e.target.value }));
                        }}
                        className="rounded-xl h-11"
                      />
                    </div>
                  </div>
                  <Input 
                    placeholder="Street Address" 
                    value={addressForm.street}
                    className="rounded-xl h-11"
                    onChange={(e) => {
                      setSelectedAddressId(null);
                      setAddressForm(p => ({ ...p, street: e.target.value }));
                    }}
                  />
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <Input placeholder="City" value={addressForm.city} onChange={(e) => setAddressForm(p => ({ ...p, city: e.target.value }))} className="rounded-xl h-11" />
                    <Input placeholder="State" value={addressForm.state} onChange={(e) => setAddressForm(p => ({ ...p, state: e.target.value }))} className="rounded-xl h-11" />
                    <Input placeholder="Pincode" value={addressForm.pincode} onChange={(e) => setAddressForm(p => ({ ...p, pincode: e.target.value }))} className="rounded-xl h-11" />
                  </div>

                  <Button
                    onClick={handleAddAddress}
                    disabled={savingAddress || !!selectedAddressId || !addressForm.fullName}
                    variant="outline"
                    className="w-full h-12 border-dashed border-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:border-indigo-600 hover:bg-indigo-50 transition-all font-semibold"
                  >
                    {savingAddress ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4 mr-2" /> Save this address</>}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: SUMMARY */}
          <div className="lg:col-span-1">
            <Card className="border-none shadow-md rounded-2xl sticky top-8 overflow-hidden bg-white">
              <CardHeader className="bg-white border-b border-slate-50">
                <CardTitle className="flex gap-2 items-center text-lg font-bold">
                  <ShoppingBag className="w-5 h-5 text-slate-400" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Shipping</span>
                  <span className={`font-bold ${shipping === 0 ? "text-green-600" : "text-slate-900"}`}>
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-slate-600 border-b pb-4">
                  <span>Convenience Fee</span>
                  <span className="font-bold text-slate-900">₹{convenienceFee}</span>
                </div>

                <div className="pt-2 flex justify-between items-end">
                  <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Payable Amount</span>
                  <span className="text-3xl font-black text-slate-900 tracking-tighter">₹{total}</span>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={placing || !addressForm.fullName}
                  className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-lg font-bold shadow-xl shadow-slate-200 transition-all mt-4"
                >
                  {placing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm & Pay"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;