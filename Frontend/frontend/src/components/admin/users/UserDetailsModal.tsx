"use client";

import { User } from "@/types/admin";
import StatusBadge from "../ui/StatusBadge";
import { getImageUrl } from "@/lib/utils";

interface Props {
  open: boolean;
  user: User | null;
  onClose: () => void;
}

export default function UserDetailsModal({
  open,
  user,
  onClose,
}: Props) {
  if (!open || !user) return null;

  const address = user.addresses?.find((a) => a.isDefault);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl rounded-xl bg-white shadow-xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b p-6">
          <div>
            <h2 className="text-xl font-bold">
              User Details
            </h2>

            <p className="text-sm text-slate-500">
              Complete information about this user.
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-2xl text-slate-500 hover:text-slate-800"
          >
            ×
          </button>
        </div>

        {/* Body */}

        <div className="space-y-6 p-6">

          <div className="flex items-center gap-4">

            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-xl font-bold">
              {user.avatar ? (
                <img
                  src={getImageUrl(user.avatar)}
                  alt={user.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>

            <div>
              <h3 className="text-lg font-bold">
                {user.name}
              </h3>

              <p className="text-sm text-slate-500">
                {user.email}
              </p>
            </div>

          </div>

          <div className="grid grid-cols-2 gap-6">

            <div>
              <p className="text-xs uppercase text-slate-500">
                Role
              </p>

              <p className="font-semibold">
                {user.role}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase text-slate-500">
                Phone
              </p>

              <p className="font-semibold">
                {address?.phone ?? "-"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase text-slate-500">
                Verified
              </p>

              <StatusBadge
                status={
                  user.isVerified
                    ? "VERIFIED"
                    : "UNVERIFIED"
                }
              />
            </div>

            <div>
              <p className="text-xs uppercase text-slate-500">
                Status
              </p>

              <StatusBadge
                status={
                  user.isActive
                    ? "ACTIVE"
                    : "INACTIVE"
                }
              />
            </div>

            <div>
              <p className="text-xs uppercase text-slate-500">
                Joined
              </p>

              <p className="font-semibold">
                {new Date(user.createdAt).toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase text-slate-500">
                Default Address
              </p>

              <p className="font-semibold">
                {address
                  ? `${address.street}, ${address.city}, ${address.state} - ${address.pincode}`
                  : "No Address"}
              </p>
            </div>

          </div>

        </div>

        {/* Footer */}

        <div className="flex justify-end border-t p-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-4 py-2 text-white hover:bg-slate-700"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}