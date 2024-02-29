import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import prisma from "@/utils/prisma";
const toDateTime = (secs: number) => {
  var t = new Date(+0); // Unix epoch start.
  t.setSeconds(secs);
  return t;
};
export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");
  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", { status: 400 });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);
  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;
  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  //console.log("Webhook body:", body);
  console.log(`userId: ${evt.data.id} and event type: ${evt.type}`);
  if (evt.type === "user.created") {
    console.log("User created");
    await prisma.users.create({
      data: {
        user_id: evt.data.id,
        email: evt.data.email_addresses[0].email_address,
        first_name: evt.data.first_name,
        last_name: evt.data.last_name,
      },
    });
  } else if (evt.type === "user.updated") {
    console.log("User updated");
    await prisma.users.update({
      where: {
        user_id: evt.data.id,
      },
      data: {
        email: evt.data.email_addresses[0].email_address,
        last_sign_in_at: evt.data.last_sign_in_at,

        first_name: evt.data.first_name,
        last_name: evt.data.last_name,
      },
    });
  }
  return new Response("", { status: 200 });
}