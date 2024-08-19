"use client";
import { useSyncColorTheme } from "@/hooks/useColorThemeStore";
import { hexToRgba } from "@/hooks/useHexToRgba";
import React from "react";

export function TitleColorTheme() {
  const { colorTheme } = useSyncColorTheme();
  return (
    <h2
      className="text-xl font-bold"
      style={{
        color: hexToRgba(colorTheme, 0.7),
        transition: "color 1s",
      }}
    >
      Color Theme
    </h2>
  );
}
