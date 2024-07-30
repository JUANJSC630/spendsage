import { NavbarDashboard } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import React from "react";

export default function dashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full h-full">
      <div className="hidden h-full xl:block w-80 xl:fixed">
        <Sidebar />
      </div>
      <div className="w-full h-full xl:ml-80">
        <NavbarDashboard />
        <div className="h-max">{children}</div>
      </div>
    </div>
  );
}
