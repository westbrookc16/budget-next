import { auth, currentUser } from "@clerk/nextjs";
import prisma from "@/utils/prisma";
export async function GET(request, { params }) {
  const { month, year } = params;
  //get user from clerk
  const { userId } = auth();

  if (!userId) {
    return new Response(`{ msg: "no user" }`, { status: 500 });
  }
  const budget = await prisma.budgets.findFirst({
    where: {
      month: parseInt(month),
      year: parseInt(year),
      userId: userId,
    },
  });

  return new Response(
    JSON.stringify(!budget ? { year, month, income: 0.0, id: "" } : budget)
  );
}
