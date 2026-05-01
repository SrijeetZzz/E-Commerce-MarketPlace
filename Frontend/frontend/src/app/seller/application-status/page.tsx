"use client";

import { useEffect, useState } from "react";
import { getMyApplication, getMyBankDetails } from "@/services/seller";
import { SellerApplication } from "@/types/seller";
import { BankDetails } from "@/types/bank";
import BankVerificationForm from "@/components/seller/BankVerificationForm";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Building2,
  MapPin,
  Phone,
  FileText,
  CreditCard,
  ExternalLink,
} from "lucide-react";

export default function StatusPage() {
  const [app, setApp] = useState<SellerApplication | null>(null);
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBankModal, setShowBankModal] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const appData = await getMyApplication();
      setApp(appData as any);
      const bankData = await getMyBankDetails();
      setBankDetails(bankData as any);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black" />
      </div>
    );
  }

  if (!app) return <div className="p-10 text-center">No application found</div>;

  const statusConfig = {
    PENDING: {
      color: "bg-amber-50 text-amber-700 border-amber-200",
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      title: "Application Under Review",
      description:
        "We are currently verifying your business documents. This usually takes 1-2 business days.",
    },
    APPROVED: {
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      title: "Application Approved",
      description: "Congratulations! Your business details are verified.",
    },
    REJECTED: {
      color: "bg-red-50 text-red-700 border-red-200",
      icon: <XCircle className="w-5 h-5 text-red-600" />,
      title: "Application Rejected",
      description:
        app.rejectionReason || "Please check your email for more details.",
    },
  };

  const currentStatus = statusConfig[app.status as keyof typeof statusConfig];
  const needsBankVerification = app.status === "APPROVED" && !bankDetails;
  const bankPending = bankDetails?.status === "PENDING";
  const bankVerified = bankDetails?.status === "VERIFIED";

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Seller Onboarding
          </h1>
          <p className="text-gray-500">
            View and manage your application status
          </p>
        </div>
        <Badge
          variant="outline"
          className="w-fit px-4 py-1 text-sm font-medium uppercase tracking-wider"
        >
          ID: {app._id?.slice(-8)}
        </Badge>
      </div>

      <div
        className={`p-6 rounded-2xl border flex gap-4 items-start mb-8 transition-all ${currentStatus.color}`}
      >
        <div className="mt-1">{currentStatus.icon}</div>
        <div>
          <h3 className="font-bold text-lg">{currentStatus.title}</h3>
          <p className="text-sm opacity-90 leading-relaxed">
            {currentStatus.description}
          </p>
        </div>
      </div>

      {/* Action Cards for Bank Details */}
      {needsBankVerification && (
        <Card className="mb-8 p-6 rounded-2xl border-2 border-black bg-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex gap-4">
            <div className="p-3 bg-gray-100 rounded-full h-fit">
              <CreditCard className="w-6 h-6 text-black" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-gray-900">
                Step 2: Bank Verification
              </h3>
              <p className="text-sm text-gray-600 max-w-md">
                Your application is approved! Now submit your bank details to
                enable payouts and start selling.
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowBankModal(true)}
            className="w-full md:w-auto px-8 h-12 bg-black text-white hover:bg-gray-800 rounded-xl"
          >
            Submit Bank Details
          </Button>
        </Card>
      )}

      {bankPending && (
        <div className="mb-8 p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 flex items-center gap-3">
          <Clock size={18} />
          <p className="text-sm font-medium">
            Payout verification is in progress. You will be notified once
            complete.
          </p>
        </div>
      )}

      {bankVerified && (
        <div className="mb-8 p-4 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-800 flex items-center gap-3">
          <CheckCircle2 size={18} />
          <p className="text-sm font-medium">
            Your account is fully activated. Happy selling!
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Info */}
        <Card className="p-8 md:col-span-2 rounded-2xl shadow-sm border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <Building2 size={18} className="text-gray-400" />
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
              Business Profile
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <DetailItem label="Business Name" value={app.businessName} />
            <DetailItem
              label="Business Type"
              value={app.businessType}
              isBadge
            />
            <DetailItem
              label="GST Number"
              value={app.gstNumber || "N/A"}
              isMono
            />
            <DetailItem
              label="Phone Number"
              value={app.phone}
              icon={<Phone size={12} />}
            />
          </div>

          <div className="border-t border-dashed pt-8 mt-8">
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={18} className="text-gray-400" />
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                Address
              </h3>
            </div>
            <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
              {app.address}
              <br />
              <span className="font-medium">
                {app.city}, {app.state} — {app.pincode}
              </span>
            </p>
          </div>
        </Card>

        {/* Documents Section */}
        <Card className="p-8 rounded-2xl shadow-sm border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <FileText size={18} className="text-gray-400" />
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
              Documents
            </h3>
          </div>
          <div className="space-y-3">
            {app.documents.map((doc, i) => (
              <div
                key={i}
                className="group flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-100 transition-colors cursor-default"
              >
                <span className="text-xs font-medium text-gray-600 truncate max-w-35">
                  {doc}
                </span>
                <ExternalLink
                  size={14}
                  className="text-gray-300 group-hover:text-black transition-colors"
                />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Modal - WIDTH INCREASED HERE */}
      <Dialog open={showBankModal} onOpenChange={setShowBankModal}>
        {/* Increased max-width and removed inner padding/margins */}
        <DialogContent className="max-w-4xl w-[95vw] rounded-2xl p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-6 bg-black text-white">
            <DialogTitle className="text-xl font-bold">
              Bank Account Verification
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-sm">
              Provide payout details to activate your seller account.
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 bg-white">
            <BankVerificationForm
              onSuccess={() => {
                setShowBankModal(false);
                load();
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper Component
function DetailItem({ label, value, isBadge, isMono, icon }: any) {
  return (
    <div>
      <p className="text-[10px] text-gray-400 uppercase font-bold mb-1 tracking-wider">
        {label}
      </p>
      {isBadge ? (
        <Badge variant="secondary" className="font-semibold">
          {value}
        </Badge>
      ) : (
        <p
          className={`text-gray-900 flex items-center gap-2 ${isMono ? "font-mono text-sm" : "font-semibold"}`}
        >
          {icon} {value}
        </p>
      )}
    </div>
  );
}
