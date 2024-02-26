'use client';
import {GlobalStateContext} from "@/components/globalState";
import type{category} from "@/types/category";
import { Fade } from '@progress/kendo-react-animation';

import {
  Notification,
  NotificationGroup,
} from '@progress/kendo-react-notification';
import { updateBudget } from '@/app/actions/budget';
import { useFormState, useFormStatus } from 'react-dom';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { useEffect, useState } from 'react';
import AddCategory from '@/components/AddCategory';
import CatList from '@/components/CatList';
import { Form, Field, FormElement } from '@progress/kendo-react-form';
import { Error } from '@progress/kendo-react-labels';
import { Input, NumericTextBox } from '@progress/kendo-react-inputs';
import { Dialog } from '@progress/kendo-react-dialogs';
import { Oval } from 'react-loader-spinner';

import { useContext } from "react";
export default function HandleBudgetPage() {
  //use global state context
  
  const { budget, setBudget, loading, setLoading, refreshDate, setRefreshDate, cats, setCats, total, setTotal } = useContext(GlobalStateContext);
  const initialState:any = { message: '' };
  const [formState, formAction] = useFormState(updateBudget, initialState);


  const router = useRouter();
  const { month, year } = useParams();

  const [realMonth, setRealMonth] = useState(month);

  


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
    const [ddlMonth,setDdlMonth]=useState(months.filter((v)=>v.value===parseInt(month.toString()))[0] );
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

    setTotalLeft(budget.income-Number(total));
    
    },[budget.income,cats,total]);
    useEffect(()=>{

      setTotal(cats.reduce((acc:number,cat:category)=>acc+cat.amount,0));
    },[cats]);
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

  useEffect(() => {
    async function fetchData() {
      if (budget.id === '') return;
      try {
        const catsRes = await fetch(`/api/categories/${budget.id}`);
        const data = await catsRes.json();
        console.log('data', data);
        setCats(data);
      } catch (e) {
        console.error(e);
      }
    }
    fetchData();
  }, [budget.id, refreshDate]);
  const refreshGrid = () => {
    const newDate = new Date();
    setRefreshDate(newDate);
    console.log(newDate);
  };


  
  if (loading) {
    return (
      //implement a loader
      <div
        role='status'
        className='flex justify-center items-center p-5 mt-40 '
      >
        <Oval
          visible={true}
          height='40'
          width='40'
          color='#4299e1'
          secondaryColor='#4299e1'
          ariaLabel='oval-loading'
          wrapperStyle={{}}
          wrapperClass=''
        />
      </div>
    );
  }

  return (
    <div>
      <h1 className='text-center text-xl font-semibold p-5'>Budget </h1>
      <div className=' flex justify-center items-center p-5'>
        <form
          action={formAction}
          id='budgetForm'
          className='flex justify-center item-center gap-6 text-lg font-semibold'
        >
          <DropDownList
            id='ddlMonth'
            name='month'
            value={ddlMonth}
            onChange={changeBudget}
            data={months}
            textField='name'
            dataItemKey='value'
            label='Month'
          />

          <input
            type='hidden'
            id='realMonth'
            name='realMonth'
            value={realMonth}
          />

          <DropDownList
            id='ddlYear'
            name='year'
            data={['2024', '2025', '2026']}
            value={ddlYear}
            onChange={changeBudget}
            label='Year'
          />

          <NumericTextBox
            id='income'
            format='c2'
            name='income'
            defaultValue={budget.income}
            label='Income'
          />
          <input type='hidden' name='budgetId' value={budget.id} />
          <input
            type='submit'
            value='submit'
            disabled={status.pending}
            className='bg-blue-600 h-9 w-100 text-sm p-2 rounded text-white mt-4 cursor-pointer hover:bg-blue-700 transition transition-duration: 500ms;'
          />
        </form>
      </div>
      <div role='status'>
        <NotificationGroup
          style={{
            right: 0,
            bottom: 0,
            alignItems: 'flex-start',
            flexWrap: 'wrap-reverse',
          }}
        >
          <Fade>
            {success && (
              <Notification
                type={{ style: 'success', icon: true }}
                closable={false}
                onClose={() => {
                  setSuccess(false);
                }}
              >
                {formState?.message}
              </Notification>
            )}
          </Fade>
        </NotificationGroup>
      </div>
      <div aria-live='off'>
        <CatList budgetID={budget.id} cats={cats} refreshGrid={refreshGrid} />
      </div>
      <div className='text-md p-5 flex justify-center items-center flex-col gap-3 md:text-xl'>
        <div>
          Total Budget:{' '}
          <b>
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(total)}
            .
          </b>
        </div>

        <div>
          Total Income:{' '}
          <b>
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(budget.income)}
            .
          </b>
        </div>
        <div aria-live='polite'>
          You have{' '}
          <b>
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(budget.income - total)}{' '}
          </b>
          left to budget.
        </div>
      </div>
    </div>
  );
}
//}