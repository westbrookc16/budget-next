"use client";
import SignInButton from "@/components/SignInButton";
import { updatePassword } from "@/app/actions/user";
import { useFormState } from "react-dom";
export default function Page() {
  const originalState = { message: "" };
  const [formState, action] = useFormState(updatePassword, originalState);
  return (
    <div className="p-5 h-screen mt-24">
      <div className="container mx-auto max-w-96 border rounded">
        <h1 className="text-2xl text-center">Reset Password</h1>
        <form
          action={action}
          className="flex justify-center items-center flex-col gap-2"
        >
          <label className="font-semibold p-2" htmlFor="password">
            Password
          </label>
          <input
            className="border border-gray-500 rounded outline-none px-4 py-2 w-9/12"
            id="password"
            name="password"
            type="password"
          />
          <label className="font-semibold p-2" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            className="border border-gray-500 rounded outline-none px-4 py-2 w-9/12"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
          />
          <button
            className="border px-4 py-2 rounded m-6 transition duration-300 bg-blue-500 w-9/12 text-white hover:bg-blue-600"
            type="submit"
          >
            Reset Password
          </button>
        </form>
        {formState?.message && (
          <div className="text-center font-light" role="alert">
            {formState.message}
          </div>
        )}
      </div>
    </div>
  );
}
