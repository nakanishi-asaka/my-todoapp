import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// サーバー側の Supabase クライアント
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // service_role はサーバー専用
);

console.log(
  "SUPABASE_SERVICE_ROLE_KEY exists:",
  !!process.env.SUPABASE_SERVICE_ROLE_KEY
);
console.log(
  "Service key length:",
  process.env.SUPABASE_SERVICE_ROLE_KEY?.length
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, status, deadline, user_id } = body;

    // バリデーション: タイトルは必須
    if (!title || title.length === 0) {
      return NextResponse.json(
        { error: "タイトルは必須です" },
        { status: 400 }
      );
    }

    // バリデーション: 文字数制限
    if (title.length > 50) {
      return NextResponse.json(
        { error: "タイトルは50文字以内で入力してください" },
        { status: 400 }
      );
    }

    // バリデーション: 説明は任意だが、ある場合は100文字以内
    if (description && description.length > 100) {
      return NextResponse.json(
        { error: "説明は100文字以内で入力してください" },
        { status: 400 }
      );
    }

    // DB にタスクを挿入
    const { data, error } = await supabase
      .from("task")
      .insert([{ title, description, status, deadline, user_id }]);

    //insert時のエラーハンドリング
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
