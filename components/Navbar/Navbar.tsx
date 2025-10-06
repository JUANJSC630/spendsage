"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { SidebarRoutes } from "../SidebarRoutes";
import { UserButton } from "@clerk/nextjs";
import { LogoDashboard } from "../LogoDashboard";

export function NavbarDashboard() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <nav className="flex items-center justify-between w-full h-20 px-12 border-b gap-x-4 md:px-6 bg-background">
      <div className="block xl:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger className="flex items-center">
            <Menu />
          </SheetTrigger>
          <SheetContent side="left">
            <LogoDashboard open={true} />
            <SidebarRoutes setOpen={true} onItemClick={handleClose} />
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex items-center justify-end w-full gap-x-8">
        <UserButton />
      </div>
    </nav>
  );
}
