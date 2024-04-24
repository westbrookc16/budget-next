"use client";
import SignInButton from "@/components/SignInButton";
import { login } from "../actions/user";
import { useFormState } from "react-dom";
export default function Page() {
  const originalState = { message: "" };
  const [formState, action] = useFormState(login, originalState);
  return (
    <div className="p-5 h-screen mt-24">
      <div className="container mx-auto max-w-96 border rounded">
        <h1 className="text-2xl text-center">Log In</h1>
        <form
          action={action}
          className="flex justify-center items-center flex-col gap-2"
        >
          <div className="className='border px-4 py-2 rounded-full m-6 transition duration-300 bg-blue-500 text-white hover:bg-blue-600">
            <SignInButton text="Log In With Google" />
          </div>
          <div className="text-center text-lg font-light">OR</div>
          <label className="font-semibold p-2" htmlFor="email">
            Email
          </label>
          <input
            className="border border-gray-500 rounded outline-none px-4 py-2 w-9/12"
            id="email"
            name="email"
            type="email"
          />
          <label className="font-semibold p-2" htmlFor="password">
            Password
          </label>
          <input
            className="border border-gray-500 rounded outline-none px-4 py-2 w-9/12"
            id="password"
            name="password"
            type="password"
          />
          <button
            className="border px-4 py-2 rounded m-6 transition duration-300 bg-blue-500 w-9/12 text-white hover:bg-blue-600"
            type="submit"
            name="_action"
            value="login"
          >
            Log In
          </button>
          &nbsp;
          <button
            type="submit"
            name="_action"
            value="reset"
            className="border px-4 py-2 rounded m-6 transition duration-300 bg-blue-500 w-9/12 text-white hover:bg-blue-600"
          >
            Reset Password
          </button>
        </form>
        {formState?.message && (
          <div className="text-red-500 font-semibold" role="alert">
            {formState.message}
          </div>
        )}
      </div>
    </div>
  );
}
