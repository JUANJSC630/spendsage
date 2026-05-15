"use client";
import { useSyncColorTheme } from "@/hooks/useColorThemeStore";
import { hexToRgba } from "@/hooks/useHexToRgba";
import React from "react";
import { CalendarDays, ChevronRight } from "lucide-react";

type CardListProps = {
  listPaymentScheduleName: string;
};

export default function CardList(props: CardListProps) {
  const { listPaymentScheduleName } = props;
  const { colorTheme } = useSyncColorTheme();

  return (
    <div
      className="group flex flex-row items-center justify-between w-full p-4 sm:p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-transparent hover:border-slate-200 relative overflow-hidden"
      style={{
        backgroundColor: hexToRgba(colorTheme, 0.1),
      }}
    >
      <div className="flex items-center gap-4 relative z-10">
        <div 
          className="p-2 sm:p-2.5 rounded-xl text-white shadow-sm flex-shrink-0"
          style={{ backgroundColor: colorTheme }}
        >
          <CalendarDays className="w-5 h-5" />
        </div>
        <h1 className="text-lg sm:text-xl font-bold text-slate-800 break-words line-clamp-1">
          {listPaymentScheduleName}
        </h1>
      </div>
      
      <div className="flex items-center text-slate-400 group-hover:text-slate-900 transition-colors relative z-10">
        <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
}
