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
import { useCurrencyStore } from "@/hooks/useCurrencyStore";

export function Navbar() {
  

  return (
    <div className="py-4 px-6">
      <div className="container mx-auto flex flex-col-reverse md:flex-row items-end md:items-center justify-end gap-2 md:gap-8">
        
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
