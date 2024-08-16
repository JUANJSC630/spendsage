"use client";
import { useState } from "react";
import { LogoDashboard } from "../LogoDashboard";
import { SidebarRoutes } from "../SidebarRoutes";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useColorThemeStore } from "@/store/useColorThemeStore";

function hexToRgba(hex: string, opacity: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { colorTheme } = useColorThemeStore();

  return (
    <div
      className={`relative flex flex-col h-screen ${
        sidebarOpen ? "w-[300px]" : "w-[80px]"
      } transition-all duration-300`}
      style={{ backgroundColor: hexToRgba(colorTheme, 0.08) }}
    >
      <div className="flex flex-col items-center pt-6">
        {sidebarOpen ? (
          <LogoDashboard />
        ) : (
          <Image
            src="/cat-logo-2.png"
            alt="Logo"
            width={40}
            height={40}
            priority
          />
        )}

        <Button
          variant="ghost"
          size="icon"
          className="absolute top-5 right-5 transform translate-x-full rounded-full bg-slate-50 text-gray-500 hover:bg-slate-100"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>
      <SidebarRoutes setOpen={sidebarOpen} />
    </div>
  );
}
