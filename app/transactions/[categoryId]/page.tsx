'use client';
import AddTransaction from "@/components/addTransaction";
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import {
  Grid,
  GridColumn as Column,
  GridCellProps,
} from '@progress/kendo-react-grid';

import type{category} from "@/types/category";
import React, { useEffect, useContext, useState } from "react";
import { useFormState, useFormStatus } from 'react-dom';
import { useParams } from 'next/navigation';
import { GlobalStateContext } from "@/components/globalState";
export default async function displayTransactions(){
const {cats,transactions,setTransactions,} = useContext(GlobalStateContext);
const { categoryId } = useParams();
//console.log(`categoryId: ${categoryId}`);
const selectedCat:category = categoryId!==''?cats.filter((v) => v.id !== categoryId)[0]:cats[0];
console.log(`selectedCat: ${selectedCat}`);
console.log(`cats: ${JSON.stringify(cats)}`);
const [showAddTransaction, setShowAddTransaction] = useState<Boolean>(false);
useEffect(() => {
async function fetchData() {
    //get a list of transactions for the selected category
try{
const res=await fetch(`/api/transactions/${selectedCat.id}`);
const data=await res.json();
setTransactions(data);
//get a list of categories

}
catch(e){console.error(e);}

}
fetchData();
}, [selectedCat]);
return(
<div>
<h1>Transactions for {selectedCat?.name}</h1>
<Grid data={transactions}>
<Column field="name" title="Name" />
<Column field="amount" title="Amount" format='{0:c2}' />
<Column field="date" title="Date" format='{0:MM/dd/yyyy}' />
<Column field="description" title="Description" />
</Grid>
{showAddTransaction && <Dialog><AddTransaction categoryId={selectedCat.id} mode="add" closeDialog={()=>setShowAddTransaction(false)} /></Dialog>}
</div>

)
}