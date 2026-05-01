"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SellerStepper from "@/components/seller/SellerStepper";
import BusinessInfoStep from "@/components/seller/BusinessInfoStep";
import DocumentUploadStep from "@/components/seller/DocumentUploadStep";
import ReviewSubmitStep from "@/components/seller/ReviewSubmitStep";
import { SellerApplicationForm } from "@/types/seller-application-form";
import { submitSellerApplication } from "@/services/seller";

export default function SellerApplyPage() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState<SellerApplicationForm>({
    businessName: "",
    businessType: "",
    gstNumber: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    documents: [],
  });

  const nextStep = () => {
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!formData.businessType) {
      alert("Select business type");
      return;
    }

    setLoading(true);

    try {
      await submitSellerApplication({
        ...formData,
        businessType: formData.businessType,
      });

      router.push("/seller/application-status");
    } catch (error) {
      console.error("Submission failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold mb-8">Become a Seller</h1>
      <SellerStepper currentStep={step} />
      <div className="bg-white rounded-2xl shadow p-8 mt-8">
        {step === 1 && (
          <BusinessInfoStep
            formData={formData}
            setFormData={setFormData}
            nextStep={nextStep}
          />
        )}
        {step === 2 && (
          <DocumentUploadStep
            formData={formData}
            setFormData={setFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}
        {step === 3 && (
          <ReviewSubmitStep
            formData={formData}
            prevStep={prevStep}
            handleSubmit={handleSubmit}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}
