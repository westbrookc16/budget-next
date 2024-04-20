"use server";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";

import { redirect } from "next/navigation";
export async function getSubscriptionStatus() {
  const supabase = createClient();
  const { data: subscriptionStatus, error } = await supabase
    .from("user_data")
    .select("subscription_status")
    .single();

  if (error) {
    console.log(JSON.stringify(error));
    return "none"; // default to "none" if there is an error
  }
  return subscriptionStatus?.subscription_status ?? "none";
}
export async function login(originalState: any, data: FormData) {
  const supabase = createClient();
  const email = data.get("email") as string;
  const password = data.get("password") as string;
  const _action = data.get("_action") as string;
  if (_action === "google") {
    await supabase.auth.signInWithOAuth({ provider: "google" });
    return redirect("/");
  }
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.log(JSON.stringify(error));
    return { message: error.message };
  }
  return redirect("/");
}

export async function signup(originalState: any, data: FormData) {
  const _action = data.get("_action") as string;
  const email = data.get("email") as string;
  const password = data.get("password") as string;
  const confirmPassword = data.get("confirmPassword") as string;
  const supabase = createClient();
  if (_action === "google") {
    console.log(`in google`);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    console.log(`authData=${JSON.stringify(data, null, 2)}`);
    return redirect(data.url);
    if (error) {
      console.log(JSON.stringify(error));
      return { message: error.message };
    }
    return { message: "Signed in with Google" };
  } else {
    const origin = headers().get("origin");
    if (password !== confirmPassword) {
      return { message: "Passwords do not match" };
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${origin}/auth/callback` },
    });
    if (error) {
      console.log(JSON.stringify(error));
      return { message: error.message };
    }
    return { message: "Check email to continue sign in process" };
  }
}
