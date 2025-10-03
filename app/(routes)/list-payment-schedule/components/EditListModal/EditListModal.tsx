"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
import { z } from "zod";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { useUpdateListPaymentSchedule } from "@/hooks/use-payment-schedules";

const editListFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
});

type EditListFormValues = z.infer<typeof editListFormSchema>;

interface EditListModalProps {
  listPaymentSchedule: {
    id: string;
    name: string;
  };
}

export function EditListModal({ listPaymentSchedule }: EditListModalProps) {
  const [open, setOpen] = useState(false);
  const updateListMutation = useUpdateListPaymentSchedule();

  const form = useForm<EditListFormValues>({
    resolver: zodResolver(editListFormSchema),
    defaultValues: {
      name: listPaymentSchedule.name,
    },
  });

  const onSubmit = async (values: EditListFormValues) => {
    try {
      await updateListMutation.mutateAsync({
        id: listPaymentSchedule.id,
        name: values.name,
      });

      toast.success("¡Lista actualizada exitosamente! ✅");
      setOpen(false);
    } catch (error) {
      toast.error("Error al actualizar la lista");
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      form.reset({
        name: listPaymentSchedule.name,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-md"
          title="Editar lista"
        >
          <Edit className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Lista de Pagos</DialogTitle>
          <DialogDescription>
            Modifica el nombre de la lista de pagos.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Lista</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre de la lista" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={updateListMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={updateListMutation.isPending}
              >
                {updateListMutation.isPending ? "Actualizando..." : "Actualizar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}