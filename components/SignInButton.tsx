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
          options: {
            redirectTo: process.env.NEXT_PUBLIC_BASE_URL,
          },
        });
        if (error) console.log("Error logging in:", error.message);
        //redirect("/");
      }}
    >
      {text ?? "Sign In"}
    </button>
  );
}
