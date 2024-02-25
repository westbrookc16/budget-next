"use server";
//import { getSessionUser } from "@/utils/getSessionUser";
import prisma from "@/utils/prisma";
import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs";
//action
export async function updateBudget(initialState: any, data: FormData) {
  "use server";

  const monthValue = data.get("realMonth");
  const month = monthValue ? parseInt(monthValue.toString()) : 0;

  const yearValue = parseInt(data.get("year")?.toString() ?? "0");
  const year = yearValue ? parseInt(yearValue.toString()) : 0;
  const income = parseFloat(
    (data.get("income")?.toString() ?? "").replace("$", "").replace(",", "")
  );
  const { userId } = auth();

  if (!userId) {
    return new Response(`{ msg: "no user" }`, { status: 500 });
  }

  const budgetId = data.get("budgetId") ?? "";

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
  cookies().set("notification", "Your budget was updated successfully.", {
    expires: new Date().setSeconds(new Date().getSeconds() + 20),
    httpOnly: false,
  });

  return {
    message: "Your budget was updated successfully.",
    timestamp: new Date(),
  };
  //}
}
