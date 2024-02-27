import type { budget } from "@/types/budget";
import type { transaction } from "@/types/transaction";
import type { category } from "@/types/category";
export type globalState = {
  budget: budget;
  setBudget: (budget: budget) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  refreshDate: Date;
  setRefreshDate: (refreshDate: Date) => void;
  cats: category[];
  setCats: (cats: category[]) => void;
  total: number;
  setTotal: (total: number) => void;
  transactions: transaction[];
  setTransactions: (transactions: transaction[]) => void;
};
