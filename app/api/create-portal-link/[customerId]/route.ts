import { redirect } from "next/navigation";
import Stripe from "stripe";
import { stripe } from "@/utils/stripe/config";
import { link } from "fs";
export async function GET(req: Request, { params }: any) {
  const { customerId } = params;
  const link = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.VERCEL_URL as string}`,
  });

  return new Response(JSON.stringify({ url: link.url }), { status: 200 });
}
