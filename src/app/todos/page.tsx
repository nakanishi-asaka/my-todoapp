import { DeleteButton } from "./DeleteButton";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import LogoutButton from "./LogoutButton";
import Link from "next/link";

console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 5)); // 先頭だけ表示

export default async function todoListPage() {
  // サーバー側の Supabase クライアント
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return <p>ログインしてください</p>;

  // DB からタスク取得
  const { data: tasks, error } = await supabase
    .from("task")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(
      "タスク取得エラー:",
      error.message,
      error.details,
      error.hint,
      error.code
    );
    return <p className="p-4 text-red-500">エラーが発生しました</p>;
  }

  // ✅ 状態のマッピング表
  const statusLabels: Record<string, string> = {
    todo: "未着手",
    doing: "進行中",
    done: "完了",
  };

  return (
    <div className="p-4 bg-slate-200 min-h-screen">
      <h1 className="text-xl font-bold text-gray-700 mb-4">Todo一覧</h1>

      <Link
        href="/todos/create"
        className="inline-block bg-green-500 text-white px-4 py-2 rounded mb-4 hover:opacity-80 cursor-pointer"
      >
        ＋ 新規作成
      </Link>

      <ul className="space-y-3">
        {tasks?.map((task) => (
          <li
            key={task.id}
            className="p-2 flex rounded justify-between bg-white"
          >
            <div>
              <p className="font-bold text-lg">{task.title}</p>
              <p>ステータス: {statusLabels[task.status] || "不明"}</p>
              <p className="mt-1 text-sm text-gray-500">
                期限:{" "}
                {task.deadline
                  ? new Date(task.deadline).toLocaleDateString("ja-JP")
                  : "未設定"}
              </p>
            </div>
            <div className="flex gap-2">
              <a
                href={`/todos/${task.id}`}
                className="flex items-center justify-center  px-2 py-1 bg-sky-500 text-white rounded hover:opacity-80"
              >
                詳細
              </a>
              <DeleteButton id={task.id} />
            </div>
          </li>
        ))}
      </ul>
      <LogoutButton />
    </div>
  );
}
