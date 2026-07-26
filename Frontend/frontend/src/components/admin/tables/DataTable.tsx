// "use client";

// import React from "react";

// export type Column<T> = {
//   key: string;
//   label: string;
//   render?: (row: T) => React.ReactNode;
//   className?: string;
// };

// type Props<T> = {
//   columns: Column<T>[];
//   data: T[];
//   isLoading?: boolean;
//   emptyText?: string;
// };

// export default function DataTable<T>({
//   columns,
//   data,
//   isLoading = false,
//   emptyText = "No data found",
// }: Props<T>) {
//   return (
//     <div className="w-full overflow-x-auto bg-white rounded-xl shadow">

//       <table className="w-full text-sm">

//         {/* HEADER */}
//         <thead className="bg-slate-100 text-slate-600">
//           <tr>
//             {columns.map((col) => (
//               <th
//                 key={col.key}
//                 className="text-left px-4 py-3 font-semibold"
//               >
//                 {col.label}
//               </th>
//             ))}
//           </tr>
//         </thead>

//         {/* BODY */}
//         <tbody>

//           {/* LOADING */}
//           {isLoading && (
//             <tr>
//               <td
//                 colSpan={columns.length}
//                 className="text-center py-6 text-slate-400"
//               >
//                 Loading...
//               </td>
//             </tr>
//           )}

//           {/* EMPTY */}
//           {!isLoading && data.length === 0 && (
//             <tr>
//               <td
//                 colSpan={columns.length}
//                 className="text-center py-6 text-slate-400"
//               >
//                 {emptyText}
//               </td>
//             </tr>
//           )}

//           {/* DATA */}
//           {!isLoading &&
//             data.map((row, rowIndex) => (
//               <tr
//                 key={rowIndex}
//                 className="border-t hover:bg-slate-50 transition"
//               >
//                 {columns.map((col) => (
//                   <td key={col.key} className="px-4 py-3">
//                     {col.render
//                       ? col.render(row)
//                       : (row as any)[col.key]}
//                   </td>
//                 ))}
//               </tr>
//             ))}

//         </tbody>
//       </table>
//     </div>
//   );
// }

"use client";

import React from "react";

export type Column<T> = {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
};

type Props<T> = {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyText?: string;

  // Optional enhancements
  onRowClick?: (row: T) => void;
  selectedRow?: (row: T) => boolean;
  rowKey?: (row: T, index: number) => React.Key;
};

export default function DataTable<T>({
  columns,
  data,
  isLoading = false,
  emptyText = "No data found",
  onRowClick,
  selectedRow,
  rowKey,
}: Props<T>) {
  return (
    <div className="w-full overflow-x-auto rounded-xl bg-white shadow">
      <table className="w-full text-sm">
        {/* HEADER */}
        <thead className="bg-slate-100 text-slate-600">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-left font-semibold ${col.className ?? ""}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {/* LOADING */}
          {isLoading && (
            <tr>
              <td
                colSpan={columns.length}
                className="py-6 text-center text-slate-400"
              >
                Loading...
              </td>
            </tr>
          )}

          {/* EMPTY */}
          {!isLoading && data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="py-6 text-center text-slate-400"
              >
                {emptyText}
              </td>
            </tr>
          )}

          {/* DATA */}
          {!isLoading &&
            data.map((row, index) => (
              <tr
                key={rowKey ? rowKey(row, index) : index}
                onClick={() => onRowClick?.(row)}
                className={`
                  border-t transition
                  ${
                    onRowClick
                      ? "cursor-pointer hover:bg-slate-50"
                      : "hover:bg-slate-50"
                  }
                  ${selectedRow?.(row) ? "bg-indigo-50" : ""}
                `}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-3 ${col.className ?? ""}`}
                  >
                    {col.render
                      ? col.render(row)
                      : (row as Record<string, unknown>)[col.key] as React.ReactNode}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}