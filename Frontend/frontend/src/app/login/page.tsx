// import LoginForm from "@/components/auth/LoginForm";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";

// const LoginPage = () => {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-muted/40">
//       <Card className="w-full max-w-md shadow-lg">
//         <CardHeader>
//           <CardTitle className="text-2xl">Welcome back</CardTitle>
//           <CardDescription>
//             Enter your credentials to login
//           </CardDescription>
//         </CardHeader>

//         <CardContent>
//           <LoginForm />
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default LoginPage;
"use client";

import LoginForm from "@/components/auth/LoginForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Sparkles } from "lucide-react";

const LoginPage = () => {
  return (
    /* FIX: We use items-start md:items-center and a large py-20 
       to ensure that on small screens the card doesn't get cut off 
       and only ONE scrollbar appears.
    */
    <div className="relative flex min-h-screen w-full flex-col items-center justify-start md:justify-center bg-[#fcfcfd] px-4 py-12 md:py-20">
      
      {/* DECORATIVE BACKGROUND */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-125 h-125 bg-slate-100 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[-5%] right-[-5%] w-100 h-100 bg-slate-200 rounded-full blur-[100px] opacity-40" />
      </div>

      {/* MAIN CARD */}
      <Card className="w-full max-w-120 border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] rounded-[40px] p-2 md:p-6 bg-white/80 backdrop-blur-xl z-10">
        <CardHeader className="space-y-4 text-center pt-8 pb-2">
          <div className="mx-auto w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl shadow-slate-200 mb-2">
            <Sparkles className="text-white" size={24} />
          </div>

          <div className="space-y-2">
            <CardTitle className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
              Welcome back
            </CardTitle>
            <CardDescription className="text-slate-500 font-medium text-base">
              Enter your credentials to access your account
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-6 pb-8">
          <LoginForm onSuccess={() => window.location.href = "/"} />
          
          <div className="mt-10 text-center">
            <p className="text-sm text-slate-400 font-medium">
              Don&apos;t have an account yet?{" "}
              <a 
                href="/register" 
                className="text-slate-900 font-bold hover:underline underline-offset-4 decoration-2 transition-all"
              >
                Create an account
              </a>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* FOOTER */}
      <footer className="mt-auto pt-12 flex gap-6 text-[10px] font-bold text-slate-300 uppercase tracking-widest opacity-70">
        <a href="#" className="hover:text-slate-500 transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-slate-500 transition-colors">Terms of Service</a>
      </footer>
    </div>
  );
};

export default LoginPage;