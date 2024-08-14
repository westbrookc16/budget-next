"use server";
import * as Sentry from "@sentry/nextjs";
//import { getSessionUser } from "@/utils/getSessionUser";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

//action
export async function updateBudget(data: FormData) {
  const supabase = createClient();
  const budgetId = data.get("budgetId") ?? "";
  const month = data.get("month") as string;
  const year = data.get("year") as string;

  const userId = await (await supabase.auth.getUser()).data.user?.id;
  console.log(`submit: ${data.get("submit")}`);
  if (data.get("submit") === "Submit") {
    console.log(`in right if`);
    //try {
    const income = parseFloat(
      (data.get("income")?.toString() ?? "").replace("$", "").replace(",", "")
    );

    if (!userId) {
      return redirect("/login");
    }

    if (!budgetId) {
      //do an insert
      console.log("Inserting");
      const { data: resBudget, error } = await supabase
        .from("budget")
        .insert({ year: +year, month: +month, income, user_id: userId });
      console.log(JSON.stringify(error, null, 2));
      if (error) {
        Sentry.captureException(error);
        return redirect(`/budget/${month}/${year}?message=${error.message}`);
      }
    } else {
      const { error } = await supabase
        .from("budget")
        .update({ income })
        .match({ id: budgetId });
      //}
      if (error) {
        Sentry.captureException(error);
        return redirect(`/budget/${month}/${year}?message=${error.message}`);
      }
    }
    console.log(`redirecting to /budget/${month}/${year}`);
    return redirect(
      `/budget/${month}/${year}?message=budget updated successfully.`
    );

    return {
      message: "Your budget was updated successfully.",
      timestamp: new Date(),
    };
    /*} catch (error) {
      Sentry.captureException(error);
    }*/ //end try
  } //end if
  else if (data.get("submit")?.toString().includes("Categories")) {
    console.log(`copying categories`);
    //copy over categories from previous month
    try {
      let previousMonth = +month - 1;
      let previousYear = +year;
      if (previousMonth === 0) {
        previousMonth = 12;
        previousYear = +year - 1;
      }
      if (!previousMonth || !previousYear || !userId) {
        return { message: "No action taken.", timestamp: new Date() };
      }
      //get the categories from the previous month
      const { data: prevBudget } = await supabase
        .from("budget")
        .select("id")
        .eq("month", previousMonth)
        .eq("year", previousYear)
        .eq("user_id", userId)
        .single();
      if (!prevBudget) {
        return { message: "No action taken.", timestamp: new Date() };
      }
      const prevBudgetId = prevBudget.id;
      //get the categories from the previous month
      const { data: prevCategories } = await supabase
        .from("category")
        .select("*")
        .eq("budget_id", prevBudgetId)
        .eq("is_recurring", true);
      if (!prevCategories) {
        return { message: "No action taken.", timestamp: new Date() };
      }
      //add the categories to the current month
      for (let i = 0; i < prevCategories.length; i++) {
        const { data: resCategory, error } = await supabase
          .from("category")
          .insert({
            name: prevCategories[i].name,
            amount: prevCategories[i].amount,
            is_recurring: true,
            budget_id: +budgetId,
            user_id: userId,
          });
        if (error) {
          Sentry.captureException(error);
          return {
            message: "An error occurred. Please try again.",
            timestamp: new Date(),
          };
        }
      }
    } catch (error) {
      Sentry.captureException(error);
      return {
        message: "An error occurred. Please try again.",
        timestamp: new Date(),
      };
    } //end try
    return {
      message: "your categories were copied successfully.",
      timestamp: new Date(),
    };
  } //end else if
  return { message: "No action taken.", timestamp: new Date() };
}
export async function getBudget(month: string, year: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("budget")
    .select("*")
    .eq("month", month)
    .eq("year", year)
    .single();
  if (error) {
    Sentry.captureException(error);
    return { month, year, income: 0, id: "" };
    //return redirect(`/budget/${month}/${year}?message=${error.message}`);
  }
  return data;
}

//}

//}
export async function refreshBudgetByUrl(month: string, year: string) {
  redirect(`/budget/${month}/${year}`);
}
export async function refreshBudget(data: FormData) {
  const month = data.get("month") as string;
  const year = data.get("year") as string;
  return redirect(`/budget/${month}/${year}`);
}
