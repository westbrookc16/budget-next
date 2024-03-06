import { auth } from "@clerk/nextjs/server";
import * as sentry from "@sentry/nextjs";
import { redirect } from "next/navigation";
import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if a user has completed onboarding
  // If yes, redirect them to /dashboard
  try {
    const sessionClaims = auth().sessionClaims;

    if (sessionClaims && sessionClaims.metadata.onboardingComplete === true) {
      redirect(`${process.env.NEXT_PUBLIC_BASE_URL}`);
    } else {
    }
  } catch (e: any) {
    console.error(e);
    sentry.captureException(e);
  }
  return <>{children}</>;
}
