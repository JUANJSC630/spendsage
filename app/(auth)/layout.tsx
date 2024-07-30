import Image from "next/image";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen items-center justify-center gap-4">
      <div className="flex flex-col md:flex-row items-center justify-center gap-2 w-full max-w-[400px] p-4 bg-gray-300 rounded-2xl">
        <div className="text-center">
          <h1 className="font-bold">SpendSage</h1>
          <p>A simple budgeting app to help you keep track of your spending.</p>
        </div>

        <Image src="/gato-logo-sz.png" width={200} height={200} alt="" />
      </div>
      {children}
    </div>
  );
}
