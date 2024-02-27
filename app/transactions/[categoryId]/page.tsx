'use client';
import type{globalState} from "@/types/globalState";
import AddTransaction from "@/components/addTransaction";
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import {
  Grid, GridCellProps,
  GridColumn as Column,
  
} from '@progress/kendo-react-grid';

import type{category} from "@/types/category";
import React, { useEffect,  useState } from "react";
import { useFormState, useFormStatus } from 'react-dom';
import { useParams } from 'next/navigation';
import { useGlobalState} from "@/components/globalState";

export default function DisplayTransactions(){
const cats=useGlobalState((state:globalState)=>state.cats);
const transactions=useGlobalState((state:globalState)=>state.transactions);
const setTransactions=useGlobalState((state:globalState)=>state.setTransactions);
const { categoryId } = useParams();
//console.log(`categoryId: ${categoryId}`);
const selectedCat=()=>( categoryId!==''?cats.filter((v) => v.id === categoryId)[0]:cats[0]);
const [refreshDate,setRefreshDate]=useState<Date>(new Date());
console.log(`selectedCat: ${selectedCat}`);
console.log(`cats: ${JSON.stringify(cats)}`);
const [showAddTransaction, setShowAddTransaction] = useState<Boolean>(false);
useEffect(() => {
async function fetchData() {
    //get a list of transactions for the selected category
try{
const res=await fetch(`/api/transactions/${selectedCat().id}`);
const data=await res.json();
setTransactions(data);
//get a list of categories

}
catch(e){console.error(e);}

}
fetchData();
}, [selectedCat,refreshDate]);

//get the selected category if it is not there
/*useEffect(() => {


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
    
    }
    catch(e){console.error(e);}
    
    }
}
    fetchData();
}, [selectedCat]);*/
return(
<div>
<h1>Transactions for {selectedCat()?.name}</h1>
<Grid data={transactions}>
<Column field="name" title="Name" />
<Column field="amount" title="Amount" format='{0:c2}' />
<Column field="date" title="Date" cell={(props:GridCellProps)=>(<td>{new Date(props.dataItem['date']).toDateString()}</td>)} />
<Column field="description" title="Description" />
</Grid>
<button onClick={()=>setShowAddTransaction(true)}>Add Transaction</button>
{showAddTransaction && <Dialog><AddTransaction categoryId={selectedCat()?.id} mode="add" closeDialog={()=>setShowAddTransaction(false)} refreshGrid={()=>setRefreshDate(new Date())} /></Dialog>}
</div>

)
}