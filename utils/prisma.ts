import { PrismaClient } from "@prisma/client";

// See here: https://github.com/prisma/prisma-client-js/issues/228#issuecomment-618433162
declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
}
// `stg` or `dev`
else {
  if (!globalThis.prisma) {
    globalThis.prisma = new PrismaClient();
  }

  prisma = globalThis.prisma;
}

export default prisma;
