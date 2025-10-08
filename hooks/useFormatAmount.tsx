import { useMemo } from "react";

export default function useFormatAmount() {
  const formatter = useMemo(() => {
    return new Intl.NumberFormat("de-DE", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }, []);

  const formatAmount = (amount: string | number) => {
    if (!amount && amount !== 0) return "0";

    let numericValue: number;

    if (typeof amount === "string") {
      if (amount.includes(".") && amount.split(".").length === 2) {
        numericValue = parseFloat(amount);
      } else {
        const cleanValue = amount.replace(/\D/g, "");
        numericValue = Number(cleanValue) || 0;
      }
    } else {
      numericValue = amount;
    }

    if (isNaN(numericValue) || !isFinite(numericValue)) {
      return "0";
    }

    return formatter.format(numericValue);
  };

  return formatAmount;
}
