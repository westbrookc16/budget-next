"use client";
import { useQuery } from "@tanstack/react-query";
import type { category } from "@/types/category";
//import { categoriesAtom } from "@/types/atoms";

import type { formState } from "@/types/formstate";
import {
  createTransaction,
  updateTransaction,
} from "@/app/actions/transactions";
import { DropDownListChangeEvent } from "@progress/kendo-react-dropdowns";
import React, { useState } from "react";
import { NumericTextBox } from "@progress/kendo-react-inputs";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { DateInput } from "@progress/kendo-react-dateinputs";
import { Input } from "@progress/kendo-react-inputs";
import type { transaction } from "@/types/transaction";

export default function AddTransaction({
  categoryId,
  mode,
  transaction,
  closeDialog,
  refreshGrid,
}: {
  categoryId: string;
  mode: string;
  closeDialog: () => void;
  refreshGrid: () => void;
  transaction: transaction;
}) {
  const getCategories = async (id: string) => {
    //get the current category id so we can get the categoreis from that budget
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/categories/getbyid/${id}`
    );
    const category = (await res.json()) as category;
    //get the categories for the current budget
    const res2 = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/categories/${category.budgetId}`
    );
    return res2.json();
  };
  const catInfo = useQuery({
    queryKey: ["categories", categoryId],
    queryFn: () => getCategories(categoryId as string),
  });
  const cats: category[] = catInfo.data as category[];
  const initialState: formState = { message: "", timestamp: new Date() };
  const [realCategory, setRealCategory] = useState<String>("");

  const [selectedCat, setSelectedCat] = useState(() =>
    categoryId !== ""
      ? cats.filter((v: category) => v.id === categoryId)[0]
      : cats[0]
  );

  return (
    <div>
      <h1>Add Transaction</h1>
      <form
        action={async (data: FormData) => {
          if (mode === "Add") {
            await createTransaction(initialState, data);
          } else {
            await updateTransaction(initialState, data);
          }
          refreshGrid();
          closeDialog();
        }}
      >
        <Input
          type="text"
          name="name"
          autoFocus
          defaultValue={transaction.name}
          label="Name"
        />
        <Input
          type="text"
          name="description"
          label="Description"
          defaultValue={transaction.description}
        />
        <DateInput
          label="Date"
          name="date"
          defaultValue={new Date(transaction.date)}
        />
        <NumericTextBox
          label="Amount"
          name="amount"
          format="c2"
          defaultValue={transaction.amount}
        />
        <DropDownList
          defaultItem={selectedCat}
          label="Category"
          data={cats}
          textField="name"
          dataItemKey="id"
          name="category"
          onChange={(e: DropDownListChangeEvent) => {
            setRealCategory(e.value.id);
          }}
        />
        <input
          type="hidden"
          name="realCategory"
          defaultValue={selectedCat?.id}
        />
        <input type="hidden" name="id" defaultValue={transaction.id} />
        <button type="submit">{mode}</button>
      </form>
    </div>
  );
}
