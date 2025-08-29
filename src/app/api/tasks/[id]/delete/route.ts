import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });

  // 認証ユーザー取得
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 認証チェック
  if (!user) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
    });
  }

  // タスク削除
  const { error } = await supabase
    .from("task")
    .delete()
    .eq("id", params.id)
    .eq("user_id", user.id);

  if (error) {
    console.error("削除エラー:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
