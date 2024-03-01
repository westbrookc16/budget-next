"use client";
import type { category } from "@/types/category";
import { useFormState } from "react-dom";
import type { formState } from "@/types/formstate";
import {
  createTransaction,
  updateTransaction,
} from "@/app/actions/transactions";
import { DropDownListChangeEvent } from "@progress/kendo-react-dropdowns";
import React, { useState, useEffect } from "react";
import { NumericTextBox } from "@progress/kendo-react-inputs";

import { DropDownList } from "@progress/kendo-react-dropdowns";
import {
  DateInput,
  DateInputChangeEvent,
} from "@progress/kendo-react-dateinputs";
import { Hint } from "@progress/kendo-react-labels";
import { Input } from "@progress/kendo-react-inputs";
import type { globalState } from "@/types/globalState";
import type { transaction } from "@/types/transaction";
import { useGlobalState } from "@/components/globalState";

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
  const initialState: formState = { message: "", timestamp: new Date() };
  const [realCategory, setRealCategory] = useState<String>("");
  const cats = useGlobalState((state: any) => state.cats);
  const setCats = useGlobalState((state: any) => state.setCats);
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
          console.log(`in action`);
          if (mode === "Add") {
            await createTransaction(initialState, data);
          } else {
            console.log(`in update`);
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
