import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <SignIn
      appearance={{
        elements: {
          rootBox: "w-full",
          cardBox: "w-full shadow-none",
          card: "w-full shadow-none p-0 sm:p-0 bg-transparent",
          headerTitle: "text-3xl font-extrabold tracking-tight text-slate-900",
          headerSubtitle: "text-slate-500 font-medium",
          formButtonPrimary: 
            "bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-sm py-2.5 transition-all",
          formFieldInput: 
            "rounded-xl border-slate-200 focus:ring-slate-900 focus:border-slate-900 shadow-sm transition-all",
          formFieldLabel: "text-slate-700 font-semibold",
          socialButtonsBlockButton: 
            "border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all",
          footerActionLink: "text-slate-900 hover:text-slate-700 font-bold",
          dividerLine: "bg-slate-200",
          dividerText: "text-slate-400 font-medium",
          formFieldAction: "text-slate-600 hover:text-slate-900",
        },
      }}
    />
  );
}