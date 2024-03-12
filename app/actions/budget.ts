"use server";
import * as Sentry from "@sentry/nextjs";
//import { getSessionUser } from "@/utils/getSessionUser";
import prisma from "@/utils/prisma";

import { auth } from "@clerk/nextjs";
//action
export async function updateBudget(initialState: any, data: FormData) {
  const budgetId = data.get("budgetId") ?? "";
  const monthValue = data.get("realMonth") ?? "";
  const month = monthValue ? parseInt(monthValue.toString()) : 0;

  const yearValue = parseInt(data.get("year")?.toString() ?? "0");
  const year = yearValue ? parseInt(yearValue.toString()) : 0;
  const { userId } = auth() ?? "";
  console.log(`submit: ${data.get("submit")}`);
  if (data.get("submit") === "Submit") {
    console.log(`in right if`);
    try {
      const income = parseFloat(
        (data.get("income")?.toString() ?? "").replace("$", "").replace(",", "")
      );

      if (!userId) {
        return { message: "No user found.", timestamp: new Date() };
      }

      if (!budgetId) {
        //do an insert
        const resBudget = await prisma.budgets.create({
          data: { month, year, income, userId },
        });
      } else {
        await prisma.budgets.update({
          data: { income },
          where: { id: budgetId.toString() },
        });
      }
      return {
        message: "Your budget was updated successfully.",
        timestamp: new Date(),
      };
    } catch (error) {
      Sentry.captureException(error);
      return {
        message: "An error occurred. Please try again.",
        timestamp: new Date(),
      };
    } //end try
  } //end if
  else if (data.get("submit")?.toString().includes("Categories")) {
    console.log(`copying categories`);
    //copy over categories from previous month
    try {
      let previousMonth = month - 1;
      let previousYear = year;
      if (previousMonth === 0) {
        previousMonth = 12;
        previousYear = year - 1;
      }
      if (!previousMonth || !previousYear || !userId) {
        return { message: "No action taken.", timestamp: new Date() };
      }
      const previousBudget = await prisma.budgets.findFirst({
        where: { userId, month: previousMonth, year: previousYear },
      });
      const previousBudgetId = previousBudget?.id;
      const previousCategories = await prisma.categories.findMany({
        where: { budgetId: previousBudgetId, isRecurring: true },
      });
      const currentBudget = await prisma.budgets.findFirst({
        where: { userId, month, year },
      });
      const currentBudgetId = currentBudget?.id;
      if (!currentBudgetId) {
        return { message: "No action taken.", timestamp: new Date() };
      }
      for (const category of previousCategories) {
        const { name, amount, isRecurring } = category;
        await prisma.categories.create({
          data: {
            name,
            amount,
            isRecurring,
            budgetId: currentBudgetId,
          },
        });
      } //end for
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
