import { ListCheck } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "@/utils/CalendarIcon";

export function Navbar() {
  return (
    <div className="bg-background text-primary-foreground py-4 px-6">
      <div className="container mx-auto flex items-center justify-end gap-8">
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
                  {new Date().toLocaleString("default", {
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
