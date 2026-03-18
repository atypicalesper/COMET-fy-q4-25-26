"use client";

import { useState } from "react";
import { loginUser, registerUser } from "@/lib/ragApi";
import { useAuth } from "./AuthContext";

type Tab = "login" | "register";

export default function LoginModal() {
  const { login } = useAuth();
  const [tab, setTab] = useState<Tab>("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      setError("");
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result =
        tab === "login"
          ? await loginUser(form.email, form.password)
          : await registerUser(form.name, form.email, form.password);
      login(result.token, result.user);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 bg-[#0a0a0f] text-[#e8e8f0] border border-[#2a2a3a] rounded-lg text-sm outline-none placeholder:text-[#555570] focus:border-[#6c5ce7] transition-colors";

  return (
    <div className="fixed inset-0 bg-[#0a0a0f] flex items-center justify-center p-4 z-[200]">
      <div className="w-full max-w-[400px] bg-[#12121a] border border-[#2a2a3a] rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-[#e8e8f0] mb-1">
          RAG <span className="text-[#6c5ce7]">Chat</span>
        </h1>
        <p className="text-sm text-[#555570] mb-7">
          {tab === "login"
            ? "Sign in to access your documents"
            : "Create an account to get started"}
        </p>

        <div className="flex bg-[#0a0a0f] rounded-lg p-1 mb-6 gap-1">
          {(["login", "register"] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setTab(t);
                setError("");
              }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                tab === t
                  ? "bg-[#6c5ce7] text-white"
                  : "text-[#8888a0] hover:text-[#e8e8f0]"
              }`}
            >
              {t === "login" ? "Sign in" : "Create account"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {tab === "register" && (
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={set("name")}
              required
              autoComplete="name"
              className={inputClass}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={set("email")}
            required
            autoComplete="email"
            className={inputClass}
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={set("password")}
            required
            minLength={6}
            autoComplete={tab === "login" ? "current-password" : "new-password"}
            className={inputClass}
          />

          {error && (
            <div className="px-3 py-2.5 bg-[rgba(255,107,107,0.1)] text-[#ff6b6b] border border-[rgba(255,107,107,0.2)] rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#6c5ce7] text-white rounded-lg text-sm font-semibold transition-all hover:bg-[#7c6ff7] hover:shadow-[0_0_24px_rgba(108,92,231,0.4)] disabled:opacity-50 disabled:cursor-not-allowed !mt-5"
          >
            {loading
              ? "Please wait…"
              : tab === "login"
                ? "Sign in"
                : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}
