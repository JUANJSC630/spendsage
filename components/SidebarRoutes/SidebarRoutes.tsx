"use client";

import { Separator } from "@/components/ui/separator";

import { SidebarItem } from "./SidebarItem";
import { dataGeneralSidebar, dataSettingsSidebar } from "./SidebarRoutes.data";
import { UserButton, UserProfile } from "@clerk/nextjs";

type SidebarRoutesProps = {
  setOpen: boolean;
};

export function SidebarRoutes(props: SidebarRoutesProps) {
  const { setOpen } = props;

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex md:h-full flex-col justify-between">
        <div
          className={`p-2 justify-center items-center  ${
            setOpen ? "md:p-6" : "mt-8 flex flex-col"
          }`}
        >
          {setOpen ? <p className="mb-2 text-gray-500">GENERAL</p> : null}
          {dataGeneralSidebar.map((item) => (
            <SidebarItem key={item.label} item={item} setOpen={setOpen} />
          ))}
        </div>

        <div
          className={`p-2 justify-center items-center  ${
            setOpen ? "md:p-6" : "mt-8 flex flex-col"
          }`}
        >
          {setOpen ? <p className="mb-2 text-gray-500">CONFIGURACIÓN</p> : null}
          {dataSettingsSidebar.map((item) => (
            <SidebarItem key={item.label} item={item} setOpen={setOpen} />
          ))}
        </div>
      </div>

      <Separator />
      <div className="hidden md:flex p-2 justify-center items-end">
        <div className="w-10 h-10 flex items-center justify-center">
          <UserButton />
        </div>
      </div>
      {setOpen ? (
        <div>
          <Separator />

          <footer className="p-3 text-center">2025 © SpendSage</footer>
        </div>
      ) : null}
    </div>
  );
}
