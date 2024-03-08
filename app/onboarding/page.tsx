"use client";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { completeOnboarding } from "../actions/onboarding";
import { useUser } from "@clerk/nextjs";
import * as sentry from "@sentry/nextjs";
import { redirect } from "next/navigation";
function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending === true}>
      Complete Onboarding
    </button>
  );
}
export default function Onboarding() {
  const { user } = useUser();
  const router = useRouter();

  return (
    <div>
      <h1>Onboarding</h1>
      <form
        action={async (data: FormData) => {
          try {
            const res = await completeOnboarding(data);
            console.log(`res: ${JSON.stringify(res)}`);

            await user?.reload();
            console.log(`redirecting`);
            redirect(`${process.env.NEXT_PUBLIC_BASE_URL}`);
          } catch (err) {
            console.error(err);
          }
        }}
      >
        Hi, <b>{user?.firstName}</b>, thanks for stopping by.
        <Submit />
      </form>
    </div>
  );
}
