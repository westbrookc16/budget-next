import * as sentry from "@sentry/nextjs";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import { stripe } from "@/utils/stripe/config";
import { clerkClient } from "@clerk/nextjs/server";

export async function GET(req: Request, { params }: any) {
  let link: any;
  try {
    const { userId } = params;
    const user = await clerkClient.users.getUser(userId);

    const customerId = user.privateMetadata.stripe.customer;
    if (!customerId) {
      console.log(`No customer found for user ${userId}`);
      return new Response("Error", { status: 500 });
    }
    link = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
    });
  } catch (error: any) {
    console.error(error.message);
    sentry.captureException(error);
    return new Response("Error", { status: 500 });
    //return redirect("/error");
  }

  return redirect(link.url);
}
