import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans min-h-screen flex flex-col items-center justify-center p-8">
      <main className="flex flex-col items-center gap-6">
        <div className="flex flex-col gap-4 items-center justify-center h-full">
          <p className="font-bold text-3xl">Todoアプリ</p>
          <p className="text-gray-500">Todoの管理を簡単に！</p>
          <Link href="/auth/signin">
            <button className="py-1 px-5 bg-green-600 rounded-xl text-white font-black hover:opacity-80 cursor-pointer">
              ログインする
            </button>
          </Link>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
}
