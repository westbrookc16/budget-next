import * as sentry from "@sentry/nextjs";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import { stripe } from "@/utils/stripe/config";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: Request, { params }: any) {
  let link: any;
  try {
    const { userId } = params;
    const supabase = createClient();
    const { data: customer, error } = await supabase
      .from("user_data")
      .select("customer")
      .single();
    const customerId = customer?.customer;
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
