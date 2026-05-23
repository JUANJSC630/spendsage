"use client";

import { motion, AnimatePresence } from "framer-motion";
import { SidebarItem } from "./SidebarItem";
import { dataGeneralSidebar, dataSettingsSidebar } from "./SidebarRoutes.data";
import { UserButton } from "@clerk/nextjs";
import { Separator } from "@/components/ui/separator";

type SidebarRoutesProps = {
  setOpen: boolean;
  onItemClick?: () => void;
};

const stagger = {
  visible: { transition: { staggerChildren: 0.05 } },
  hidden: {},
};

const itemFade = {
  hidden: { opacity: 0, x: -6 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
};

function SectionLabel({ label, show }: { label: string; show: boolean }) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.p
          key={label}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="text-[10px] font-semibold tracking-widest uppercase text-slate-400 px-3 mb-1 mt-2"
        >
          {label}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

export function SidebarRoutes({ setOpen, onItemClick }: SidebarRoutesProps) {
  return (
    <div className="flex flex-col justify-between h-full py-4 px-2">
      {/* Nav sections */}
      <div className="flex flex-col gap-6">
        <div>
          <SectionLabel label="General" show={setOpen} />
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-0.5"
          >
            {dataGeneralSidebar.map((item) => (
              <motion.div key={item.label} variants={itemFade}>
                <SidebarItem
                  item={item}
                  setOpen={setOpen}
                  onItemClick={onItemClick}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div>
          <SectionLabel label="Configuración" show={setOpen} />
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-0.5"
          >
            {dataSettingsSidebar.map((item) => (
              <motion.div key={item.label} variants={itemFade}>
                <SidebarItem
                  item={item}
                  setOpen={setOpen}
                  onItemClick={onItemClick}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Footer: UserButton + branding */}
      <div className="flex flex-col gap-3">
        <Separator className="opacity-50" />
        <div
          className={`flex items-center gap-3 px-3 py-1 ${setOpen ? "" : "justify-center"}`}
        >
          <UserButton />
          <AnimatePresence initial={false}>
            {setOpen && (
              <motion.span
                key="powered"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.18 }}
                className="overflow-hidden whitespace-nowrap text-xs text-slate-400"
              >
                SpendSage © {new Date().getFullYear()}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
