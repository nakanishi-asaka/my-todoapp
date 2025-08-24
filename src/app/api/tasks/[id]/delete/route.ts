import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // サーバー用
);

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const { error } = await supabase.from("task").delete().eq("id", id);

  if (error) {
    console.error("削除エラー:", error);
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.redirect(new URL("/todos", req.url));
}
