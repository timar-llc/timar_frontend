export interface ITransaction {
  uuid: string;
  amount: number;
  type: "income" | "withdraw";
  status: "pending" | "completed" | "failed";
  createdAt: Date;
  method: "bank_card" | "crypto" | "bank_transfer";
}
