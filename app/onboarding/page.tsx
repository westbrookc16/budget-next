'use client';
import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { completeOnboarding } from '../actions/onboarding';
import { useUser } from '@clerk/nextjs';

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type='submit' disabled={pending === true}>
      Complete Onboarding
    </button>
  );
}

export default function Onboarding() {
  const { user } = useUser();
  const router = useRouter();

  return (
    <div className='flex justify-center items-center mt-8 border rounded-md bg-blue-50'>
      <h1 className='text-2xl text to-blue-500 font-semibold '>Onboarding</h1>
      <form
        className='border rounded-md'
        action={async (data: FormData) => {
          const res = await completeOnboarding(data);
          // console.log(`res: ${JSON.stringify(res)}`);

          await user?.reload();

          const url = `${process.env.NEXT_PUBLIC_BASE_URL}`;
          // console.log(`redirecting: `, url);

          router.prefetch(url);
          router.push(url);
        }}
      >
        Hi, <b>{user?.firstName}</b>, thanks for stopping by.
        <Submit />
      </form>
    </div>
  );
}
