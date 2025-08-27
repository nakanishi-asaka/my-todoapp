"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("ログイン失敗:", error.message);
      setError("メールアドレスまたはパスワードが正しくありません");
    } else {
      console.log("ログイン成功:", data);
      // ここでリダイレクトしてもOK
      router.push("/todos");
    }
  };

  return (
    <form
      onSubmit={handleSignIn}
      className="flex flex-col gap-4 p-4 max-w-md mx-auto"
    >
      {/* エラーメッセージ */}
      {error && <p className="text-red-500">{error}</p>}

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="メールアドレス"
        className="border p-2 rounded"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="パスワード"
        className="border p-2 rounded"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded hover:opacity-80 cursor-pointer"
      >
        ログイン
      </button>
    </form>
  );
}
