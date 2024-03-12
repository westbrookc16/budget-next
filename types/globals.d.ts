export {};
declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingComplete?: boolean;
      stripe: { subscriptionStatus: string; customer: string };
    };
  }
  interface UserPublicMetadata {
    stripe: { subscriptionStatus: string };
  }

  interface UserPrivateMetadata {
    stripe: { customer: string };
  }
}
