"use client"

import { useSyncColorTheme } from "@/hooks/useColorThemeStore";
import { hexToRgba } from "@/hooks/useHexToRgba";
import { Settings } from "lucide-react";
import React from "react";

export function CardTitleSettings() {
  const { colorTheme } = useSyncColorTheme();

  return (
    <div
      className="w-full max-w-[400px] flex items-center justify-center gap-2 p-8 rounded-lg shadow-lg text-white"
      style={{
        backgroundColor: hexToRgba(colorTheme, 1),
        transition: "background-color 1s ease-in-out",
      }}
    >
      <Settings size={40} />
      <h1 className="text-2xl font-bold text-white">Settings</h1>
    </div>
  );
}
