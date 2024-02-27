'use client';
import { DropDownListChangeEvent } from "@progress/kendo-react-dropdowns";
import React,{ useContext, useState } from "react";
import { NumericTextBox } from "@progress/kendo-react-inputs";

import { DropDownList } from "@progress/kendo-react-dropdowns";
import {
    DateInput,
    DateInputChangeEvent,
  } from "@progress/kendo-react-dateinputs";
  import { Hint } from "@progress/kendo-react-labels";
import { Input } from "@progress/kendo-react-inputs";
import type { globalState } from "@/types/globalState";
import type { transaction} from "@/types/transaction";
import { GlobalStateContext } from "@/components/globalState";

export default function AddTransaction ({categoryId,mode,closeDialog}:{categoryId:string,mode:string,closeDialog:()=>void})  {
    const [realCategory,setRealCategory] = useState<String>("");
    const {cats,transactions,setTransactions,} = useContext(GlobalStateContext);
const selectedCat = categoryId!==''?cats.filter((v) => v.id === categoryId)[0]:cats[0];
return(

<div>
    <h1>Add Transaction</h1>
    <form>
        
        <Input type="text" name="name" label="Name" />
        <DateInput label="Date"name="date" />
        <NumericTextBox label="Amount" name="amount" format="c2" />
        <DropDownList defaultItem={selectedCat} label="Category" data={cats} textField="name" dataItemKey="id" name="category" onChange={(e:DropDownListChangeEvent)=>{
setRealCategory(e.value.id);

        }} />
        <input type="hidden" name="realCategory" value={selectedCat.id} />
        <button type="submit">Add</button>
    </form>
    </div>
);
}