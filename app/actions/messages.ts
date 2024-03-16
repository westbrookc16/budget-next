"use server";
import { redirect } from "next/navigation";
import prisma from "@/utils/prisma";
import { messages } from "@prisma/client";
export async function add(data: FormData) {
  const name = data.get("name") as string;
  const email = data.get("email") as string;
  const message = data.get("message") as string;
  await prisma.messages.create({
    data: {
      name,
      email,
      message,
    },
  });
  return redirect(`${process.env.NEXT_PUBLIC_BASE_URL}`);
}
