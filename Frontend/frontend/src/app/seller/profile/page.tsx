"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/context/AuthContext";
import api from "@/services/api";
import {
  getMyApplication,
  getMyBankDetails,
} from "@/services/seller";
import { SellerApplication } from "@/types/seller";
import { BankDetails } from "@/types/bank";
import {
  Building2,
  Landmark,
  Mail,
  ShieldCheck,
  AlertCircle,
  Phone,
  MapPin,
  Loader2,
  Camera,
  User as UserIcon,
} from "lucide-react";
import toast from "react-hot-toast";

const SellerProfilePage = () => {
  // ✅ CHANGED: use updateUser instead of setUser
  const { user, loading: authLoading, updateUser } = useAuth();

  const [application, setApplication] = useState<SellerApplication | null>(null);
  const [bank, setBank] = useState<BankDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [appData, bankData] = await Promise.all([
          getMyApplication(),
          getMyBankDetails(),
        ]);
        setApplication(appData);
        setBank(bankData);
      } catch (err) {
        console.error("Profile fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    const loadingToast = toast.loading("Uploading picture...");

    try {
      const res = await api.post("/auth/avatar", formData);

      // ✅ FIX: update only avatar (no full overwrite)
      updateUser({
        avatar: res.data.data.avatar,
      });

      toast.success("Profile picture updated", { id: loadingToast });
    } catch (err) {
      console.error("Upload failed", err);
      toast.error("Failed to upload image", { id: loadingToast });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin text-slate-400" size={32} />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      approved: "bg-emerald-50 text-emerald-700 border-emerald-100",
      pending: "bg-amber-50 text-amber-700 border-amber-100",
      rejected: "bg-rose-50 text-rose-700 border-rose-100",
    };
    const current =
      styles[status?.toLowerCase()] ||
      "bg-slate-50 text-slate-600 border-slate-100";

    return (
      <span
        className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${current}`}
      >
        {status || "Unknown"}
      </span>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6 text-slate-800">
      {/* PROFILE TOP CARD */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-slate-50 bg-slate-100 flex items-center justify-center border border-slate-200 shadow-inner">
            {user?.avatar ? (
              <img
                src={`http://localhost:5000${user.avatar}`}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.src = "/placeholder.png")}
              />
            ) : (
              <UserIcon size={40} className="text-slate-300" />
            )}
          </div>
          <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-200">
            <Camera size={20} />
            <input type="file" hidden onChange={handleUpload} accept="image/*" />
          </label>
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {user?.name}
            </h1>
            {getStatusBadge(application?.status || "Guest")}
          </div>
          <p className="text-slate-500 flex items-center justify-center md:justify-start gap-2 mt-1 font-medium">
            <Mail size={14} className="text-slate-400" /> {user?.email}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 shadow-sm">
          <ShieldCheck size={16} className="text-indigo-600" />
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
            {user?.role} Tier
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* BUSINESS INFO */}
        <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/40">
            <Building2 size={18} className="text-slate-400" />
            <h2 className="font-bold text-sm uppercase tracking-wider text-slate-600">
              Business Details
            </h2>
          </div>

          <div className="p-6">
            {!application ? (
              <p className="text-sm text-slate-400 italic text-center py-4">
                No business details submitted.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <InfoBox label="Legal Entity Name" value={application.businessName} />
                <InfoBox label="Type" value={application.businessType} />
                <InfoBox label="Phone" value={application.phone} icon={<Phone size={14} />} />
                <InfoBox label="Operating City" value={`${application.city}, ${application.state}`} icon={<MapPin size={14} />} />
                <div className="md:col-span-2 space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                    Registered Address
                  </p>
                  <p className="text-base text-slate-700 font-medium leading-relaxed">
                    {application.address}, {application.pincode}
                  </p>
                </div>

                {application.rejectionReason && (
                  <div className="md:col-span-2 p-3 bg-rose-50 border border-rose-100 rounded-lg flex items-center gap-3">
                    <AlertCircle size={16} className="text-rose-500" />
                    <p className="text-sm text-rose-700">
                      <strong>Rejected:</strong> {application.rejectionReason}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* BANK INFO */}
        <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/40">
            <Landmark size={18} className="text-slate-400" />
            <h2 className="font-bold text-sm uppercase tracking-wider text-slate-600">
              Payout Information
            </h2>
          </div>

          <div className="p-6">
            {!bank ? (
              <p className="text-sm text-slate-400 italic text-center py-4">
                Payout method not configured.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <InfoBox label="Account Holder" value={bank.accountHolderName} />
                <InfoBox label="IFSC Code" value={bank.ifscCode} />
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                    Account Number
                  </p>
                  <p className="text-lg font-mono font-bold text-slate-800 tracking-widest">
                    •••• {bank.accountNumber.slice(-4)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

const InfoBox = ({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string;
  icon?: React.ReactNode;
}) => (
  <div className="space-y-1">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
      {label}
    </p>
    <div className="flex items-center gap-2 text-slate-700">
      {icon && <span className="text-slate-300">{icon}</span>}
      <p className="text-base font-semibold">{value || "—"}</p>
    </div>
  </div>
);

export default SellerProfilePage;