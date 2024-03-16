"use server";
import * as sentry from "@sentry/nextjs";
import prisma from "@/utils/prisma";
export async function getCategoriesByMonthYear(month: number, year: number) {
  try {
    const res = await prisma.budgets.findFirst({ where: { month, year } });
    if (!res) {
      return [];
    }
    const res2 = await prisma.categories.findMany({
      where: { budgetId: res.id },
    });
    return res2;
  } catch (e) {
    sentry.captureException(e);
    return [];
  }
}
export async function updateCategory(initialState: any, data: FormData) {
  const id = String(data.get("id"));
  const action = data.get("action");

  try {
    if (action === "delete") {
      await prisma.categories.delete({ where: { id } });
      //return success message
      return { message: "Your category was deleted successfully." };
    }
    //now do insert or update

    const isRecurring = data.get("isRecurring") === "on" ? true : false;
    const budgetId = data.get("budgetId")?.toString() ?? "";

    const name = data.get("name")?.toString() ?? "";
    const amount = parseFloat(
      (data.get("amount")?.toString() ?? "").replace("$", "").replace(",", "")
    );
    if (!id) {
      //insert a new category
      const catInserted = await prisma.categories.create({
        data: { budgetId, isRecurring, amount, name },
      });
    } else {
      await prisma.categories.update({
        where: { id },
        data: { name, amount, isRecurring },
      });
    } //end else
  } catch (e) {
    //end try catch
    sentry.captureException(e);
    return { message: "There was an error." };
    console.error(e);
  } //end try catch 2

  return { message: "Your category was updated/added successfully." };
}
