'use client'
import {useSession} from "next-auth/react";
import { Form, Field, FormElement } from '@progress/kendo-react-form';
import { Error } from '@progress/kendo-react-labels';
import { Input } from '@progress/kendo-react-inputs';
export default function BudgetPage(){
    const { data: session } = useSession();
    return (<div><h1>Budget</h1>
    {JSON.stringify(session)}
    </div>);
}