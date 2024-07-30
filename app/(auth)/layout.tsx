import Image from "next/image";
import React from "react";
import { Tranquiluxe } from "uvcanvas";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen items-center justify-center gap-4 bg-cover bg-center bg-[url('/pexels-fox-58267-1172675.jpg')] p-4">
      <div className="flex flex-col items-center justify-center gap-4 w-full max-w-[800px] p-8 rounded-2xl backdrop-blur-md bg-opacity-10 border border-white">
        <div className="text-center space-y-4">
          <h1 className="font-bold text-white text-4xl">SpendSage</h1>
          <p className="text-white">
            A simple budgeting app to help you keep track of your spending.
          </p>
        </div>
        <div className="flex items-center justify-center">
          {children}
          <Image
            src="/gato-logo-sz.png"
            width={300}
            height={300}
            alt="Logo"
            className="hidden md:block"
          />
        </div>
      </div>
    </div>
  );
}
