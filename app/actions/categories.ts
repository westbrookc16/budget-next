"use server";
import { createClient } from "@/utils/supabase/server";
import invariant from "tiny-invariant";
import * as sentry from "@sentry/nextjs";

export async function getCategoriesByMonthYear(month: number, year: number) {
  try {
    const supabase = createClient();

    const res =
      //@ts-ignore
      (await supabase.from("budget").select("id").match({ month, year }))
        ?.data[0]?.id ?? -1;
    console.log(`res=${res}`);
    if (!res) {
      return [];
    }
    const res2 = await supabase
      .from("category_with_total_spent")
      .select("*")
      .match({ budget_id: res });
    console.log(res2.error);
    return res2.data;
  } catch (e) {
    sentry.captureException(e);
    return [];
  }
}
export async function updateCategory(initialState: any, data: FormData) {
  const supabase = createClient();
  const id = String(data.get("id"));
  const action = data.get("action");

  try {
    if (action === "delete") {
      const { error } = await supabase.from("category").delete().match({ id });
      if (error) {
        sentry.captureException(error);
        console.log(JSON.stringify(error));
        return { message: "There was an error." };
      }
      //return success message
      return { message: "Your category was deleted successfully." };
    }
    //now do insert or update

    const isRecurring = data.get("is_recurring") === "on" ? true : false;
    const budgetId = data.get("budgetId")?.toString() ?? "";

    const name = data.get("name")?.toString() ?? "";
    const amount = parseFloat(
      (data.get("amount")?.toString() ?? "").replace("$", "").replace(",", "")
    );
    if (parseInt(id) === 0) {
      //insert a new category

      const userId = (await supabase.auth.getUser()).data.user?.id;
      const { data, error } = await supabase.from("category").insert({
        name,
        amount,
        is_recurring: isRecurring,
        budget_id: +budgetId,
        user_id: userId,
      });
      if (error) {
        sentry.captureException(error);
        console.log(JSON.stringify(error));
        return { message: "There was an error." };
      }
    } else {
      await supabase
        .from("category")
        .update({ name, amount, is_recurring: isRecurring })
        .match({ id });
    } //end else
  } catch (e) {
    //end try catch
    sentry.captureException(e);
    return { message: "There was an error." };
    console.error(e);
  } //end try catch 2

  return { message: "Your category was updated/added successfully." };
}
