'use client';
import React from 'react';
import CheckoutButton from '@/components/stripe-payment';
import { useGlobalState } from '@/components/globalState';
const HomePage = () => {
  const subscriptionStatus=useGlobalState((state)=>state.subscriptionStatus);
  return (<div>HomePage

<CheckoutButton />

  </div>);
};

export default HomePage;
