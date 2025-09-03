import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    // Supabase クライアントを作成
    // API Route Handler 内で cookies を渡す→ユーザーのcookie(ログイン情報)がsupabaseに紐づく
    // サーバーコンポーネントや API Route Handler 内で認証状態を管理できる
    const supabase = createRouteHandlerClient({ cookies });

    // サーバー側でログインユーザーを取得
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    console.log("user:", user, "userError:", userError);

    if (!user) {
      return NextResponse.json({ error: "未ログインです" }, { status: 401 });
    }

    const { title, description, status, deadline } = await req.json();

    if (!title || title.length > 50) {
      return NextResponse.json(
        { error: "タイトルは必須かつ50文字以内です" },
        { status: 400 }
      );
    }

    if (description && description.length > 100) {
      return NextResponse.json(
        { error: "説明は100文字以内で入力してください" },
        { status: 400 }
      );
    }

    // DBに挿入
    const { data, error } = await supabase
      .from("task")
      .insert([{ title, description, status, deadline, user_id: user.id }]);

    if (error) {
      console.error("DB insert error:", error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
