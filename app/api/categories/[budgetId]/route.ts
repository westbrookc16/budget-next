import prisma from '@/utils/prisma';

export const GET = async (request, { params }: any) => {
  const { budgetId } = params;
  const categories = await prisma.categories.findMany({
    where: { budgetId },
  });
  return new Response(JSON.stringify(categories));
};
