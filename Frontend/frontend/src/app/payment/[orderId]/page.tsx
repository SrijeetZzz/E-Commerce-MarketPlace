"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Lock, CreditCard, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const PaymentPage = () => {
  const { orderId } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handlePayment = async (success: boolean) => {
    try {
      setLoading(true);

      await api.post(`/orders/${orderId}/payment`, {
        success,
      });

      // Redirecting to orders after simulated processing
      router.push(`/orders`);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Payment processing failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-[#fcfcfd] px-4 overflow-hidden">
      
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-100 h-100 bg-slate-100 rounded-full blur-[100px] opacity-60" />
        <div className="absolute bottom-[-5%] right-[-5%] w-75 h-75 bg-slate-200 rounded-full blur-[80px] opacity-40" />
      </div>

      <Card className="w-full max-w-110 border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] rounded-[40px] overflow-hidden bg-white/80 backdrop-blur-xl">
        <CardContent className="p-8 md:p-12 text-center">
          
          {/* Secure Icon Header */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-20 h-20 bg-slate-900 rounded-[24px] flex items-center justify-center shadow-2xl shadow-slate-200">
                <CreditCard className="text-white" size={32} />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <ShieldCheck className="text-white" size={16} />
              </div>
            </div>
          </div>

          {/* Typography */}
          <div className="space-y-3 mb-10">
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Secure Payment</h1>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Complete your transaction for order .
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <Button
              onClick={() => handlePayment(true)}
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base shadow-xl shadow-slate-200 transition-all active:scale-95 group"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  Pay Securely
                  <Lock size={16} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
              )}
            </Button>

            <Button
              variant="ghost"
              onClick={() => handlePayment(false)}
              disabled={loading}
              className="w-full h-12 rounded-2xl text-slate-400 hover:text-red-500 hover:bg-red-50 font-bold text-xs uppercase tracking-widest transition-all"
            >
              {loading ? "Please Wait" : "Simulate Failure"}
            </Button>
          </div>

          {/* Trust Footer */}
          <div className="mt-12 pt-8 border-t border-slate-50 flex flex-col items-center gap-4">
            <div className="flex items-center gap-6 grayscale opacity-30">
                <img src="https://www.svgrepo.com/show/303243/visa-logo.svg" className="h-4" alt="Visa" />
                <img src="https://www.svgrepo.com/show/303215/mastercard-2-logo.svg" className="h-6" alt="Mastercard" />
                <img src="https://www.svgrepo.com/show/443423/razorpay.svg" className="h-4" alt="Razorpay" />
            </div>
            <p className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              <Lock size={10} /> 256-bit SSL Encrypted
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Background Back Button */}
      <footer className="mt-8">
        <button 
            onClick={() => router.back()}
            className="text-[11px] font-black text-slate-300 hover:text-slate-900 uppercase tracking-widest transition-colors"
        >
            Cancel and Return
        </button>
      </footer>
    </main>
    </ProtectedRoute>
  );
};

export default PaymentPage;