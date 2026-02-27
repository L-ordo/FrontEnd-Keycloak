import React, { useState } from "react";
import "./index.css";

type Props = {
  token: string;
  api: {
    createUser: (token: string, payload: any) => Promise<void>;
  };
  onChanged?: () => void;
};

export default function UserForm({ token, api, onChanged }: Props) {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [enabled, setEnabled] = useState(true);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    setMsg("");

    try {
      const payload = { username, enabled, firstName, lastName, email };
      await api.createUser(token, payload);

      setMsg("✅ Usuario creado");
      onChanged?.();

      setUsername("");
      setFirstName("");
      setLastName("");
      setEmail("");
      setEnabled(true);
    } catch (err: any) {
      setMsg("❌ " + (err?.message ?? "Error creando usuario"));
    } finally {
      setLoading(false);
    }
  }

  const isOk = msg.startsWith("✅");
  const isErr = msg.startsWith("❌");

  return (
    <section className="w-full">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="mt-1 text-sm text-slate-500">
              Crea usuarios en Keycloak usando el token del shell.
            </p>
          </div>

          <span
            className={[
              "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
              token
                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                : "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
            ].join(" ")}
          >
            {token ? "Token listo" : "Esperando token"}
          </span>
        </div>

        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Username */}
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Username <span className="text-rose-500">*</span>
            </label>
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100 disabled:bg-slate-50"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="user_test_01"
              disabled={!token || loading}
            />
          </div>

          {/* First name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              First name
            </label>
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100 disabled:bg-slate-50"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Luis"
              disabled={!token || loading}
            />
          </div>

          {/* Last name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Last name
            </label>
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100 disabled:bg-slate-50"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Ordoñez"
              disabled={!token || loading}
            />
          </div>

          {/* Email */}
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100 disabled:bg-slate-50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="user_test_01@test.com"
              disabled={!token || loading}
            />
          </div>

          {/* Enabled */}
          <div className="sm:col-span-2">
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-200"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                disabled={!token || loading}
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-800">Enabled</span>
                <span className="text-xs text-slate-500">
                  Si está apagado, el usuario no podrá iniciar sesión.
                </span>
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="sm:col-span-2 mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={!token || loading}
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creando..." : "Crear usuario"}
            </button>

            {msg && (
              <div
                className={[
                  "rounded-xl px-3 py-2 text-sm ring-1",
                  isOk && "bg-emerald-50 text-emerald-800 ring-emerald-200",
                  isErr && "bg-rose-50 text-rose-800 ring-rose-200",
                  !isOk && !isErr && "bg-slate-50 text-slate-700 ring-slate-200",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {msg}
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}