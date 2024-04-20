//import prisma from "@/utils/prisma";
import * as sentry from "@sentry/nextjs";
import Stripe from "stripe";
import { stripe } from "@/utils/stripe/config";
import { createServiceRoleClient } from "@/utils/supabase/server";

const toDateTime = (secs: number) => {
  var t = new Date(+0); // Unix epoch start.
  t.setSeconds(secs);
  return t;
};
const manageSubscriptionStatusChange = async (
  subscriptionID: string,
  customerID: string,
  userId: string,
  isSubscriptionCreated: boolean
) => {
  const subscription = await stripe.subscriptions.retrieve(subscriptionID);

  if (isSubscriptionCreated) {
    //update metadata for subscription in stripe

    await stripe.subscriptions.update(subscriptionID, {
      metadata: {
        userId: userId,
      },
    });
  }

  if (userId && userId !== "") {
    console.log(`updating supabase ${subscription.status}`);
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("user_data")
      .update({
        subscription_status: subscription.status,
        customer: subscription.customer.toString(),
      })
      .match({ user_id: userId });
    if (error) {
      console.error(
        `error updating supabase ${JSON.stringify(error, null, 2)}`
      );
      sentry.captureException(error);
    }
  }
};
const relevantEvents = new Set([
  "product.created",
  "product.updated",
  "product.deleted",
  "price.created",
  "price.updated",
  "price.deleted",
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export async function POST(req: Request) {
  console.log(`🔔 Webhook received!`);
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) {
      console.error(`❌ Webhook secret not found.`);
      return new Response("Webhook secret not found.", { status: 400 });
    }
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`❌ Error message: ${err.message} body=${body} sig=${sig}`);
    sentry.captureException(err);
    return new Response(`Webhook Error: `, { status: 400 });
  }

  if (relevantEvents.has(event.type)) {
    let userId = "";
    try {
      switch (event.type) {
        case "product.created":
        case "product.updated":
          break;
        case "price.created":
        case "price.updated":
          break;
        case "price.deleted":
          break;
        case "product.deleted":
          break;
        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          const subscription = event.data.object as Stripe.Subscription;
          await manageSubscriptionStatusChange(
            subscription.id,
            subscription.customer as string,
            subscription.metadata.userId as string,
            false
          );
          break;
        case "checkout.session.completed":
          const checkoutSession = event.data.object as Stripe.Checkout.Session;
          if (checkoutSession.mode === "subscription") {
            const subscriptionId = checkoutSession.subscription;
            userId = checkoutSession.metadata?.userId as string;

            await manageSubscriptionStatusChange(
              subscriptionId as string,
              checkoutSession.customer as string,
              userId,
              true
            );
          }
          break;
        default:
          throw new Error("Unhandled relevant event!");
      }
    } catch (error: any) {
      sentry.captureException(error);
      console.error(`userId=${userId}`);
      console.error(
        `❌ Webhook handler failed: ${error.message} ${event.type}`
      );
      return new Response(
        `Webhook handler failed. View your Next.js function logs.${error.message}`,
        {
          status: 400,
        }
      );
    }
  } else {
    console.error(`Unsupported event type: ${event.type}`);
    return new Response(`Unsupported event type: ${event.type}`, {
      status: 400,
    });
  }
  return new Response(JSON.stringify({ received: true }));
}
