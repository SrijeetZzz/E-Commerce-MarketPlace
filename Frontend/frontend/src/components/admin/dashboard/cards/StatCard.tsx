// import { Card, CardContent } from "@/components/ui/card";

// interface StatCardProps {
//   title: string;
//   value: string | number;
//   icon: React.ReactNode;
//   iconBg?: string;
// }

// export default function StatCard({
//   title,
//   value,
//   icon,
//   iconBg = "bg-primary/10",
// }: StatCardProps) {
//   return (
//     <Card className="hover:shadow-lg transition-all duration-300">
//       <CardContent className="flex items-center justify-between p-6">
//         <div className="space-y-1">
//           <p className="text-sm text-muted-foreground">{title}</p>

//           <h2 className="text-3xl font-bold tracking-tight">{value}</h2>
//         </div>

//         <div
//           className={`flex h-14 w-14 items-center justify-center rounded-xl ${iconBg}`}
//         >
//           {icon}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  iconBg = "bg-slate-100 dark:bg-zinc-800",
}: StatCardProps) {
  return (
    <Card className="group relative overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
      <CardContent className="flex items-center justify-between p-6">
        <div className="space-y-1.5 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
            {title}
          </p>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-50 sm:text-3xl font-mono truncate">
            {value}
          </h2>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ring-black/5 dark:ring-white/10 ${iconBg} transition-transform duration-300 group-hover:scale-110`}
        >
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}