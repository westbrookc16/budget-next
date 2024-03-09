"use client";
import React from "react";
import CheckoutButton from "@/components/stripe-payment";
import { useUser } from "@clerk/nextjs";
import { useGlobalState } from "@/components/globalState";
const HomePage = () => {
  const subscriptionStatus = useGlobalState(
    (state) => state.subscriptionStatus
  );
  const { isLoaded, isSignedIn } = useUser();
  return (
    <div>
      HomePage
      {isLoaded &&
        isSignedIn &&
        (subscriptionStatus === "none" ||
          subscriptionStatus === "" ||
          !subscriptionStatus) && <CheckoutButton />}
    </div>
  );
};

export default HomePage;
