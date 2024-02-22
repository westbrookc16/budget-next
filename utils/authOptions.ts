import GoogleProvider from "next-auth/providers/google";
import prisma from "@/utils/prisma";
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    // Invoked on successful sign in
    async signIn({ profile }) {
      // 1. Connect to database
      // 2. Check if user exists in database
      const user = await prisma.users.findFirst({
        where: { email: profile.email },
      });
      // 3. If not, create user in database
      if (!user) {
        await prisma.users.create({
          data: {
            email: profile.email,
            userName: profile.name,
            picture: profile.picture,
          },
        });
      }
      // 4. return true to allow sign in
      return true;
    },
    // Session callback function that modifies the session object
    async session({ session }) {
      // 1. Get user from database
      const user = await prisma.users.findFirst({
        where: { email: session.user.email },
      });
      // 2. Assign user id from database to session
      session.user.id = user?.id.toString();
      // 3. return session
      return session;
    },
  },
};
