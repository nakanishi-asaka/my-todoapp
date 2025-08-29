import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import LogoutButton from "../LogoutButton";
import { DeleteButton } from "../DeleteButton";
import { cookies } from "next/headers";

export default async function todoListDetailPage() {
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
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">タスク詳細</h1>

      <ul className="space-y-2">
        {tasks?.map((task) => (
          <li key={task.id} className="border p-2 flex rounded justify-between">
            <div>
              <p className="font-bold">{task.title}</p>
              <p>{task.description}</p>
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
                href={`/todos/${task.id}/edit`}
                className="flex items-center justify-center  px-2 py-1 bg-blue-500 text-white rounded hover:opacity-80"
              >
                編集
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
