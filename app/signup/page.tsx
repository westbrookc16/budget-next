"use client";
import SignInButton from "@/components/SignInButton";
import { signup } from "../actions/user";
import { useFormState } from "react-dom";
export default function Page() {
  const originalState = { message: "" };
  const [formState, action] = useFormState(signup, originalState);
  return (
    <div>
      <h1>Sign Up</h1>
      <form action={action}>
        <SignInButton text="Sign Up with Google" />
        <br />
        or
        <br />
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" />
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" />
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input id="confirmPassword" name="confirmPassword" type="password" />
        <button type="submit">Sign Up</button>
      </form>
      {formState?.message && <div role="alert">{formState.message}</div>}
    </div>
  );
}
