export type category = {
  id: string;
  name: string;
  budgetId: string;
  amount: number;
  isRecurring: boolean;
  totalSpent: number | undefined;
};
