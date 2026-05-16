"use client";

import { useState } from "react";
import { Copy, Edit, MoreVertical } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CardList from "./CardList";
import { DuplicateListModal } from "./DuplicateListModal";
import { EditListModal } from "./EditListModal/EditListModal";
import { usePrefetchListPaymentSchedule, ListPaymentScheduleWithStats } from "@/hooks/use-payment-schedules";

interface CardListWithActionsProps {
  listPaymentSchedule: ListPaymentScheduleWithStats;
}

export function CardListWithActions({ listPaymentSchedule }: CardListWithActionsProps) {
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const prefetchList = usePrefetchListPaymentSchedule();

  const handleMouseEnter = () => {
    prefetchList(listPaymentSchedule.id);
  };

  return (
    <>
      <div className="relative group w-full" onMouseEnter={handleMouseEnter}>
        <Link href={`/list-payment-schedule/${listPaymentSchedule.id}`} className="block w-full">
          <CardList listPaymentScheduleName={listPaymentSchedule.name} stats={listPaymentSchedule._stats} />
        </Link>

        {/* Desktop: botones en hover (top-left) */}
        <div className="absolute top-2 left-2 hidden sm:flex opacity-0 group-hover:opacity-100 transition-opacity duration-200 gap-2 z-10">
          <EditListModal listPaymentSchedule={listPaymentSchedule} />
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowDuplicateModal(true); }}
            className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-md"
            title="Duplicar lista"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>

        {/* Mobile: menú ⋮ siempre visible (top-right) */}
        <div className="absolute top-2 right-2 flex sm:hidden z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                className="h-8 w-8 p-0 bg-white/80 shadow-sm"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setShowEditModal(true)}>
                <Edit className="h-4 w-4 mr-2" /> Editar
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setShowDuplicateModal(true)}>
                <Copy className="h-4 w-4 mr-2" /> Duplicar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Modales controlados por estado */}
      <EditListModal
        listPaymentSchedule={listPaymentSchedule}
        open={showEditModal}
        onOpenChange={setShowEditModal}
      />
      <DuplicateListModal
        listPaymentSchedule={listPaymentSchedule}
        open={showDuplicateModal}
        onOpenChange={setShowDuplicateModal}
      />
    </>
  );
}