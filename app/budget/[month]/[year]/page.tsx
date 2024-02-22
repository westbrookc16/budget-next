'use client';
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AddCategory from "@/components/AddCategory";
import CatList from "@/components/CatList";
export default function HandleBudgetPage(){
const router=useRouter();
const {month, year}=useParams();
    const [budget,setBudget]=useState({year:'2024',month:'1',income:0,id:''});
    const [loading,setLoading]=useState(true);
    const [ddlMonth,setDdlMonth]=useState(month);
    const [ddlYear,setDdlYear]=useState(year);
    const changeBudget=(e:any)=>{
if (e.target.name==="month"){
setDdlMonth(e.target.value);
router.push(`/budget/${e.target.value}/${ddlYear}`);
}
else{
setDdlYear(e.target.value);
router.push(`/budget/${ddlMonth}/${e.target.value}`);
}
    };
    useEffect(()=>{
    async function fetchData(){
        const res =await fetch(`/api/budget/${month}/${year}`);
    const budget=await res.json();
        setBudget(budget);
        setLoading(false);
}
fetchData();
console.log(budget);
    },[month,year]);
    if (loading){
return (<div role="status">loading...</div>);

    }
    return (<div>
    <h1>Budget </h1>
    <form method="post" action="/api/budget">
    <label htmlFor="ddlMonth">Month</label>
    <select id="ddlMonth" name="month" value={ddlMonth} onChange={changeBudget}>
<option value="1">Jan</option>
<option value="2">Feb</option>
<option value="3">Mar</option>
<option value="4">Apr</option>
<option value="5">May</option>
<option value="6">Jun</option>
<option value="7">Jul</option>
<option value="8">Aug</option>
<option value="9">Sep</option>
<option value="10">Oct</option>
<option value="11">Nov</option>
<option value="12">Dec</option>
    </select>
    <label htmlFor="ddlYear">Year</label>
    <select id="ddlYear" onChange={changeBudget} name="year" value={ddlYear}>

        <option>2024</option>
        <option>2025</option>
    </select>
    <label htmlFor="income">Income</label>
    <input id="income" name="income" value={budget.income} onChange={e=>{
setBudget(b=>{
return{...b,income:parseFloat(e.target.value)};

})

    }}></input>
    <input type="hidden" name="budgetId" value={budget.id}/>
    <input type="submit" value="submit"/>
 
</form>
<CatList budgetID={budget.id}/>
<AddCategory budgetId={budget.id} category={{name:'',amount:0,isRecurring:false,id:''}} mode="add"/>   
    </div>);

}