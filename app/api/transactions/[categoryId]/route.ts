import prisma from "@/utils/prisma";
export async function GET(request: Request, { params }: any) {
  const { categoryId } = params;
  const transactions = await prisma.transactions.findMany({
    where: {
      categoryId: categoryId,
    },
  });
  if (!transactions) {
    return new Response(JSON.stringify([]));
  }
  return new Response(JSON.stringify(transactions));
}
