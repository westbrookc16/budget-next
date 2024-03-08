export {};
declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingComplete?: boolean;
      stripe: { subscriptionStatus: string; customer: string };
    };
  }
}
