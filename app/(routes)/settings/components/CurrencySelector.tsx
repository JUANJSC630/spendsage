"use client";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCurrencyStore } from "@/hooks/useCurrencyStore";
import { motion } from "framer-motion";
import { useSyncColorTheme } from "@/hooks/useColorThemeStore";
import { hexToRgba } from "@/hooks/useHexToRgba";

export const CurrencySelector = () => {
  const {
    currency: storeCurrency,
    setCurrency,
    getSymbol,
  } = useCurrencyStore();
  const { colorTheme } = useSyncColorTheme();

  const [currency, setLocalCurrency] = useState(storeCurrency);

  useEffect(() => {
    setLocalCurrency(storeCurrency);
  }, [storeCurrency]);

  const handleCurrencyChange = (value: "USD" | "EUR" | "COP") => {
    setCurrency(value);
    setLocalCurrency(value);
  };

  const getCurrencyEmoji = (curr: string) => {
    switch (curr) {
      case "USD":
        return "🇺🇸";
      case "EUR":
        return "🇪🇺";
      case "COP":
        return "🇨🇴";
      default:
        return "🌍";
    }
  };

  return (
    <div className="bg-white bg-opacity-20 rounded-xl p-8 shadow-lg duration-300">
      <h1
        className="text-4xl font-bold mb-6 text-center"
        style={{
          color: hexToRgba(colorTheme, 0.7),
          transition: "color 1s",
        }}
      >
        Pick Your Money! 💰
      </h1>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Select value={currency} onValueChange={handleCurrencyChange}>
          <SelectTrigger className="w-full text-xl bg-gray-100 rounded-lg">
            <SelectValue>
              <span className="flex items-center gap-4 px-2">
                {getCurrencyEmoji(currency)} {currency} {getSymbol()}
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-white border-2 border-white">
            <SelectItem
              value="COP"
              className="text-lg hover:bg-pink-200 transition-colors duration-200"
            >
              <span className="flex items-center gap-2">
                <span>🇨🇴 COP</span>
                <span className="text-gray-600">- Colombian Peso $</span>
              </span>
            </SelectItem>
            <SelectItem
              value="USD"
              className="text-lg hover:bg-blue-200 transition-colors duration-200"
            >
              <span className="flex items-center gap-2">
                <span>🇺🇸 USD</span>
                <span className="text-gray-600">- United States Dollar $</span>
              </span>
            </SelectItem>
            <SelectItem
              value="EUR"
              className="text-lg hover:bg-yellow-200 transition-colors duration-200"
            >
              <span className="flex items-center gap-2">
                <span>🇪🇺 EUR</span>
                <span className="text-gray-600">- Euro €</span>
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
      </motion.div>
    </div>
  );
};
