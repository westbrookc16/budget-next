import { createClient } from "@/utils/supabase/server";

export const GET = async (request: Request, { params }: any) => {
  const { budgetId } = params;

  const { data: categories, error } = await createClient()
    .from("category_with_total_spent")
    .select("*")
    .match({ budget_id: budgetId });

  if (error) {
    console.log(JSON.stringify(error));
    return new Response(JSON.stringify({ error: error.message }));
  }
  console.log(`cats=${JSON.stringify(categories, null, 2)}`);
  return new Response(JSON.stringify(categories));
};
