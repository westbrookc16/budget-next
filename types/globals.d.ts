import type Stripe from "stripe";
export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingComplete?: boolean;
      stripe: {
        status: Stripe.Checkout.Session.Status;
        payment: Stripe.Checkout.Session.PaymentStatus;
      };
    };
  }
}
