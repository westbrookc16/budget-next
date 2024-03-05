import prisma from "@/utils/prisma";
import * as sentry from "@sentry/nextjs";
import Stripe from "stripe";
import { stripe } from "@/utils/stripe/config";
/*import {
  upsertProductRecord,
  upsertPriceRecord,
  manageSubscriptionStatusChange,
  deleteProductRecord,
  deletePriceRecord,
} from "@/utils/supabase/admin";*/
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

  //
  const dbSub = await prisma?.subscriptions.findUnique({
    where: { subscription_id: subscriptionID },
  });
  if (isSubscriptionCreated) {
    //update metadata for subscription in stripe

    await stripe.subscriptions.update(subscriptionID, {
      metadata: {
        userId: userId,
      },
    });
  }
  if (!dbSub) {
    //if it is cancelled, we do not want to insert a new record
    if (subscription.status === "canceled") {
      return;
    }

    // Create a new subscription record in the database
    isSubscriptionCreated &&
      (await prisma?.subscriptions.create({
        data: {
          subscription_id: subscriptionID,
          user_id: subscription.metadata.userId as string,
          customer: customerID,
          status: subscription.status,
          metadata: JSON.stringify(subscription.metadata),
          price_id: subscription.items.data[0].price.id,
          cancel_at_period_end: subscription.cancel_at_period_end,
          cancel_at: subscription.cancel_at
            ? toDateTime(subscription.cancel_at as number).toISOString()
            : null,
          current_period_end: subscription.current_period_end
            ? toDateTime(
                subscription.current_period_end as number
              ).toISOString()
            : null,
          canceled_at: subscription.canceled_at
            ? toDateTime(subscription.canceled_at as number).toISOString()
            : null,
          current_period_start: subscription.current_period_start
            ? toDateTime(
                subscription.current_period_start as number
              ).toISOString()
            : null,
          created: toDateTime(subscription.created).toISOString(),
          ended_at: subscription.ended_at
            ? toDateTime(subscription.ended_at as number).toISOString()
            : null,
          trial_end: subscription.trial_end
            ? toDateTime(subscription.trial_end as number).toISOString()
            : null,
          trial_start: subscription.trial_start
            ? toDateTime(subscription.trial_start as number).toISOString()
            : null,
        },
      }));
  } else {
    //if the status is cancelled, delete the subscription
    if (subscription.status === "canceled") {
      await prisma?.subscriptions.delete({
        where: { subscription_id: subscriptionID },
      });
      return;
    }
    // Update the existing subscription record in the database

    await prisma?.subscriptions.update({
      where: { subscription_id: subscriptionID },
      data: {
        status: subscription.status,
        metadata: JSON.stringify(subscription.metadata),
        user_id: subscription.metadata.userId as string,
        price_id: subscription.items.data[0].price.id,
        cancel_at_period_end: subscription.cancel_at_period_end,
        cancel_at: subscription.cancel_at
          ? toDateTime(subscription.cancel_at as number).toISOString()
          : null,
        current_period_end: subscription.current_period_end
          ? toDateTime(subscription.current_period_end as number).toISOString()
          : null,
        canceled_at: subscription.canceled_at
          ? toDateTime(subscription.canceled_at as number).toISOString()
          : null,
        current_period_start: subscription.current_period_start
          ? toDateTime(
              subscription.current_period_start as number
            ).toISOString()
          : null,
        ended_at: subscription.ended_at
          ? toDateTime(subscription.ended_at as number).toISOString()
          : null,
        trial_end: subscription.trial_end
          ? toDateTime(subscription.trial_end as number).toISOString()
          : null,
        trial_start: subscription.trial_start
          ? toDateTime(subscription.trial_start as number).toISOString()
          : null,
      },
    });
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
            userId,
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
