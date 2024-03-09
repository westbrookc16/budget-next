export {};
declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingComplete?: boolean;
      stripe: { subscriptionStatus: string; customer: string };
    };
  }
  interface user extends User {
    publicMetadata: {
      stripe?: {
        subscriptionStatus: string;
      };
      privateMetadata: {
        stripe?: {
          customer: string;
        };
      };
    };
  }
}
