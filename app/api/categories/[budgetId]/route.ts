import prisma from "@/utils/prisma";

export const GET = async (request: Request, { params }: any) => {
  const { budgetId } = params;
  const categories = await prisma.categories.findMany({
    where: { budgetId: budgetId },
  });
  return new Response(JSON.stringify(categories));
};
