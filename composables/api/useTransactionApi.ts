import type { ITransaction } from "@/types/transaction.interface";

export const useTransactionApi = () => {
  const { apiFetch } = useApi();

  const getTransactions = async (params?: { take?: number; skip?: number }) => {
    return await apiFetch<ITransaction[]>("/transactions", {
      method: "GET",
      params,
    });
  };

  return { getTransactions };
};
