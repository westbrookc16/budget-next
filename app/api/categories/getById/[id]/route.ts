import prisma from "@/utils/prisma";
export async function GET(request: Request, { params }: any) {
  const { id } = params;
  console.log(`calling api/categories/getById/${id}`);
  const category = await prisma.categories.findUnique({
    where: {
      id: id,
    },
  });

  return new Response(JSON.stringify(category));
}
