import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
export default function SignInButton() {
  const supabase = createClient();
  return (
    <button
      onClick={async (e) => {
        e.preventDefault();

        console.log(`sign in`);
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
        });
        if (error) console.log("Error logging in:", error.message);
        redirect("/");
      }}
    >
      Sign In
    </button>
  );
}
