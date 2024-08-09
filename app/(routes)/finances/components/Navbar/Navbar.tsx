"use client";
import { ListCheck } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "@/utils/CalendarIcon";
import useCurrencyStore from "@/store/useStore";

export function Navbar() {
  const {
    currency: storeCurrency,
    setCurrency,
    getSymbol,
  } = useCurrencyStore();

  const [currency, setLocalCurrency] = useState(storeCurrency);

  useEffect(() => {
    setLocalCurrency(storeCurrency);
  }, [storeCurrency]);

  const handleCurrencyChange = (value: "USD" | "EUR" | "COP") => {
    setCurrency(value);
    setLocalCurrency(value);
  };

  return (
    <div className="bg-background py-4 px-6">
      <div className="container mx-auto flex flex-col-reverse md:flex-row items-end md:items-center justify-end gap-2 md:gap-8">
        <div>
          <Select value={currency} onValueChange={handleCurrencyChange}>
            <SelectTrigger>
              <SelectValue>
                <span className="flex items-center gap-4 px-2">
                  {currency} {getSymbol()}
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"COP"}>
                <span className="flex items-center gap-2">
                  <span>COP</span>
                  <span className="text-gray-500">- Colombian Peso $</span>
                </span>
              </SelectItem>
              <SelectItem value={"USD"}>
                <span className="flex items-center gap-2">
                  <span>USD</span>
                  <span className="text-gray-500">
                    - United States Dollar $
                  </span>
                </span>
              </SelectItem>
              <SelectItem value={"EUR"}>
                <span className="flex items-center gap-2">
                  <span>EUR</span>
                  <span className="text-gray-500">- Euro €</span>
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Link href="/finances/payment-schedule">
            <Button variant="outline" className="flex items-center gap-2">
              <ListCheck className="h-5 w-5 text-gray-900" />
              <span className="text-gray-900">Payment Schedule</span>
            </Button>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-gray-900" />
                <span className="text-gray-900">
                  {new Date().toLocaleString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
