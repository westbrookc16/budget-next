'use client';
import { useEffect,useState } from "react";
import AddCategory from "./AddCategory";
export default function({budgetID}){

const [cats,setCats]=useState([]);    
useEffect(()=>{
async function fetchData(){
try{
    const catsRes=await fetch(`/api/categories/${budgetID}`);
setCats(await catsRes.json());
}
catch(e){
console.log(e);

}
}
fetchData();

},[budgetID]);
const trs=cats.map((cat)=>{
    
        return <AddCategory mode="readonly" category={cat} budgetId={budgetID} key={cat.id}/>
    });
    
return(<div>
<h1>List of Categories</h1>
<table>
<thead>
<tr>
<th scope="col">Name</th>
<th scope="col">Amount</th>

<th scope="col">Is Recurring</th>
<th scope="col">Edit</th>
</tr>

</thead>

<tbody>
    {trs}
    </tbody>
</table>

</div>)
}