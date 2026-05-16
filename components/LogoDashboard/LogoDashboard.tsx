"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type LogoDashboardProps = {
  open: boolean;
};

export function LogoDashboard({ open }: LogoDashboardProps) {
  return (
    <Link href="/" className="flex items-center gap-3 px-3 py-4 min-h-[64px]">
      <Image
        src="/spendsage-logo.png"
        alt="SpendSage"
        width={36}
        height={36}
        priority
        className="shrink-0"
      />
      <AnimatePresence initial={false}>
        {open && (
          <motion.span
            key="brand"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden whitespace-nowrap text-xl font-bold font-tsukimi text-slate-800"
          >
            SpendSage
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}
