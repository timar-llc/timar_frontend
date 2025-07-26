export interface ITransaction {
  id: string;
  amount: number;
  type: "income" | "withdraw";
  status: "pending" | "completed" | "failed";
  createdAt: string;
  method: "bank_card" | "crypto" | "bank_transfer";
}
