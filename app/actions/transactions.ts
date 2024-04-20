"use server";
import * as sentry from "@sentry/nextjs";
import { createClient } from "@/utils/supabase/server";
import type { formState } from "@/types/formstate";
export async function createTransaction(
  initialState: formState,
  data: FormData
) {
  const name = String(data.get("name"));
  const amount = Number(
    data.get("amount")?.toString().replace("$", "").replace(",", "") || 0
  );
  const date = new Date(String(data.get("date")));
  const category = String(data.get("realCategory"));
  const description = String(data.get("description"));
  try {
    const supabase = createClient();
    const userId = await (await supabase.auth.getUser()).data.user?.id;
    const { error } = await supabase.from("transaction").insert({
      amount,
      date: date.toISOString(),
      category_id: +category,
      description,
      user_id: userId,
      name,
    });
    if (error) {
      sentry.captureException(error);
      console.error(error);
    }
  } catch (e) {
    console.error(e);
    sentry.captureException(e);
  }
  return { message: "Transaction created", timestamp: new Date() };
}
export async function updateTransaction(
  initialState: formState,
  data: FormData
) {
  const name = String(data.get("name"));
  const amount = Number(
    data.get("amount")?.toString().replace("$", "").replace(",", "") || 0
  );
  const date = String(data.get("date"));
  const category = String(data.get("realCategory"));
  const description = String(data.get("description"));
  const id = String(data.get("id"));
  try {
    const supabase = createClient();
    const userId = await (await supabase.auth.getUser()).data.user?.id;
    const { error } = await supabase
      .from("transaction")
      .update({
        amount,
        date,
        category_id: +category,
        description,
        name,
      })
      .match({ id });
    if (error) {
      sentry.captureException(error);
      console.error(error);
    }
  } catch (e) {
    console.error(e);
    sentry.captureException(e);
  }
  return { message: "Transaction updated", timestamp: new Date() };
}
export async function deleteTransaction(
  initialState: formState,
  data: FormData
) {
  const id = String(data.get("id"));
  try {
    const supabase = createClient();
    const userId = await (await supabase.auth.getUser()).data.user?.id;
    const { error } = await supabase.from("transaction").delete().match({ id });
    if (error) {
      sentry.captureException(error);
      console.error(error);
    }
  } catch (e) {
    console.error(e);

    sentry.captureException(e);
  }
  return { message: "Transaction deleted", timestamp: new Date() };
}
