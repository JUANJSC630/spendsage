import { format } from "date-fns";
import { es } from "date-fns/locale";

export const formatDateColombian = (date: Date | undefined) => {
  if (!date) return "";
  return format(date, "dd/MM/yyyy", { locale: es });
};

export const formatDateForInput = (date: Date | undefined) => {
  if (!date) return "";
  return format(date, "yyyy-MM-dd");
};

export const formatDateRangeColombian = (from: Date, to?: Date) => {
  if (!to) {
    return formatDateColombian(from);
  }
  return `${formatDateColombian(from)} - ${formatDateColombian(to)}`;
};