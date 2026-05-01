import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function BusinessInfoStep({ formData, setFormData, nextStep }: any) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white border rounded-2xl p-8 space-y-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Business Name</Label>
          <Input name="businessName" placeholder="e.g. Wearix Retail" value={formData.businessName} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label>Business Type</Label>
          <Select onValueChange={(val) => setFormData({ ...formData, businessType: val })} value={formData.businessType}>
            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="INDIVIDUAL">Individual</SelectItem>
              <SelectItem value="COMPANY">Company</SelectItem>
              <SelectItem value="PARTNERSHIP">Partnership</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>GST Number</Label>
          <Input name="gstNumber" placeholder="22AAAAA0000A1Z5" value={formData.gstNumber} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label>Phone Number</Label>
          <Input name="phone" placeholder="+91" value={formData.phone} onChange={handleChange} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Street Address</Label>
        <Input name="address" placeholder="Building, Street, Area" value={formData.address} onChange={handleChange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>City</Label>
          <Input name="city" value={formData.city} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label>State</Label>
          <Input name="state" value={formData.state} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label>Pincode</Label>
          <Input name="pincode" value={formData.pincode} onChange={handleChange} />
        </div>
      </div>

      <Button onClick={nextStep} className="w-full h-12 bg-black text-white hover:bg-gray-800 rounded-xl mt-4">
        Save & Continue
      </Button>
    </div>
  );
}