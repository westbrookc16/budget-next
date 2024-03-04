import * as sentry from "@sentry/nextjs";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import { stripe } from "@/utils/stripe/config";

export async function GET(req: Request, { params }: any) {
  try {
    const { customerId } = params;
    const link = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
    });

    return new Response(JSON.stringify({ url: link.url }), { status: 200 });
  } catch (error) {
    console.error(error.message);
    sentry.captureException(error);
    //return redirect("/error");
  }
}
