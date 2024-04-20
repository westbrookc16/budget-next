"use client";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
export default function SignOutButton() {
  const supabase = createClient();
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.log("Error logging out:", error.message);
        router.push("/");
      }}
    >
      Sign Out
    </button>
  );
}
