export const usePaymentsApi = () => {
  const { apiFetch } = useApi();

  const getPayments = async () => {
    return await apiFetch("/payments");
  };

  const addFunds = async (data: {
    amount: number;
    amountWithCommission: number;
    paymentMethod: "card" | "sbp" | "crypto";
  }) => {
    return await apiFetch("/payments/top-up", {
      method: "POST",
      body: data,
    });
  };

  return {
    getPayments,
    addFunds,
  };
};
