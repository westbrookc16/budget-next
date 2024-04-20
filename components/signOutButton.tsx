"use client";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
export default function SignOutButton() {
  const supabase = createClient();
  return (
    <button
      onClick={async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.log("Error logging out:", error.message);
        redirect("/");
      }}
    >
      Sign Out
    </button>
  );
}
