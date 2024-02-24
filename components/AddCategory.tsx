"use client";
import { updateCategory } from "@/app/actions/categories";
import { useFormState } from "react-dom";
import { Input, NumericTextBox } from "@progress/kendo-react-inputs";
import { Checkbox } from "@progress/kendo-react-inputs";
import { useState, useEffect } from "react";
export default function AddCategory({ budgetId, category, mode, refresh,closeDialog}) {
  const [categoryState, setCategory] = useState(category);
  const [modeState, setModeState] = useState(mode);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory((c) => {
      return { ...c, [name]: value };
    });
  };

  useEffect(() => {
    // focusRef.focus();
  });
const initialState={message:''};
const [refreshCount,setRefreshCount]=useState(0);
const [formState,formAction]=useFormState(updateCategory,initialState);
  const { name, isRecurring, amount, id } = categoryState;
  
  if (formState.message&&refreshCount===0){
refresh();
closeDialog();
setRefreshCount(1);

  }
  if (modeState === "Add"  ||modeState==="Edit") {
    return (
      <div>
        <h1>{modeState} Category</h1>
<div role="status">
{formState.message}

</div>
        <form action={formAction}>
          <input type="hidden" name="id" value={id} />
          <Input
            type="text"
            id="name"
            value={name}
            onChange={handleChange}
            name="name"
            label="Name"
            autoFocus
            
          />

          <NumericTextBox
            format="c2"
            id="amount"
            value={amount}
            onChange={handleChange}
            name="amount"
            label="Amount"
          />

          <Checkbox
            id="isRecurring"
            checked={isRecurring}
            onChange={handleChange}
            name="isRecurring"
            label="Is Recurring"
          />
          <input type="hidden" name="budgetId" value={budgetId} />
          <input type="submit" value="add" />
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
                value={name}
                name="name"
              />
            </td>
            <td>
              <input
                type="number"
                onChange={handleChange}
                value={amount}
                name="amount"
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={isRecurring}
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
          <input type="checkbox" disabled checked={isRecurring} />
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
