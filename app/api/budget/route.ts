import { getSessionUser } from "@/utils/getSessionUser";
import prisma from "@/utils/prisma";

export const POST = async (request: any) => {
  const data = await request.formData();
  console.log(`year=${data.get("year")}`);
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
  return Response.redirect(
    `${process.env.NEXTAUTH_URL}/budget/${month}/${year}`
  );
  //}
};
