'use client';
import { redirect, useParams,useRouter } from 'next/navigation'
import Stripe from "stripe";
import { stripe } from "@/utils/stripe/config";
import { useEffect } from 'react';
export default function GetPortalLink(req:Request, {params}:any) {
    const {customerId} = useParams();
    const router=useRouter();
    useEffect(()=>{
async function createPortalLink(){

const link=await fetch(`/api/create-portal-link/${customerId}`);
router.push(link.url);
}
createPortalLink();
    },[]);
return(<div>Loading</div>)
}