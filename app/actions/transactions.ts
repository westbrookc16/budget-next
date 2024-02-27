"use server";
import prisma from "@/utils/prisma";
import type { formState } from "@/types/formstate";
export async function createTransaction(
  initialState: formState,
  data: FormData
) {
  const name = String(data.get("name"));
  const amount = Number(
    data.get("amount")?.toString().replace("$", "").replace(",", "") || 0
  );
  const date = new Date(String(data.get("date")));
  const category = String(data.get("realCategory"));
  const description = String(data.get("description"));
  try {
    await prisma.transactions.create({
      data: {
        name,
        amount,
        date,
        categoryId: category,
        description,
      },
    });
  } catch (e) {
    console.error(e);
  }
  return { message: "Transaction created", timestamp: new Date() };
}
