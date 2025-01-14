import React from "react";
import { CardTitleSettings } from "./components/CardTitleSettings";
import { TitleColorTheme } from "./components/TitleColorTheme";
import { ButtonChangeColor } from "./components/ButtonChangeColor";
import { colorOptions } from "@/utils/Colors.data";
import { CurrencySelector } from "./components/CurrencySelector";

export default function SettingsPage() {
  return (
    <div className="flex flex-col h-full items-center justify-center gap-24 p-8">
      <CardTitleSettings />

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex flex-col gap-2">
          <TitleColorTheme />
          <div className="grid grid-cols-5 gap-4">
            {colorOptions.map((option) => (
              <ButtonChangeColor key={option.color} color={option.color} />
            ))}
          </div>
        </div>
        <CurrencySelector />
      </div>
    </div>
  );
}
