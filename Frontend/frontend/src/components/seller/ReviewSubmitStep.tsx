import { Card } from "@/components/ui/card";
import { Button } from "../ui/button";
import { CheckCircle2 } from "lucide-react";
import { SellerApplicationForm } from "@/types/seller-application-form";

type Props = {
  formData: SellerApplicationForm;
  prevStep: () => void;
  handleSubmit: () => Promise<void>;
  loading: boolean;
};

export default function ReviewSubmitStep({
  formData,
  prevStep,
  handleSubmit,
  loading,
}: Props) {
  return (
    <div className="space-y-8">
      <Card className="p-6 rounded-2xl shadow-sm border space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="space-y-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Business Details
            </h3>
            <p className="font-semibold text-lg">{formData.businessName}</p>
            <p className="text-sm text-gray-500">Type: {formData.businessType}</p>
            {formData.gstNumber && (
              <p className="text-sm text-gray-500">GST: {formData.gstNumber}</p>
            )}
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Contact & Address
            </h3>
            <p className="text-sm">{formData.phone}</p>
            <p className="text-sm text-gray-500">{formData.address}</p>
            <p className="text-sm text-gray-500">
              {formData.city}, {formData.state} - {formData.pincode}
            </p>
          </section>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
            Uploaded Documents
          </h3>
          <div className="space-y-2">
            {formData.documents?.length > 0 ? (
              formData.documents.map((doc: string, i: number) => (
                <p key={i} className="text-sm bg-gray-50 rounded-lg p-3">
                  {doc}
                </p>
              ))
            ) : (
              <p className="text-sm text-gray-400">No documents uploaded</p>
            )}
          </div>
        </div>
      </Card>

      <div className="bg-blue-50 p-4 rounded-xl flex gap-3 items-center text-blue-800 text-sm">
        <CheckCircle2 size={20} />
        By submitting, you confirm all information provided is accurate.
      </div>

      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={loading}
          className="flex-1 h-12 rounded-xl"
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 h-12 bg-black text-white rounded-xl shadow-lg shadow-black/10 hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Application"}
        </Button>
      </div>
    </div>
  );
}