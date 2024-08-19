"use client";
import { useState } from "react";
import { LogoDashboard } from "../LogoDashboard";
import { SidebarRoutes } from "../SidebarRoutes";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useSyncColorTheme } from "@/hooks/useColorThemeStore";
import { hexToRgba } from "@/hooks/useHexToRgba";

export function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { colorTheme } = useSyncColorTheme();

  return (
    <div
      className={`relative flex flex-col h-screen ${
        sidebarOpen ? "w-[300px]" : "w-[80px]"
      } transition-transform duration-300`}
      style={{
        backgroundColor: hexToRgba(colorTheme, 0.08),
        transition: "background-color 1s",
      }}
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
