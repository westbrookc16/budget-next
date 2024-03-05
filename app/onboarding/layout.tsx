import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if a user has completed onboarding
  // If yes, redirect them to /dashboard
  const sessionClaims = auth().sessionClaims;
  console.log(
    `onboardingComplete: ${sessionClaims?.metadata?.onboardingComplete}`
  );
  if (sessionClaims && sessionClaims.metadata.onboardingComplete === true) {
    console.log("onboarding complete, redirecting to dashboard");
    redirect(`${process.env.NEXT_PUBLIC_BASE_URL}`);
  } else {
    console.log("onboarding not complete yet");
  }
  return <>{children}</>;
}
