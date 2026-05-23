"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SidebarItemProps } from "./SidebarItem.types";
import { useSyncColorTheme } from "@/hooks/useColorThemeStore";
import { hexToRgba } from "@/hooks/useHexToRgba";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function SidebarItem({ item, setOpen, onItemClick }: SidebarItemProps) {
  const { href, icon: Icon, label } = item;
  const pathname = usePathname();
  const { colorTheme } = useSyncColorTheme();
  const isActive =
    pathname === href || (href !== "/" && pathname.startsWith(href));

  const link = (
    <Link
      href={href}
      onClick={onItemClick}
      className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors group"
      style={
        isActive
          ? { backgroundColor: hexToRgba(colorTheme, 0.12), color: colorTheme }
          : undefined
      }
    >
      {/* Active left accent bar */}
      {isActive && (
        <motion.div
          layoutId="sidebar-active-bar"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full"
          style={{ backgroundColor: colorTheme }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}

      {/* Icon */}
      <Icon
        className="shrink-0 w-5 h-5 transition-colors"
        strokeWidth={isActive ? 2 : 1.5}
        style={isActive ? { color: colorTheme } : undefined}
      />

      {/* Label — fade in/out with width */}
      <AnimatePresence initial={false}>
        {setOpen && (
          <motion.span
            key="label"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
            className="overflow-hidden whitespace-nowrap"
            style={isActive ? { color: colorTheme } : { color: "#475569" }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Hover background when not active */}
      {!isActive && (
        <span
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-slate-100"
          style={{ zIndex: -1 }}
        />
      )}
    </Link>
  );

  if (!setOpen) {
    return (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>{link}</TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return link;
}
