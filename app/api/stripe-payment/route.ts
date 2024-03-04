import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import * as sentry from "@sentry/nextjs";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export async function POST(req: NextRequest) {
  const { userId } = auth();
  const { unit_amount, quantity } = await req.json();

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      subscription_data: {
        trial_settings: {
          end_behavior: {
            missing_payment_method: "cancel",
          },
        },
        trial_period_days: 7,
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
