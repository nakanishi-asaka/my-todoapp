import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import LogoutButton from "../LogoutButton";
import { DeleteButton } from "../DeleteButton";
import { cookies } from "next/headers";
import Link from "next/link";

type Props = { params: { id: string } };

export default async function todoDetailPage({ params }: Props) {
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return <p>ログインしてください</p>;

  // DB からタスク取得
  const { data: task, error } = await supabase
    .from("task")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error(
      "タスク取得エラー:",
      error.message,
      error.details,
      error.hint,
      error.code
    );
    return <p className="p-4 text-red-500">タスク取得に失敗しました</p>;
  }

  if (!task) {
    return <p className="p-4">タスクが見つかりません</p>;
  }

  // ✅ 状態のマッピング表
  const statusLabels: Record<string, string> = {
    todo: "未着手",
    doing: "進行中",
    done: "完了",
  };

  return (
    <div className="p-4 bg-slate-200 min-h-screen">
      <h1 className="text-xl font-bold mb-4">タスク詳細</h1>

      <div className="bg-white p-4 rounded shadow">
        <p className="font-bold text-lg">{task.title}</p>
        <p className="mt-1 p-3 border rounded border-gray-300">
          {task.description}
        </p>
        <p className="mt-2">
          ステータス: {statusLabels[task.status] || "不明"}
        </p>
        <p className="mt-1 text-md text-gray-500">
          期限:{" "}
          {task.deadline
            ? new Date(task.deadline).toLocaleDateString("ja-JP")
            : "未設定"}
        </p>

        <div className="mt-4 flex gap-2">
          <Link
            href={`/todos/${task.id}/edit`}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:opacity-80"
          >
            編集
          </Link>
          <DeleteButton id={task.id} />
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <Link href="/todos" className="text-blue-600 my-3 hover:underline">
          ← 一覧に戻る
        </Link>
        <LogoutButton />
      </div>
    </div>
  );
}
