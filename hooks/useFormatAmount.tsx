import { useMemo } from "react";

export default function useFormatAmount() {
  const formatter = useMemo(() => {
    return new Intl.NumberFormat("de-DE", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }, []);

  const formatAmount = (amount: string) => {
    if (!amount) return "";
    const numberValue = amount.replace(/\D/g, "");
    return formatter.format(Number(numberValue) || 0);
  };

  return formatAmount;
}
