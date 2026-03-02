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
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    setMsg("");

    try {
      const payload = {
        username,
        enabled,
        firstName,
        lastName,
        email,
        credentials: [
          {
            type: "password",
            value: password,
            temporary: false, 
          },
        ],
      };

      await api.createUser(token, payload);

      setMsg("✅ Usuario creado correctamente");
      onChanged?.();

      // Reset form
      setUsername("");
      setFirstName("");
      setLastName("");
      setEmail("");
      setEnabled(true);
      setPassword("");

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
            <h2 className="text-lg font-semibold text-slate-900">
              Crear Usuario
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Crea usuarios en Keycloak con contraseña inicial.
            </p>
          </div>

          <span
            className={[
              "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
              token
                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                : "bg-amber-50 text-amber-700 ring-amber-200",
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
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={!token || loading}
            />
          </div>

          {/* First Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              First name
            </label>
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={!token || loading}
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Last name
            </label>
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={!token || loading}
            />
          </div>

          {/* Email */}
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!token || loading}
            />
          </div>

          {/* Password */}
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Password <span className="text-rose-500">*</span>
            </label>
            <input
              type="password"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={!token || loading}
            />
          </div>

          {/* Enabled */}
          <div className="sm:col-span-2">
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                disabled={!token || loading}
              />
              <span className="text-sm font-medium text-slate-800">
                Usuario habilitado
              </span>
            </label>
          </div>

          {/* Submit */}
          <div className="sm:col-span-2 mt-2 flex flex-col gap-3">
            <button
              type="submit"
              disabled={!token || loading}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {loading ? "Creando..." : "Crear usuario"}
            </button>

            {msg && (
              <div
                className={[
                  "rounded-xl px-3 py-2 text-sm ring-1",
                  isOk && "bg-emerald-50 text-emerald-800 ring-emerald-200",
                  isErr && "bg-rose-50 text-rose-800 ring-rose-200",
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