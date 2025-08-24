import { createClient } from "@supabase/supabase-js";
import { DeleteButton } from "./DeleteButton";

export default async function todoListPage() {
  // サーバー側の Supabase クライアント
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // サーバーなら service_role 使える
  );

  // DB からタスク取得
  const { data: tasks, error } = await supabase
    .from("task")
    .select("*")
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
      <h1 className="text-xl font-bold mb-4">タスク一覧</h1>

      <a
        href="/todos/create"
        className="inline-block bg-green-500 text-white px-4 py-2 rounded mb-4 hover:opacity-80 cursor-pointer"
      >
        ＋ 新規作成
      </a>

      <ul className="space-y-2">
        {tasks?.map((task) => (
          <li key={task.id} className="border p-2 flex rounded justify-between">
            <div>
              <p className="font-bold">{task.title}</p>
              <p>{task.description}</p>
              <p>状態: {statusLabels[task.status] || "不明"}</p>
              <p className="mt-1 text-sm text-gray-500">
                期限:{" "}
                {task.deadline
                  ? new Date(task.deadline).toLocaleDateString().split("ja-JP")
                  : "未設定"}
              </p>
            </div>
            <DeleteButton id={task.id} />
          </li>
        ))}
      </ul>
    </div>
  );
}
