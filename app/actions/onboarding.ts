"use server";
import * as sentry from "@sentry/nextjs";
import { auth, clerkClient } from "@clerk/nextjs/server";

export const completeOnboarding = async (formData: FormData) => {
  const { userId } = auth();

  if (!userId) {
    return { message: "No Logged In User" };
  }

  try {
    const res = await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
      },
    });
    return { message: res.publicMetadata };
  } catch (err: any) {
    return {
      error: `There was an error updating the user metadata. ${err.message}`,
    };
    sentry.captureException(err);
    console.error(err);
  }
};
