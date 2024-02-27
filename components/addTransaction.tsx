'use client';
import type{category} from "@/types/category";
import { useFormState } from "react-dom";
import type { formState } from "@/types/formstate";
import { createTransaction } from "@/app/actions/transactions";
import { DropDownListChangeEvent } from "@progress/kendo-react-dropdowns";
import React,{  useState,useEffect } from "react";
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
import { useGlobalState} from "@/components/globalState";

export default function AddTransaction ({categoryId,mode,closeDialog,refreshGrid}:{categoryId:string,mode:string,closeDialog:()=>void,refreshGrid:()=>void})  {
    const initialState:formState={message:'',timestamp:new Date()};
    const [realCategory,setRealCategory] = useState<String>("");
    const cats=useGlobalState((state:any)=>state.cats);
    const setCats=useGlobalState((state:any)=>state.setCats);
const [selectedCat,setSelectedCat]= useState(()=>(categoryId!==''?cats.filter((v:category) => v.id === categoryId)[0]:cats[0]));;
const [ formState,formAction]=useFormState(createTransaction,initialState);
useEffect(() => {


    async function fetchData() {
        //get the selected category
        if (!selectedCat) {
    console.log(`selected category is undefined, fetching category ${categoryId}`);
            try{
    const res=await fetch(`/api/categories/getById/${categoryId}`);
    const data=await res.json();
    console.log('data',data);
    setSelectedCat(data);
    //get a list of categories
    const res2=await fetch(`/api/categories/${data.budgetId
    }`);
    const data2=await res2.json();
    setCats(data2);
    }
    catch(e){console.error(e);}
    
    }
}
    fetchData();
}, [selectedCat]);
//close dialog when done
useEffect(() => {
    if (formState.message !== '') {
        closeDialog();
        refreshGrid();
    }
}, [formState.message]);
return(

<div>
    <h1>Add Transaction</h1>
    <form action={formAction}>
        
        <Input type="text" name="name" label="Name" />
        <Input type="text" name="description" label="Description"  />
        <DateInput label="Date"name="date" />
        <NumericTextBox label="Amount" name="amount" format="c2" />
        <DropDownList defaultItem={selectedCat} label="Category" data={cats} textField="name" dataItemKey="id" name="category" onChange={(e:DropDownListChangeEvent)=>{
setRealCategory(e.value.id);

        }} />
        <input type="hidden" name="realCategory" value={selectedCat?.id} />
        <button type="submit">Add</button>
    </form>
    </div>
);
}