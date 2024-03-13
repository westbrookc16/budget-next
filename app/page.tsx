"use client";
import React from "react";
import CheckoutButton from "@/components/stripe-payment";
import { useUser } from "@clerk/nextjs";
import { useAtomValue } from "jotai";
import { subscriptionStatusAtom } from "@/types/atoms";
const HomePage = () => {
  //const subscriptionStatus = useAtomValue(subscriptionStatusAtom);
  const { isLoaded, isSignedIn } = useUser();
  return (
    <div>
      <h1>Budget Management</h1>
      Welcome to my budget management app. Sign in with google or your email
      address, then click budget management and select a month/year. From there,
      enter your income for the month and click submit. Then you can split that
      income into categories such as rent, utilities, or whatever you would
      like.Subscribe for the ability to enter transactions for each category so
      you can see where you stand at the end of the month.
    </div>
  );
};

export default HomePage;
