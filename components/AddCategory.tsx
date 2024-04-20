"use client";
import { updateCategory } from "@/app/actions/categories";
import type { category } from "@/types/category";
import { useFormState } from "react-dom";
import { Input, NumericTextBox } from "@progress/kendo-react-inputs";
import { Checkbox } from "@progress/kendo-react-inputs";
import { useState, useEffect } from "react";
import { Tables } from "@/types/supabase";
import invariant from "tiny-invariant";
export default function AddCategory({
  budgetId,
  category,
  mode,
  refresh,
  closeDialog,
}: {
  budgetId: string;
  category: Tables<"category">;
  mode: string;
  refresh: () => void;
  closeDialog: () => void;
}) {
  const [categoryState, setCategory] = useState<Tables<"category">>(category);
  const [modeState, setModeState] = useState(mode);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setCategory((c: any) => {
      return { ...c, [name]: value };
    });
  };

  const initialState = { message: "" };

  const [formState, formAction] = useFormState(updateCategory, initialState);
  const { name, is_recurring, amount, id } = categoryState;
  invariant(name !== null, "Name is required");
  invariant(amount !== null, "Amount is required");
  invariant(is_recurring !== null, "Recurring is required");

  useEffect(() => {
    if (formState.message) {
      console.log(formState.message);
      refresh();
      closeDialog();
    }
  }, [closeDialog, refresh, formState.message]);

  if (modeState === "Add" || modeState === "Edit") {
    return (
      <div>
        <div role="status">{String(formState.message)}</div>
        <form action={formAction} className=" m-2">
          <input type="hidden" name="id" value={id} />
          <Input
            type="text"
            id="name"
            value={name}
            onChange={handleChange}
            name="name"
            label="Name"
            autoFocus
            style={{ marginRight: 10 }}
          />

          <NumericTextBox
            format="c2"
            id="amount"
            value={amount ?? 0}
            onChange={handleChange}
            name="amount"
            label="Amount"
          />

          <Checkbox
            id="isRecurring"
            defaultChecked={is_recurring}
            onChange={handleChange}
            value={is_recurring ?? false}
            name="is_recurring"
            label="Is Recurring"
            style={{ margin: 10 }}
          />

          <input type="hidden" name="budgetId" value={budgetId} />
          <div className="w-full flex justify-center items-center">
            <input
              type="submit"
              value="Submit"
              className="p-2 rounded text-white items-center cursor-pointer transition transition-delay:300ms bg-blue-500 hover:bg-blue-600"
            />
          </div>
        </form>
      </div>
    );
  } else if (modeState === "edit") {
    return (
      <>
        <form>
          <tr key={id}>
            <td>
              <input
                type="text"
                onChange={handleChange}
                value={name ?? ""}
                name="name"
              />
            </td>
            <td>
              <input
                type="number"
                onChange={handleChange}
                value={amount ?? ""}
                name="amount"
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={is_recurring}
                name="isRecurring"
                onChange={handleChange}
              />
            </td>

            <td>
              <input type="submit" value="Update" />
            </td>
          </tr>
          <input type="hidden" name="id" value={id} />
        </form>
      </>
    );
  } else if (modeState === "readonly") {
    //we are readonly so make a table row
    return (
      <tr key={id}>
        <td>{name}</td>
        <td>{amount}</td>
        <td>
          <input type="checkbox" disabled checked={is_recurring} />
        </td>
        <td>
          <button
            onClick={(e) => {
              setModeState("edit");
            }}
          >
            Edit
          </button>
        </td>
      </tr>
    );
  }
}
