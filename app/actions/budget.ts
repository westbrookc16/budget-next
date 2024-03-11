"use server";
import * as Sentry from "@sentry/nextjs";
//import { getSessionUser } from "@/utils/getSessionUser";
import prisma from "@/utils/prisma";

import { auth } from "@clerk/nextjs";
//action
export async function updateBudget(initialState: any, data: FormData) {
  const budgetId = data.get("budgetId") ?? "";
  const monthValue = data.get("realMonth");
  const month = monthValue ? parseInt(monthValue.toString()) : 0;

  const yearValue = parseInt(data.get("year")?.toString() ?? "0");
  const year = yearValue ? parseInt(yearValue.toString()) : 0;
  const { userId } = auth();
  if (data.get("submit") === "Submit") {
    try {
      const income = parseFloat(
        (data.get("income")?.toString() ?? "").replace("$", "").replace(",", "")
      );

      if (!userId) {
        return new Response(`{ msg: "no user" }`, { status: 500 });
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
    } catch (e) {
      console.error(e);
      Sentry.captureException(e);
      return {
        message: "There was an error updating your budget.",
        timestamp: new Date(),
      };
    }
    return {
      message: "Your budget was updated successfully.",
      timestamp: new Date(),
    };
  } else {
    //copy over categories from previous month
    try {
      let prevMonth = month - 1;
      let prevYear = year;
      if (prevMonth === 0) {
        prevMonth = 12;
        prevYear = year - 1;
      }
      if (!prevMonth || !prevYear) {
        return;
      }
      //get the budget ID from the previous month
      const prevBudget = await prisma.budgets.findFirst({
        where: {
          month: prevMonth ?? "",
          year: prevYear ?? "",
          userId: userId ?? "",
        },
      });
      if (!prevBudget)
        return { message: "No previous budget found.", timestamp: new Date() };
      const prevCats = await prisma.categories.findMany({
        where: { budgetId: prevBudget?.id, isRecurring: true },
      });

      prevCats.forEach(async (cat) => {
        await prisma.categories.create({
          data: {
            name: cat.name,
            amount: cat.amount,
            budgetId: budgetId as string,
            isRecurring: true,
          },
        });
      });
      return {
        message: "Categories copied over successfully.",
        timestamp: new Date(),
      };
    } catch (e) {
      console.error(e);
      Sentry.captureException(e);
      return {
        message: "There was an error copying over the categories.",
        timestamp: new Date(),
      };
    }
  }
}
