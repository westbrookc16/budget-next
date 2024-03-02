import * as sentry from "@sentry/nextjs";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import { stripe } from "@/utils/stripe/config";

export async function GET(req: Request, { params }: any) {
  try {
    const { customerId } = params;
    const link = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `https://${process.env.VERCEL_URL as string}`,
    });

    return new Response(JSON.stringify({ url: link.url }), { status: 200 });
  } catch (error) {
    sentry.captureException(error);
    return redirect("/error");
  }
}
