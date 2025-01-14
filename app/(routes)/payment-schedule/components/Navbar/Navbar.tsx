import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";

import { ButtonAddPaymentSchedule } from "../ButtonAddPaymentSchedule/ButtonAddPaymentSchedule";

export function Navbar() {
  return (
    <div className="bg-background py-4 px-6">
      <div className="container mx-auto flex flex-col md:flex-row items-end md:items-center justify-end gap-2 md:gap-8">
        <ButtonAddPaymentSchedule />
      </div>
    </div>
  );
}
