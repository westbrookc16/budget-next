"use server";
import * as sentry from "@sentry/nextjs";
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
    //get hte category the transaction belongs to
    const cat = await prisma.categories.findUnique({
      where: { id: category },
    });
    //update the category total spent
    await prisma.categories.update({
      where: { id: category },
      data: { totalSpent: (cat?.totalSpent ?? 0) + amount },
    });
  } catch (e) {
    console.error(e);
    sentry.captureException(e);
  }
  return { message: "Transaction created", timestamp: new Date() };
}
export async function updateTransaction(
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
  const id = String(data.get("id"));
  try {
    //get the category for the transaction to get the old total spent
    const cat = await prisma.categories.findUnique({ where: { id: category } });

    const currentTransaction = await prisma.transactions.findUnique({
      where: { id },
    });

    await prisma.transactions.update({
      where: { id },
      data: {
        name,
        amount,
        date,
        categoryId: category,
        description,
      },
    });

    //update the category total spent

    const newTotalSpent =
      (cat?.totalSpent ?? 0) + amount - (currentTransaction?.amount ?? 0);

    const updatedCat = await prisma.categories.update({
      where: { id: category },
      data: {
        totalSpent: newTotalSpent,
      },
    });
  } catch (e) {
    console.error(e);
    sentry.captureException(e);
  }
  return { message: "Transaction updated", timestamp: new Date() };
}
export async function deleteTransaction(
  initialState: formState,
  data: FormData
) {
  const id = String(data.get("id"));
  try {
    await prisma.transactions.delete({ where: { id } });
    const amount = parseFloat(
      (data.get("amount") as string).replace("$", "").replace(",", "")
    );
    const category = String(data.get("realCategory"));

    const cat = await prisma.categories.findUnique({ where: { id: category } });
    await prisma.categories.update({
      where: { id: category },
      data: { totalSpent: (cat?.totalSpent ?? 0) - amount },
    });
  } catch (e) {
    console.error(e);

    sentry.captureException(e);
  }
  return { message: "Transaction deleted", timestamp: new Date() };
}
