import prisma from "@/utils/prisma";
export async function GET(req: Request, { params }: any) {
  const { userid } = params;
  const user = await prisma?.subscriptions.findFirst({
    where: { user_id: userid },
  });
  const subscriptionStatus = user?.status ?? "none";
  const customerId = user?.customer ?? "";
  return new Response(JSON.stringify({ subscriptionStatus, customerId }));
}
