import prisma from "@/utils/prisma";
import * as sentry from "@sentry/nextjs";
export async function GET(req: Request, { params }: any) {
  try {
    const { userid } = params;
    const user = await prisma?.subscriptions.findFirst({
      where: { user_id: userid },
    });
    const subscriptionStatus = user?.status ?? "none";
    const customerId = user?.customer ?? "";
    return new Response(JSON.stringify({ subscriptionStatus, customerId }));
  } catch (error) {
    sentry.captureException(error);
    return new Response("Error", { status: 500 });
  }
}
