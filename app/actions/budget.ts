"use server";
import { getSessionUser } from "@/utils/getSessionUser";
import prisma from "@/utils/prisma";
import { cookies } from "next/headers";

//action
export async function updateBudget(initialState: any, data: FormData) {
  "use server";

  const month = parseInt(data.get("realMonth"));
  const year = parseInt(data.get("year"));

  const income = parseFloat(
    data.get("income").replace("$", "").replace(",", "")
  );
  const user = await getSessionUser();
  if (!user) {
    console.log(`no user`);
    return new Response(`{ msg: "no user" }`, { status: 500 });
  }
  const userId = user.userId;
  const budgetId = data.get("budgetId");
  if (!budgetId) {
    //do an insert
    const resBudget = await prisma.budgets.create({
      data: { month, year, income, userId },
    });
  } else {
    await prisma.budgets.update({
      data: { income },
      where: { id: budgetId },
    });
  }
  cookies().set("notification", "Your budget was updated successfully.", {
    expires: new Date().setSeconds(new Date().getSeconds() + 20),
    httpOnly: false,
  });

  return { message: "Your budget was updated successfully." };
  //}
}
