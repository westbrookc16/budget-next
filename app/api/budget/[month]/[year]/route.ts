import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request, { params }: any) {
  const { month, year } = params;

  const { data: budget } = await createClient()
    .from("budget")
    .select("*")
    .match({ month: parseInt(month), year: parseInt(year) });

  return new Response(
    JSON.stringify(
      !budget[0] ? { year, month, income: 0.0, id: "" } : budget[0]
    )
  );
}
