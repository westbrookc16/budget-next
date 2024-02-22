import { getSessionUser } from "@/utils/getSessionUser";
import prisma from "@/utils/prisma";
export async function GET(request, { params }) {
  const { month, year } = params;
  const user = await getSessionUser();
  //const prisma = new PrismaClient();
  if (!user) {
    return new Response(`{ msg: "no user" }`, { status: 500 });
  }
  const budget = await prisma.budgets.findFirst({
    where: {
      month: parseInt(month),
      year: parseInt(year),
      userId: user.userId,
    },
  });
  console.log(`userID=${user.userId}`);
  return new Response(
    JSON.stringify(!budget ? { year, month, income: 0.0, id: "" } : budget)
  );
}
