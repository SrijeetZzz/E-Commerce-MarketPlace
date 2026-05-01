"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import {
  Mail,
  MapPin,
  Camera,
  User as UserIcon,
  CheckCircle,
  ShieldCheck,
  Plus,
  Trash2,
  Star,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast"; // ✅ added

type Address = {
  _id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
};

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  isVerified: boolean;
  addresses: Address[];
  createdAt: string;
};

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: "", email: "" });

  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await api.get("/auth/me");
        setUser(userRes.data);
        setEditData({ name: userRes.data.name, email: userRes.data.email });

        const addrRes = await api.get("/user/address");
        setAddresses(addrRes.data.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile"); // ✅
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await api.post("/auth/avatar", formData);
      setUser(res.data.data);
      toast.success("Profile picture updated"); // ✅
    } catch (err) {
      console.error("Upload failed", err);
      toast.error("Failed to upload image"); // ✅
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await api.patch("/auth/profile", editData);
      setUser(res.data.data);
      setIsEditing(false);
      toast.success("Profile updated"); // ✅
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile"); // ✅
    }
  };

  const handleAddAddress = async () => {
    if (!newAddress.fullName || !newAddress.phone || !newAddress.pincode) {
      toast.error("Fill required fields"); // ✅
      return;
    }

    try {
      const res = await api.post("/user/address", newAddress);
      setAddresses(res.data.data);
      setNewAddress({
        fullName: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
      });
      toast.success("Address added"); // ✅
    } catch (err) {
      console.error(err);
      toast.error("Failed to add address"); // ✅
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/user/address/${id}`);
      setAddresses((prev) => prev.filter((a) => a._id !== id));
      toast.success("Address removed"); // ✅
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete address"); // ✅
    }
  };

  const handleDefault = async (id: string) => {
    try {
      const res = await api.patch(`/user/address/${id}/default`);
      setAddresses(res.data.data);
      toast.success("Default address updated"); // ✅
    } catch (err) {
      console.error(err);
      toast.error("Failed to update default"); // ✅
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-2">
        <Loader2 className="animate-spin text-gray-400" size={32} />
        <p className="text-gray-500 font-medium">Loading your profile...</p>
      </div>
    );

  if (!user)
    return (
      <div className="p-10 text-center text-slate-500 font-bold">
        User not found
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* TOP CARD: PROFILE SUMMARY */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-gray-50 transition-transform group-hover:scale-105">
              <img
                src={
                  user.avatar
                    ? `http://localhost:5000${user.avatar}`
                    : "/placeholder.png"
                }
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.src = "/placeholder.png")}
              />
            </div>
            <label className="absolute bottom-1 right-1 bg-black text-white p-2 rounded-full cursor-pointer hover:bg-gray-800 transition-colors shadow-lg border-2 border-white">
              <Camera size={16} />
              <input type="file" hidden onChange={handleUpload} />
            </label>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                {user.name}
              </h1>
              <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase">
                {user.role}
              </span>
              {user.isVerified && (
                <CheckCircle size={20} className="text-green-500" />
              )}
            </div>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-gray-500 text-sm">
              <span className="flex items-center gap-1.5">
                <Mail size={16} /> {user.email}
              </span>
              <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-gray-300"></span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={16} /> Member since{" "}
                {new Date(user.createdAt).getFullYear()}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-6 py-2.5 bg-white border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT SIDE: SETTINGS & ADD ADDRESS */}
          <div className="lg:col-span-2 space-y-8">
            {/* ACCOUNT FORM */}
            <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 transition-all">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <UserIcon className="text-gray-400" size={22} />
                {isEditing ? "Update Information" : "Account Details"}
              </h3>

              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                        Full Name
                      </label>
                      <input
                        value={editData.name}
                        onChange={(e) =>
                          setEditData({ ...editData, name: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:bg-white outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                        Email Address
                      </label>
                      <input
                        value={editData.email}
                        onChange={(e) =>
                          setEditData({ ...editData, email: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:bg-white outline-none transition-all"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-95"
                  >
                    Save Changes
                  </button>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-2">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Display Name
                    </p>
                    <p className="text-lg font-semibold text-gray-800">
                      {user.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Email
                    </p>
                    <p className="text-lg font-semibold text-gray-800">
                      {user.email}
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* NEW ADDRESS FORM */}
            <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Plus className="text-gray-400" size={22} /> Add New Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  placeholder="Full Name"
                  value={newAddress.fullName}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, fullName: e.target.value })
                  }
                  className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black"
                />
                <input
                  placeholder="Phone"
                  value={newAddress.phone}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, phone: e.target.value })
                  }
                  className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black"
                />
                <input
                  placeholder="Street Address"
                  value={newAddress.street}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, street: e.target.value })
                  }
                  className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black md:col-span-2"
                />
                <input
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, city: e.target.value })
                  }
                  className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black"
                />
                <input
                  placeholder="State"
                  value={newAddress.state}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, state: e.target.value })
                  }
                  className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black"
                />
                <input
                  placeholder="Pincode"
                  value={newAddress.pincode}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, pincode: e.target.value })
                  }
                  className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black md:col-span-2"
                />
              </div>
              <button
                onClick={handleAddAddress}
                className="mt-6 w-full bg-gray-100 text-gray-900 font-bold py-3 rounded-xl hover:bg-gray-200 transition-all"
              >
                Add Address
              </button>
            </section>
          </div>

          {/* RIGHT SIDE: ADDRESS LIST */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 px-2">
              <MapPin className="text-gray-400" size={22} /> My Addresses
            </h3>

            <div className="space-y-4">
              {addresses.length === 0 && (
                <p className="text-gray-400 text-sm px-2 italic">
                  No addresses saved yet.
                </p>
              )}
              {addresses.map((addr) => (
                <div
                  key={addr._id}
                  className={`group bg-white p-5 rounded-2xl border-2 transition-all ${addr.isDefault ? "border-black shadow-md" : "border-gray-100 hover:border-gray-200"}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="space-y-1">
                      <p className="font-bold text-gray-900">{addr.fullName}</p>
                      {addr.isDefault && (
                        <span className="inline-flex items-center gap-1 bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">
                          <Star size={8} fill="currentColor" /> Default
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(addr._id)}
                      className="text-gray-300 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="text-sm text-gray-600 leading-relaxed">
                    <p>{addr.street}</p>
                    <p>
                      {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                    <p className="mt-2 font-medium text-gray-400">
                      T: {addr.phone}
                    </p>
                  </div>

                  {!addr.isDefault && (
                    <button
                      onClick={() => handleDefault(addr._id)}
                      className="mt-4 w-full text-xs font-bold text-gray-400 hover:text-black uppercase tracking-widest border-t pt-3 transition-colors"
                    >
                      Set as Default
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
