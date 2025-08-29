"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Supabase のサインアウト
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // ログアウト後はトップページに遷移
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("ログアウト失敗:", err);
      alert("ログアウトに失敗しました");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 my-2 rounded hover:opacity-80"
    >
      ログアウト
    </button>
  );
}
