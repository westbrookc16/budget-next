import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import * as sentry from "@sentry/nextjs";
import invariant from "tiny-invariant";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  const userId = data.user?.id;
  const { unit_amount, quantity } = await req.json();
  invariant(userId, "User ID is missing");
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      subscription_data: {
        trial_settings: {
          end_behavior: {
            missing_payment_method: "cancel",
          },
        },
        trial_period_days: 30,
      },
      payment_method_collection: "if_required",
      line_items: [
        {
          price: process.env.STRIPE_PRODUCT_ID as string,
          quantity: 1,
        },

        //},
      ],
      metadata: {
        userId,
      },
      //metadata: { userId },
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/thank-you`,
      cancel_url: `${req.headers.get("origin")}/`,
    });

    return NextResponse.json({ session }, { status: 200 });
  } catch (error) {
    sentry.captureException(error);
    if (error instanceof Error)
      throw new Error(
        `Error creating Stripe checkout session: ${error.message}`,
        { cause: error }
      );
  }
}
