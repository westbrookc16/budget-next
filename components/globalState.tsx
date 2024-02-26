'use client'
import React,{ createContext, useState } from "react";
import type { globalState } from "@/types/globalState";
import type { budget } from "@/types/budget";
import type { category } from "@/types/category";
export const GlobalStateContext = createContext<globalState>({
    budget: {
        year: 2024,
        month: 1,
        income: 0,
        id: "",
    },
    setBudget: () => {},
    loading: true,
    setLoading: () => {},
    refreshDate: new Date(),
    setRefreshDate: () => {},
    cats: [],
    setCats: () => {},
    total: 0,
    setTotal: () => {},
});
export default function GlobalStateProvider({children}: Readonly<{children: React.ReactNode}>) {
  const [total, setTotal] = useState(0);
    

const [budget, setBudget] = useState<budget>({
  year: 2024,
  month: 1,
  income: 0,
  id: "",
});
const [loading, setLoading] = useState(true);
const [refreshDate, setRefreshDate] = useState<Date>(new Date());
const [cats, setCats] = useState<category[]>([]);

    return (
    <GlobalStateContext.Provider
      value={{
        budget,
        setBudget,
        loading,
        setLoading,
        refreshDate,
        setRefreshDate,
        cats,
        setCats,
        total,
        setTotal,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
}
