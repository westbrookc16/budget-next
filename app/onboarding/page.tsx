'use client';
import { useRouter } from "next/navigation";
import { completeOnboarding } from "../actions/onboarding";
import { useUser } from '@clerk/nextjs'
export default function Onboarding() {
    const { user } = useUser();
    const router = useRouter()
    return (
        <div>
            <h1>Onboarding</h1>
            <form
                action={async (data:FormData) => {
                    const res = await completeOnboarding(data);
                    console.log(res);
                    await user?.reload();
                    router.push("/");
                }}
            >
                Hi, <b>{user?.firstName}</b>, thanks for stopping by.
                <button type="submit">Complete Onboarding</button>
            </form>
        </div>
    );
            }