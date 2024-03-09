import * as sentry from "@sentry/nextjs";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import { stripe } from "@/utils/stripe/config";
import { clerkClient } from "@clerk/nextjs";

export async function GET(req: Request, { params }: any) {
  try {
    const { userId } = params;
    const user = await clerkClient.users.getUser(userId);
    //@ts-ignore
    const customerId = user?.privateMetadata?.stripe?.customer as string;
    if (!customerId) {
      return new Response("Error", { status: 500 });
    }
    const link = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
    });

    return new Response(JSON.stringify({ url: link.url }), { status: 200 });
  } catch (error: any) {
    console.error(error.message);
    sentry.captureException(error);
    return new Response("Error", { status: 500 });
    //return redirect("/error");
  }
}
