import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/api/clerk/webhooks",
  "/api/webhooks",
]);

export default clerkMiddleware((auth, req) => {
  if (isPublicRoute(req)) return; // if it's a public route, do nothing
  auth().protect(); // for any other route, require auth
});
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
