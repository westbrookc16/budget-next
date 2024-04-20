import { createClient } from "@/utils/supabase/server";
export async function GET(request: Request, { params }: any) {
  const { id } = params;

  const { data: category, error } = await createClient()
    .from("category")
    .select("*")
    .match({ id });
  if (error) {
    console.log(JSON.stringify(error));
    return new Response(JSON.stringify({ error: error.message }));
  }

  return new Response(JSON.stringify(category[0]));
}
