"use client";

import { useState } from "react";
import { Copy } from "lucide-react";
import Link from "next/link";
import { ListPaymentSchedule } from "@prisma/client";

import { Button } from "@/components/ui/button";
import CardList from "./CardList";
import { DuplicateListModal } from "./DuplicateListModal";

interface CardListWithActionsProps {
  listPaymentSchedule: ListPaymentSchedule;
}

export function CardListWithActions({ listPaymentSchedule }: CardListWithActionsProps) {
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);

  const handleDuplicateClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevenir navegación del Link
    e.stopPropagation();
    setShowDuplicateModal(true);
  };

  return (
    <>
      <div className="relative group">
        <Link href={`/list-payment-schedule/${listPaymentSchedule.id}`}>
          <CardList listPaymentScheduleName={listPaymentSchedule.name} />
        </Link>

        {/* Botón de duplicar que aparece en hover */}
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDuplicateClick}
            className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-md"
            title="Duplicar lista"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <DuplicateListModal
        listPaymentSchedule={listPaymentSchedule}
        open={showDuplicateModal}
        onOpenChange={setShowDuplicateModal}
      />
    </>
  );
}