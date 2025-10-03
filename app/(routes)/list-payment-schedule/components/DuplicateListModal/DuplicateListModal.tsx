"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

import { DuplicateListModalProps } from "./DuplicateListModal.types";
import { duplicateListFormSchema, DuplicateListFormValues } from "./DuplicateListModal.form";
import { useDuplicateListPaymentSchedule } from "@/hooks/use-payment-schedules";

export function DuplicateListModal({ listPaymentSchedule, open, onOpenChange }: DuplicateListModalProps) {
  const { toast } = useToast();
  const duplicateListMutation = useDuplicateListPaymentSchedule();

  const form = useForm<DuplicateListFormValues>({
    resolver: zodResolver(duplicateListFormSchema),
    defaultValues: {
      name: `${listPaymentSchedule.name} (Copia)`,
    },
  });

  const onSubmit = async (values: DuplicateListFormValues) => {
    try {
      await duplicateListMutation.mutateAsync({
        id: listPaymentSchedule.id,
        name: values.name,
      });

      toast({
        title: "Lista duplicada",
        description: `La lista &quot;${values.name}&quot; ha sido creada exitosamente.`,
      });

      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un error al duplicar la lista de pagos.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Copy className="h-5 w-5" />
            Duplicar Lista de Pagos
          </DialogTitle>
          <DialogDescription>
            Se creará una copia completa de la lista &quot;{listPaymentSchedule.name}&quot; con todos sus
            cronogramas de pagos e items. La lista original permanecerá intacta.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la nueva lista</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre de la lista duplicada" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={duplicateListMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={duplicateListMutation.isPending}
              >
                {duplicateListMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Duplicando...
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicar Lista
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}