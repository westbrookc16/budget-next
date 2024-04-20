import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
export default function SignInButton({ text }: { text: string }) {
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
        //redirect("/");
      }}
    >
      {text ?? "Sign In"}
    </button>
  );
}
//whats is the difference making use of this button and  and the function in the user.ts?
