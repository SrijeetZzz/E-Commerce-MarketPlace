"use client";

type Props = {
  status: string;
};

const statusStyles: Record<string, string> = {
  // Generic
  PENDING: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",

  // Listings
  ACTIVE: "bg-green-100 text-green-700",
  PENDING_APPROVAL: "bg-yellow-100 text-yellow-700",
  BLOCKED: "bg-gray-200 text-gray-700",

  // Orders
  PLACED: "bg-blue-100 text-blue-700",
  CONFIRMED: "bg-indigo-100 text-indigo-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",

  // Returns
  REQUESTED: "bg-yellow-100 text-yellow-700",
  COMPLETED: "bg-green-100 text-green-700",

  //users

  INACTIVE: "bg-red-100 text-red-700",
  VERIFIED: "bg-green-100 text-green-700",
  UNVERIFIED: "bg-yellow-100 text-yellow-700",
};

export default function StatusBadge({ status }: Props) {
  const style = statusStyles[status] || "bg-gray-100 text-gray-600";

  return (
    <span
      className={`px-2 py-1 text-xs font-semibold rounded-md inline-block ${style}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}
