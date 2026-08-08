import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "팀 로그인 · 해상풍력 벤치마킹 출장 2026" },
      { name: "description", content: "출장 팀원 로그인 — 이메일/비밀번호로 일정을 편집합니다." },
      { property: "og:title", content: "팀 로그인 · 해상풍력 벤치마킹 출장 2026" },
      { property: "og:description", content: "출장 팀원 로그인" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) nav({ to: "/" });
    });
  }, [nav]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        nav({ to: "/" });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        setMsg("가입 완료. 로그인 후 편집이 가능합니다.");
        setMode("signin");
      }
    } catch (err: any) {
      setMsg(err?.message ?? "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg border p-6">
        <h1 className="text-xl font-bold mb-1">팀원 로그인</h1>
        <p className="text-xs text-slate-500 mb-4">
          해상풍력 벤치마킹 출장 2026 · 편집을 위해 로그인이 필요합니다.
        </p>
        <form onSubmit={submit} className="space-y-3">
          <input
            type="email"
            required
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="비밀번호 (6자 이상)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm"
          />
          <button
            disabled={loading}
            className="w-full rounded bg-slate-900 text-white py-2 text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? "처리 중…" : mode === "signin" ? "로그인" : "가입"}
          </button>
        </form>
        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-3 w-full text-xs text-slate-600 hover:underline"
        >
          {mode === "signin" ? "계정이 없으신가요? 가입" : "이미 계정이 있으신가요? 로그인"}
        </button>
        {msg && <p className="mt-3 text-xs text-red-600">{msg}</p>}
        <a href="/" className="mt-4 block text-center text-xs text-slate-500 hover:underline">
          ← 읽기 전용으로 보기
        </a>
      </div>
    </div>
  );
}