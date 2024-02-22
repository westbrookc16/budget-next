import prisma from "@/utils/prisma";

export const GET = async (request, { params }) => {
  const { budgetId } = params;
  const categories = await prisma.categories.findMany({
    where: { budgetId: budgetId },
  });
  return new Response(JSON.stringify(categories));
};
