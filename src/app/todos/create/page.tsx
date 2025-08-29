"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TaskCreatePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, status, deadline }),
      credentials: "include", // これ重要！
    });

    if (res.ok) {
      router.push("/todos");
      router.refresh();
    } else {
      const json = await res.json();
      setError(json.error || "保存に失敗しました");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto space-y-4">
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <input
        type="text"
        placeholder="タイトル"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={50}
        className="border p-2 block mb-2 w-full rounded"
      />
      <p className="text-sm text-gray-500">{title.length}/50</p>

      <textarea
        placeholder="説明"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        maxLength={100}
        className="border p-2 block mb-2 w-full rounded"
      />
      <p className="text-sm text-gray-500">{description.length}/100</p>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border p-2 block w-full rounded"
      >
        <option value="todo">未着手</option>
        <option value="doing">進行中</option>
        <option value="done">完了</option>
      </select>

      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        className="border p-2 block w-full rounded"
      />

      <button
        type="submit"
        className="bg-blue-500 text-white my-2 px-4 py-2 rounded hover:opacity-80 cursor-pointer"
      >
        作成
      </button>
    </form>
  );
}
