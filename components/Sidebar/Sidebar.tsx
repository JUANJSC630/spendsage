"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LogoDashboard } from "../LogoDashboard";
import { SidebarRoutes } from "../SidebarRoutes";
import { Button } from "../ui/button";
import { useSyncColorTheme } from "@/hooks/useColorThemeStore";
import { hexToRgba } from "@/hooks/useHexToRgba";

const SIDEBAR_KEY = "spendsage-sidebar-open";
const EXPANDED_WIDTH = 220;
const COLLAPSED_WIDTH = 64;

export function Sidebar() {
  const [open, setOpen] = useState(true);
  const { colorTheme } = useSyncColorTheme();

  // Persist state across reloads
  useEffect(() => {
    const saved = localStorage.getItem(SIDEBAR_KEY);
    if (saved !== null) setOpen(saved === "true");
  }, []);

  const toggle = () => {
    setOpen((v) => {
      localStorage.setItem(SIDEBAR_KEY, String(!v));
      return !v;
    });
  };

  return (
    <motion.div
      animate={{ width: open ? EXPANDED_WIDTH : COLLAPSED_WIDTH }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="relative flex flex-col h-screen shrink-0 border-r border-slate-100"
      style={{ backgroundColor: hexToRgba(colorTheme, 0.06) }}
    >
      {/* Top accent line */}
      <div className="h-0.5 w-full" style={{ backgroundColor: colorTheme }} />

      {/* Logo */}
      <LogoDashboard open={open} />

      {/* Nav */}
      <div className="flex-1 overflow-hidden">
        <SidebarRoutes setOpen={open} />
      </div>

      {/* Collapse toggle — integrated at bottom edge */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggle}
        className="absolute -right-3 top-16 h-6 w-6 rounded-full border border-slate-200 bg-white shadow-sm hover:bg-slate-50 text-slate-500 z-10"
        title={open ? "Colapsar" : "Expandir"}
      >
        {open ? (
          <ChevronLeft className="h-3 w-3" />
        ) : (
          <ChevronRight className="h-3 w-3" />
        )}
      </Button>
    </motion.div>
  );
}
