"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { SidebarRoutes } from "../SidebarRoutes";
import { UserButton } from "@clerk/nextjs";
import { LogoDashboard } from "../LogoDashboard";
import { useSyncColorTheme } from "@/hooks/useColorThemeStore";
import { dataGeneralSidebar, dataSettingsSidebar } from "../SidebarRoutes/SidebarRoutes.data";

const allRoutes = [...dataGeneralSidebar, ...dataSettingsSidebar];

function usePageTitle() {
  const pathname = usePathname();
  const match = allRoutes.find(
    (r) => r.href === pathname || (r.href !== "/" && pathname.startsWith(r.href))
  );
  return match?.label ?? "SpendSage";
}

export function NavbarDashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const { colorTheme } = useSyncColorTheme();
  const pageTitle = usePageTitle();

  return (
    <nav className="flex items-center justify-between w-full h-14 px-4 border-b border-slate-100 bg-white/95 backdrop-blur-sm sticky top-0 z-30">
      {/* Left: hamburger */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <button className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">
            <Menu className="h-5 w-5 text-slate-600" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[260px]">
          <div className="h-0.5 w-full" style={{ backgroundColor: colorTheme }} />
          <LogoDashboard open={true} />
          <SidebarRoutes setOpen={true} onItemClick={() => setIsOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Center: page title */}
      <span className="text-sm font-semibold text-slate-800 absolute left-1/2 -translate-x-1/2">
        {pageTitle}
      </span>

      {/* Right: user */}
      <UserButton />
    </nav>
  );
}
