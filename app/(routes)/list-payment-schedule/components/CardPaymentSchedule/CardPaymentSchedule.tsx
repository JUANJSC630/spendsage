import AddItem from "../AddItem/AddItem";
import ButtonDeletePaymentSchedule from "../ButtonDeletePaymentSchedule/ButtonDeletePaymentSchedule";
import ListPaymentItems from "../ListPaymentItems/ListPaymentItems";
import { CardPaymentScheduleProps } from "./CardPaymentSchedule.types";


export function CardPaymentSchedule(props: CardPaymentScheduleProps) {
  const { paymentSchedule } = props;
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold">{paymentSchedule.name}</h1>
          <div className="text-gray-500 text-sm">
            {new Date(paymentSchedule.fromDate).toLocaleDateString("es-ES")}-
            {new Date(paymentSchedule.toDate).toLocaleDateString("es-ES")}
          </div>
        </div>
        <div className="flex flex-col items-end gap-4">
          <AddItem paymentSchedule={paymentSchedule} />
          <ButtonDeletePaymentSchedule paymentSchedule={paymentSchedule} />
        </div>
      </div>
      <div>
        <ListPaymentItems paymentSchedule={paymentSchedule} />
      </div>
    </div>
  );
}
