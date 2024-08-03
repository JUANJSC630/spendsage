export const fetchTransactions = async () => {
  const response = await fetch("/api/transactions");

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  
  return response.json();
};
