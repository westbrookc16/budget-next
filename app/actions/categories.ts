'use server';
import prisma from '@/utils/prisma';
export async function updateCategory(initialState: any, data: FormData) {
  const id = String(data.get('id'));
  const action = data.get('action');

  try {
    if (action === 'delete') {
      await prisma.categories.delete({ where: { id } });
      //return success message
      return { message: 'Your category was deleted successfully.' };
    }
    //now do insert or update
    const isRecurring = data.get('isRecurring') === 'on' ? true : false;
    const budgetId = String(data.get('budgetId'));

    const name = String(data.get('name'));

    let amountData = data.get('amount');

    if (typeof amountData === 'string') {
      const amount = parseFloat(amountData.replace('$', '').replace(',', ''));
      if (!id) {
        console.log('insert');
        //insert a new category
        const catInserted = await prisma.categories.create({
          data: { budgetId, isRecurring, amount, name },
        });
      } else {
        console.log(`isRecurring=${data.get('isRecurring')}`);
        await prisma.categories.update({
          where: { id },
          data: { name, amount, isRecurring },
        });
      }
    } //end else
  } catch (e) {
    //end try catch
    console.log(e);
    return { message: e };
  } //end try catch 2

  return { message: 'Your category was updated/added successfully.' };
}
