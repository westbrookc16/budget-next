'use client';
import { CookiesProvider } from 'react-cookie';
import { Fade } from '@progress/kendo-react-animation';
import {useCookies} from "react-cookie";
import { Notification, NotificationGroup } from '@progress/kendo-react-notification';
import { updateBudget } from "@/app/actions/budget";
import { useFormState, useFormStatus } from "react-dom";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { useEffect, useState } from "react";
import AddCategory from "@/components/AddCategory";
import CatList from "@/components/CatList";
import { Form, Field, FormElement } from '@progress/kendo-react-form';
import { Error } from '@progress/kendo-react-labels';
import { Input,NumericTextBox } from '@progress/kendo-react-inputs';
import { Dialog } from "@progress/kendo-react-dialogs";
import { category } from '@/types/category';
import { month } from '@/types/month';

export default function HandleBudgetPage(){
const initialState={message:'',timestamp:new Date()};
const [budget,setBudget]=useState({year:'2024',month:'1',income:0,id:''});
const [refreshDate,setRefreshDate]=useState<Date>(new Date());
const [cats,setCats]=useState<category[]>([]);    
const totalBudgeted=()=>{let total=0;
    cats.forEach(cat=>total+=cat.amount);
    return total;
    }
    
useEffect(()=>{
async function fetchData(){
try{
    const catsRes=await fetch(`/api/categories/${budget.id}`);
setCats(await catsRes.json());
}
catch(e){


}
}
fetchData();

},[budget.id,refreshDate]);
const refreshGrid=()=>{
setRefreshDate(new Date());
 
}



const [formState,formAction]=useFormState(updateBudget,initialState)

const router=useRouter();
const {month, year}=useParams();
    
    const [realMonth,setRealMonth]=useState(month);
    const [loading,setLoading]=useState(true);
    const months=[
        
        {name:'Jan',value:1},
        {name:'Feb',value:2},
        {name:'Mar',value:3},
        {name:'Apr',value:4},
        {name:'May',value:5},
        {name:'Jun',value:6},
        {name:'Jul',value:7},
        {name:'Aug',value:8},
        {name:'Sep',value:9},
        {name:'Oct',value:10},
        {name:'Nov',value:11},
        {name:'Dec',value:12}
    ];
    const [ddlMonth,setDdlMonth]=useState<month>(months.filter((v)=>v.value===parseInt(month.toString()))[0] as month);
    const [ddlYear,setDdlYear]=useState<string>(year.toString());
    
    
    const changeBudget=(e:any)=>{
if (e.target.name==="month"){
setRealMonth(e.target.value.value);
router.push(`/budget/${e.target.value.value}/${ddlYear}`);
}
else{
setDdlYear(e.target.value); 
router.push(`/budget/${ddlMonth}/${e.target.value}`);
}
    };
    const [addCat,setAddCat]=useState<boolean>(false);
    const [success,setSuccess]=useState<boolean>(false);
    
    const [totalLeft,setTotalLeft]=useState<number>(0);
    const [refreshBudget,setRefreshBudget]=useState<Date>(new Date());
    useEffect(()=>{

    setTotalLeft(budget.income-totalBudgeted());
    
    },[budget.income,cats]);
    const status=useFormStatus();
    
//display notification if formState has changed
useEffect(() => {
    if ('message' in formState && formState.message) {
        setSuccess(true);
        setRefreshBudget(new Date());
        setTimeout(() => {
            setSuccess(false);
        }, 5000);
    }
}, [formState]);
    
    
    
    useEffect(()=>{
    async function fetchData(){
        const res =await fetch(`/api/budget/${month}/${year}`);
    const budget=await res.json();
        setBudget(budget);
        setLoading(false);
}
fetchData();

    },[month,year,refreshBudget]);
    if (loading){
return (<div role="status">loading...</div>);

    }

    return (<div>
    <h1>Budget </h1>
    <form action={formAction} id="budgetForm">
    
    <DropDownList id="ddlMonth" name="month" value={ddlMonth} onChange={changeBudget} data={months} textField="name" dataItemKey="value" label="Month" />
    
    <input type="hidden" id="realMonth" name="realMonth" value={realMonth}/>
    
    
    
    <DropDownList id="ddlYear" name="year" data={['2024','2025','2026']} value={ddlYear} onChange={changeBudget} label="Year"/>
    
    <NumericTextBox id="income" format="c2" name="income" defaultValue={budget.income} label="Income"/>
    <input type="hidden" name="budgetId" value={budget.id}/>
    <input type="submit" value="submit" disabled={status.pending}/>
 
</form>
<div role="status">
<NotificationGroup
        style={{
                right: 0,
                bottom: 0,
                alignItems: 'flex-start',
                flexWrap: 'wrap-reverse'
            }}
        >
        <Fade>
            {success && (
                <Notification
                    type={{ style: 'success', icon: true }}
                    closable={false}
                    onClose={() => {
                        setSuccess(false);
                        setSuccess(false);
                    }}
                >
                    {('message' in formState && formState.message) || ''}
                </Notification>
            )}
        </Fade>
    </NotificationGroup>
    </div>
<div aria-live="off">
<CatList budgetID={budget.id} cats={cats} refreshGrid={refreshGrid}/>
</div>
<div>Total Budgeted: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalBudgeted())}</div>
    
<div>Total Income: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(budget.income)}</div>
    <div aria-live="polite">
There is {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalLeft)} left to budget.

    </div>
    </div>
    
    );

}