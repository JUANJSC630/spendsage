import Image from "next/image";
import React from "react";
import { ShieldCheck, TrendingUp, PieChart } from "lucide-react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Left pane: Form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:w-1/2 lg:px-20 xl:px-24 bg-white shadow-2xl z-10">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-10 flex items-center gap-3 lg:hidden justify-center">
            <div className="p-2 bg-slate-900 rounded-xl shadow-lg">
              <Image
                src="/spendsage-logo.png"
                alt="SpendSage"
                width={32}
                height={32}
                className="rounded-lg object-contain invert"
              />
            </div>
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              SpendSage
            </span>
          </div>
          <div className="flex flex-col items-center justify-center w-full">
            {children}
          </div>
        </div>
      </div>

      {/* Right pane: Image & Branding */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0 h-full w-full object-cover bg-cover bg-center bg-[url('/pexels-fox-58267-1172675.jpg')]" />
        
        {/* Gradient Overlay for modern look */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/20 mix-blend-multiply" />
        
        {/* Content over image */}
        <div className="absolute bottom-0 left-0 right-0 p-16 text-white flex flex-col justify-end h-full bg-gradient-to-t from-slate-900/90 via-transparent to-transparent">
          <div className="flex flex-col gap-6 transform transition-all duration-700 translate-y-0 opacity-100">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 shadow-2xl">
                <Image
                  src="/spendsage-logo.png"
                  width={48}
                  height={48}
                  alt="Logo"
                  className="rounded-xl object-contain drop-shadow-md"
                />
              </div>
              <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-lg">
                SpendSage
              </h1>
            </div>
            
            <p className="text-xl font-medium text-slate-200 mb-6 max-w-xl leading-relaxed drop-shadow-md">
              Una aplicación moderna e inteligente de presupuestos para ayudarte a tomar el control absoluto de tus finanzas y alcanzar tus metas.
            </p>

            <div className="grid grid-cols-2 gap-x-8 gap-y-6 max-w-2xl mt-4">
              <div className="flex items-center gap-4 group cursor-default">
                <div className="p-3.5 bg-emerald-500/20 rounded-2xl backdrop-blur-md border border-emerald-500/30 group-hover:bg-emerald-500/30 transition-colors">
                  <TrendingUp className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg drop-shadow-sm">Seguimiento Real</h3>
                  <p className="text-sm text-slate-300 font-medium">Controla cada centavo</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 group cursor-default">
                <div className="p-3.5 bg-blue-500/20 rounded-2xl backdrop-blur-md border border-blue-500/30 group-hover:bg-blue-500/30 transition-colors">
                  <PieChart className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg drop-shadow-sm">Gráficos Claros</h3>
                  <p className="text-sm text-slate-300 font-medium">Visualiza tu economía</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 col-span-2 group cursor-default">
                <div className="p-3.5 bg-indigo-500/20 rounded-2xl backdrop-blur-md border border-indigo-500/30 group-hover:bg-indigo-500/30 transition-colors">
                  <ShieldCheck className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg drop-shadow-sm">Seguridad Total</h3>
                  <p className="text-sm text-slate-300 font-medium">Tus datos financieros están encriptados y protegidos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
