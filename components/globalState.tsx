import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { globalState } from "@/types/globalState";
import type { budget } from "@/types/budget";
import type { category } from "@/types/category";
import type { transaction } from "@/types/transaction";
export const useGlobalState = create<globalState>()((set, get) => ({
  subscriptionStatus: "",
  setSubscriptionStatus: (s: string) => {
    set((state: globalState) => ({ ...state, subscriptionStatus: s }));
  },
  isActive: () => {
    return (
      get().subscriptionStatus === "active" ||
      get().subscriptionStatus === "trialing"
    );
  },
  customerId: "",
  setCustomerId: (c: string) => {
    set((state: globalState) => ({ ...state, customerId: c }));
  },
  budget: {
    year: 2024,
    month: 1,
    income: 0,
    id: "",
  },
  setBudget: (b: budget) => {
    set((state: globalState) => ({ ...state, budget: b }));
  },
  loading: true,
  setLoading: (l: boolean) => {
    set((state: globalState) => ({ ...state, loading: l }));
  },
  refreshDate: new Date(),
  setRefreshDate: (d: Date) => {
    set((state: globalState) => ({ ...state, refreshDate: d }));
  },
  cats: [],
  setCats: (c: category[]) => {
    set((state: globalState) => ({ ...state, cats: c }));
  },
  total: 0,
  setTotal: (t: number) => {
    set((state: globalState) => ({ ...state, total: t }));
  },
  transactions: [],
  setTransactions: (t: transaction[]) => {
    set((state: globalState) => ({ ...state, transactions: t }));
  },
}));
