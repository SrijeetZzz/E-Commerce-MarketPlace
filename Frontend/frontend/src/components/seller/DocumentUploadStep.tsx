import { Upload, FileText, X } from "lucide-react";
import { Button } from "../ui/button";

export default function DocumentUploadStep({ formData, setFormData, nextStep, prevStep }: any) {
  const handleUpload = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData({ ...formData, documents: [...formData.documents, file.name] });
  };

  return (
    <div className="bg-white border rounded-2xl p-8 space-y-6 shadow-sm">
      <div className="text-center space-y-2 mb-6">
        <h2 className="text-xl font-bold">Upload Verification Documents</h2>
        <p className="text-gray-500 text-sm">Please upload your ID Proof and Business Registration (PDF/JPG)</p>
      </div>

      <label className="border-2 border-dashed border-gray-200 rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
        <Upload className="text-gray-400 mb-4" size={40} />
        <span className="font-medium">Click to upload documents</span>
        <input type="file" className="hidden" onChange={handleUpload} />
      </label>

      <div className="space-y-3">
        {formData.documents.map((doc: string, i: number) => (
          <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border">
            <div className="flex items-center gap-3">
              <FileText className="text-blue-600" size={20} />
              <span className="text-sm font-medium">{doc}</span>
            </div>
            <button className="text-gray-400 hover:text-red-500"><X size={18} /></button>
          </div>
        ))}
      </div>

      <div className="flex gap-4 pt-6">
        <Button variant="outline" onClick={prevStep} className="flex-1 h-12 rounded-xl">Back</Button>
        <Button onClick={nextStep} className="flex-1 h-12 bg-black text-white rounded-xl">Continue</Button>
      </div>
    </div>
  );
}