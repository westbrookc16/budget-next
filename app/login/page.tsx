"use client";
import SignInButton from "@/components/SignInButton";
import { login } from "../actions/user";
import { useFormState } from "react-dom";
export default function Page() {
  const originalState = { message: "" };
  const [formState, action] = useFormState(login, originalState);
  return (
    <div>
      <h1>Log In</h1>
      <form action={action}>
        <SignInButton text="Log Inwith Google" />
        <br />
        or
        <br />
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" />
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" />
        <button type="submit">Log In</button>
      </form>
      {formState?.message && <div role="alert">{formState.message}</div>}
    </div>
  );
}
