import AddItem from "../AddItem/AddItem";
import ButtonDeletePaymentSchedule from "../ButtonDeletePaymentSchedule/ButtonDeletePaymentSchedule";
import ListPaymentItems from "../ListPaymentItems/ListPaymentItems";
import { EditPaymentSchedule } from "../EditPaymentSchedule/EditPaymentSchedule";
import { CardPaymentScheduleProps } from "./CardPaymentSchedule.types";

export function CardPaymentSchedule(props: CardPaymentScheduleProps) {
  const { paymentSchedule } = props;
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
      {/* Minimal Card Header */}
      <div className="px-4 py-3 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-800">{paymentSchedule.name}</h2>
          <div className="text-slate-400 text-xs mt-0.5">
            {new Date(paymentSchedule.fromDate).toLocaleDateString("es-ES")} -{" "}
            {new Date(paymentSchedule.toDate).toLocaleDateString("es-ES")}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0 self-end sm:self-auto">
          <EditPaymentSchedule paymentSchedule={paymentSchedule} />
          <AddItem paymentSchedule={paymentSchedule} />
          <ButtonDeletePaymentSchedule paymentSchedule={paymentSchedule} />
        </div>
      </div>
      
      {/* Card Body */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col">
        <ListPaymentItems paymentSchedule={paymentSchedule} />
      </div>
    </div>
  );
}
