"use client";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "../actions/onboarding";
import { useUser } from "@clerk/nextjs";
export default function Onboarding() {
  const { user } = useUser();
  const router = useRouter();
  return (
    <div>
      <h1>Onboarding</h1>
      <form
        action={async (data: FormData) => {
          console.log("in action");
          const res = await completeOnboarding(data);
          console.log(res);
          await user?.reload();
          router.push(`${process.env.NEXT_PUBLIC_BASE_URL}`);
        }}
      >
        Hi, <b>{user?.firstName}</b>, thanks for stopping by.
        <button type="submit">Complete Onboarding</button>
      </form>
    </div>
  );
}
