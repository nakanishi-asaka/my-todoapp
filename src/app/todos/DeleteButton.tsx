"use client";

import { useRouter } from "next/navigation";

export function DeleteButton({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    const res = await fetch(`/api/tasks/${id}/delete`, {
      method: "POST",
    });

    if (res.ok) {
      router.refresh(); // 最新のタスク一覧を再取得
    } else {
      console.error("削除失敗");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="flex items-center justify-center  bg-red-500 text-white px-2 py-1 rounded hover:opacity-80 cursor-pointer"
    >
      削除
    </button>
  );
}
