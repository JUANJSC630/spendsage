"use client";

import { Separator } from "@/components/ui/separator";

import { SidebarItem } from "./SidebarItem";
import { dataGeneralSidebar } from "./SidebarRoutes.data";
import { UserButton, UserProfile } from "@clerk/nextjs";

type SidebarRoutesProps = {
  setOpen: boolean;
};

export function SidebarRoutes(props: SidebarRoutesProps) {
  const { setOpen } = props;

  return (
    <div className="flex flex-col justify-between h-full">
      <div>
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
      </div>
      <div className="hidden md:flex h-full p-2 justify-center items-end">
        <div className="w-10 h-10 flex items-center justify-center">
          <UserButton />
        </div>
      </div>
      {setOpen ? (
        <div>
          <Separator />

          <footer className="p-3 text-center">2024. All rights reserved</footer>
        </div>
      ) : null}
    </div>
  );
}
