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

export default function HandleBudgetPage(){
const initialState={message:''};
//const [notification]=useCookies('notification');

const [formState,formAction]=useFormState(updateBudget,initialState)
const [notificationMsg,setNotificationMsg]=useState('');
const router=useRouter();
const {month, year}=useParams();
    const [budget,setBudget]=useState({year:'2024',month:'1',income:0,id:''});
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
    const [ddlMonth,setDdlMonth]=useState(months.filter((v)=>v.value===parseInt(month))[0]);

    const [ddlYear,setDdlYear]=useState(year);
    
    
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
    const [success,setSuccess]=useState(false);
    
    //display notification
    
    const status=useFormStatus();
    

    if (formState.message!==""&&notificationMsg!==formState.message){
        
        setSuccess(true);
setNotificationMsg(formState.message);
        setTimeout(() => {
           setSuccess(false);
           
        }, 20000);
    }
    
    
    useEffect(()=>{
    async function fetchData(){
        const res =await fetch(`/api/budget/${month}/${year}`);
    const budget=await res.json();
        setBudget(budget);
        setLoading(false);
}
fetchData();

    },[month,year]);
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
            {success&& <Notification
            type={{ style: 'success', icon: true }}
            closable={false}
            onClose={() =>{ setSuccess(false);
                setSuccess(false);
            
            }}
                    >
      
                {notificationMsg}

            </Notification>}
        </Fade>
    </NotificationGroup>
    </div>
<div aria-live="off">
<CatList budgetID={budget.id}/>
</div>
<button onClick={e=>{
setAddCat(true);

}}>Add Category</button>
{addCat&&<Dialog title="Add Category" onClose={e=>{setAddCat(false);}}>
<AddCategory budgetId={budget.id} category={{name:'',amount:0,isRecurring:false,id:''}} mode="Add"/>   
</Dialog>}
    </div>
    
    );

}