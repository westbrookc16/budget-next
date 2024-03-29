import prisma from "@/utils/prisma";
export const POST = async (request: any) => {
  const data = await request.formData();
  const budgetId = data.get("budgetId");

  const name = data.get("name");
  const amount = parseFloat(
    data.get("amount").replace("$", "").replace(",", "")
  );
  const isRecurring = data.get("isRecurring") === "true" ? true : false;
  const id = data.get("id");

  try {
    if (!id) {
      //insert a new category
      const catInserted = await prisma.categories.create({
        data: { budgetId, isRecurring, amount, name },
      });
    } else {
      await prisma.categories.update({
        where: { id },
        data: { name, amount, isRecurring },
      });
    } //end else
  } catch (e) {
    //end try catch

    return new Response("error", { status: 500 });
  } //end try catch 2
  //lets get the budget for the ID and redirect back
  const budget = await prisma.budgets.findFirst({ where: { id: budgetId } });
  return Response.redirect(
    `${process.env.NEXT_PUBLIC_BASE_URL}/budget/${budget?.month}/${budget?.year}`
  );
};
