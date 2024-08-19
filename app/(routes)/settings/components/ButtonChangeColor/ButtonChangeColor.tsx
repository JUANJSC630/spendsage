"use client"
import { useSyncColorTheme } from "@/hooks/useColorThemeStore";
import React from "react";

interface ColorOption {
  color: string;
}

export function ButtonChangeColor(props: ColorOption) {
  const { setColorTheme } = useSyncColorTheme();
  const { color } = props;

  return (
    <button
      className="h-12 w-12 rounded-full"
      style={{
        backgroundColor: color,
      }}
      onClick={() => setColorTheme(color)}
    ></button>
  );
}
