'use client'
import {useSession} from "next-auth/react";
export default function BudgetPage(){
    const { data: session } = useSession();
    return (<div><h1>Budget</h1>
    {JSON.stringify(session)}
    </div>);
}