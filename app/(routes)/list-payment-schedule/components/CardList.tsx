"use client";
import { useSyncColorTheme } from "@/hooks/useColorThemeStore";
import { hexToRgba } from "@/hooks/useHexToRgba";
import React from "react";

type CardListProps = {
  listPaymentScheduleName: string;
};

export default function CardList(props: CardListProps) {
  const { listPaymentScheduleName } = props;
  const { colorTheme } = useSyncColorTheme();

  return (
    <div
      className="w-[300px] flex flex-col items-center justify-center gap-4 p-8 rounded-lg shadow-lg hover:bg-yellow-200 transition relative hover:scale-110 duration-300"
      style={{
        backgroundColor: hexToRgba(colorTheme, 0.1), // Usar el colorTheme dinámico
      }}
    >
      <h1 className="text-center text-lg font-semibold break-words">
        {listPaymentScheduleName}
      </h1>
      <div className="absolute top-0 right-0 w-8 h-8 bg-yellow-200 rounded-br-lg shadow-lg" />
    </div>
  );
}
