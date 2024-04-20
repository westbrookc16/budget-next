import { createClient } from "@/utils/supabase/server";
export async function GET(request: Request, { params }: any) {
  const { categoryId } = params;
  const supabase = createClient();
  const { data: transactions, error } = await supabase
    .from("transaction")
    .select("*")
    .match({ category_id: categoryId });
  if (error) {
    console.log(JSON.stringify(error));
    return new Response(JSON.stringify({ error: error.message }));
  }
  if (!transactions) {
    return new Response(JSON.stringify([]));
  }
  return new Response(JSON.stringify(transactions));
}
