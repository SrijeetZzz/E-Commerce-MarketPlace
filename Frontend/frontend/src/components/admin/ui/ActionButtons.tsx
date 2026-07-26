// "use client";

// import { useState } from "react";

// type Props = {
//   onApprove?: () => Promise<void>;
//   onReject?: () => Promise<void>;
// };

// export default function ActionButtons({ onApprove, onReject }: Props) {
//   const [loading, setLoading] = useState<"approve" | "reject" | null>(null);

//   const handleAction = async (
//     type: "approve" | "reject",
//     action?: () => Promise<void>
//   ) => {
//     if (!action) return;

//     try {
//       setLoading(type);
//       await action();
//     } catch (err) {
//       console.error(`${type} failed`, err);
//     } finally {
//       setLoading(null);
//     }
//   };

//   return (
//     <div className="flex gap-2">

//       {onApprove && (
//         <button
//           onClick={() => handleAction("approve", onApprove)}
//           disabled={loading !== null}
//           className="px-3 py-1 text-xs font-semibold rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
//         >
//           {loading === "approve" ? "..." : "Approve"}
//         </button>
//       )}

//       {onReject && (
//         <button
//           onClick={() => handleAction("reject", onReject)}
//           disabled={loading !== null}
//           className="px-3 py-1 text-xs font-semibold rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
//         >
//           {loading === "reject" ? "..." : "Reject"}
//         </button>
//       )}

//     </div>
//   );
// }
"use client";

import { useState } from "react";

export type ActionButton = {
  label: string;
  onClick: () => Promise<void> | void;
  variant?: "primary" | "success" | "danger" | "secondary";
};

type Props = {
  actions: ActionButton[];
};

const variantClasses = {
  primary:
    "bg-blue-600 hover:bg-blue-700 text-white",
  success:
    "bg-green-600 hover:bg-green-700 text-white",
  danger:
    "bg-red-600 hover:bg-red-700 text-white",
  secondary:
    "bg-slate-600 hover:bg-slate-700 text-white",
};

export default function ActionButtons({
  actions,
}: Props) {
  const [loading, setLoading] = useState<number | null>(null);

  const handleClick = async (
    index: number,
    action: ActionButton
  ) => {
    try {
      setLoading(index);
      await action.onClick();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action, index) => (
        <button
          key={index}
          disabled={loading !== null}
          onClick={() => handleClick(index, action)}
          className={`rounded-md px-3 py-1 text-xs font-semibold transition disabled:opacity-50 ${
            variantClasses[action.variant ?? "primary"]
          }`}
        >
          {loading === index ? "..." : action.label}
        </button>
      ))}
    </div>
  );
}