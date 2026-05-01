"use client";

import { useState, ChangeEvent } from "react";
import { submitBankDetails } from "@/services/seller";
import { BankDetailsPayload } from "@/types/bank";
import { Button } from "@/components/ui/button";
import { FileText, ShieldCheck } from "lucide-react";

type FormState = BankDetailsPayload & {
  confirmAccountNumber: string;
};

type Props = {
  onSuccess: () => void;
};

export default function BankVerificationForm({ onSuccess }: Props) {
  const [form, setForm] = useState<FormState>({
    accountHolderName: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    documentUrl: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm({ ...form, documentUrl: file.name });
  };

  const validate = () => {
    if (!form.accountHolderName || !form.accountNumber || !form.confirmAccountNumber || !form.ifscCode || !form.documentUrl) {
      alert("Fill all fields");
      return false;
    }
    if (form.accountNumber !== form.confirmAccountNumber) {
      alert("Account numbers do not match");
      return false;
    }
    return true;
  };

  const submit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const payload: BankDetailsPayload = {
        accountHolderName: form.accountHolderName,
        accountNumber: form.accountNumber,
        ifscCode: form.ifscCode,
        documentUrl: form.documentUrl
      };
      await submitBankDetails(payload);
      onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 text-xs text-blue-800 bg-blue-50 p-3 rounded-lg border border-blue-100">
        <ShieldCheck size={16} className="shrink-0" />
        <p>Details are strictly used for secure payout verification.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3">
        <div className="md:col-span-2">
          <label className="text-xs font-bold mb-1 block text-gray-500 uppercase tracking-tight">Account Holder Name</label>
          <input
            name="accountHolderName"
            value={form.accountHolderName}
            onChange={handleChange}
            placeholder="Full name as per bank records"
            className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-black outline-none transition"
          />
        </div>

        <div>
          <label className="text-xs font-bold mb-1 block text-gray-500 uppercase tracking-tight">Account Number</label>
          <input
            name="accountNumber"
            value={form.accountNumber}
            onChange={handleChange}
            placeholder="Bank account number"
            className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-black outline-none transition"
          />
        </div>

        <div>
          <label className="text-xs font-bold mb-1 block text-gray-500 uppercase tracking-tight">Confirm Number</label>
          <input
            name="confirmAccountNumber"
            value={form.confirmAccountNumber}
            onChange={handleChange}
            placeholder="Re-enter number"
            className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-black outline-none transition"
          />
        </div>

        <div>
          <label className="text-xs font-bold mb-1 block text-gray-500 uppercase tracking-tight">IFSC Code</label>
          <input
            name="ifscCode"
            value={form.ifscCode}
            onChange={handleChange}
            placeholder="e.g. HDFC0001234"
            className="w-full border rounded-lg p-2.5 text-sm uppercase focus:ring-2 focus:ring-black outline-none transition"
          />
        </div>

        <div>
          <label className="text-xs font-bold mb-1 block text-gray-500 uppercase tracking-tight">Bank Proof</label>
          <label className="border border-dashed border-gray-300 rounded-lg p-2 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition h-10.5">
            <div className="flex items-center gap-2">
              <FileText size={14} className="text-gray-400" />
              <span className="text-xs text-gray-600 truncate max-w-30">
                {form.documentUrl || "Upload Proof"}
              </span>
            </div>
            <input type="file" onChange={handleFileChange} className="hidden" />
          </label>
        </div>
      </div>

      <Button
        onClick={submit}
        disabled={loading}
        className="w-full h-11 rounded-lg bg-black hover:bg-gray-800 text-white font-bold text-sm shadow-md transition mt-2"
      >
        {loading ? "Processing..." : "Verify & Save Details"}
      </Button>
    </div>
  );
}