import prisma from "@/utils/prisma";
export async function GET(request: Request, { params }: any) {
  const { categoryId } = params;
  const transactions = await prisma.transactions.findMany({
    where: {
      categoryId: categoryId,
    },
  });
  return new Response(JSON.stringify(transactions));
}
