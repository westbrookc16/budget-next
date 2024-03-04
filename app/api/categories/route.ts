import prisma from '@/utils/prisma';

const selectedEnv =
  process.env.NODE_ENV === 'development'
    ? process.env.NEXT_PUBLIC_BASE_URL_DEV
    : process.env.NEXT_PUBLIC_BASE_URL;
export const POST = async (request: any) => {
  const data = await request.formData();
  const budgetId = data.get('budgetId');

  const name = data.get('name');
  const amount = parseFloat(
    data.get('amount').replace('$', '').replace(',', '')
  );
  const isRecurring = data.get('isRecurring') === 'true' ? true : false;
  const id = data.get('id');

  try {
    if (!id) {
      console.log('insert');
      //insert a new category
      const catInserted = await prisma.categories.create({
        data: { budgetId, isRecurring, amount, name },
      });
    } else {
      console.log('update');
      await prisma.categories.update({
        where: { id },
        data: { name, amount, isRecurring },
      });
    } //end else
  } catch (e) {
    //end try catch
    console.log(e);
    return new Response('error', { status: 500 });
  } //end try catch 2
  //lets get the budget for the ID and redirect back
  const budget = await prisma.budgets.findFirst({ where: { id: budgetId } });
  return Response.redirect(
    `${selectedEnv}/budget/${budget?.month}/${budget?.year}`
  );
};
