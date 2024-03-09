//import { user } from "@clerk/clerk-react";
interface publicMetadata {
  stripe?: { subscriptionStatus: string };
}
interface privateMetadata {
  stripe?: { customer: string };
}
interface clerkUser extends user {
  publicMetadata: publicMetadata;
  privateMetadata: privateMetadata;
}
