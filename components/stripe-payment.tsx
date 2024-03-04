"use client";
import * as sentry from "@sentry/nextjs";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

export default function CheckoutButton() {
  const handleCheckout = async () => {
    try {
      const stripe = await stripePromise;
      if (!stripe) {
        return;
      }

      const { session } = await (
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/stripe-payment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity: 1,
            product: process.env.STRIPE_PRODUCT_ID,
          }),
        })
      ).json();

      await stripe.redirectToCheckout({
        sessionId: session.id,
      });
    } catch (error) {
      console.error(error);
      sentry.captureException(error);
    }
  };

  return (
    <section className="flex flex-col items-center ">
      <button
        onClick={handleCheckout}
        className="flex bg-indigo-600 hover:bg-indigo-800 text-white font-semibold py-2 px-4 rounded"
      >
        <span className="ml-2">Subscribe to Budget Management</span>
      </button>
    </section>
  );
}
