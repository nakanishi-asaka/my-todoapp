"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

export default function EditTodoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState("");

  // 既にある値を取得してフォームにセット
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const { data, error } = await supabase
          .from("task")
          .select("id,title,description,status,deadline")
          .eq("id", id)
          .single();

        if (error) {
          setError("データ取得に失敗しました");
          console.error(error);
        } else if (data) {
          setTitle(data.title);
          setDescription(data.description);
          setStatus(data.status);
          setDeadline(data.deadline ? data.deadline.split("T")[0] : "");
        }
      } catch (err) {
        console.error(err);
        setError("通信エラーが発生しました");
      }
    };

    fetchTask();
  }, [id]);

  // 更新処理
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      setError("タイトルは必須です");
      return;
    }

    try {
      const { error } = await supabase
        .from("task")
        .update({
          title,
          description,
          status,
          deadline,
        })
        .eq("id", id);

      if (error) {
        setError("更新に失敗しました");
        console.error(error);
      } else {
        router.push("/todos");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError("通信エラーが発生しました");
    }
  };

  return (
    <form onSubmit={handleUpdate} className="p-4 max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-bold">タスク編集</h1>

      {error && <p className="text-red-500">{error}</p>}

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="タイトル"
        className="border p-2 w-full"
        maxLength={50}
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="説明"
        className="border p-2 w-full"
        maxLength={100}
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border p-2 w-full"
      >
        <option value="todo">未着手</option>
        <option value="doing">進行中</option>
        <option value="done">完了</option>
      </select>

      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        className="border p-2 w-full"
      />

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:opacity-80"
      >
        更新
      </button>
    </form>
  );
}
