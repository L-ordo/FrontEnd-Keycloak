import React, { useEffect, useState } from "react";

export type KCUser = {
  id: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  enabled?: boolean;
};

type Props = {
  token: string;
  refreshKey?: number;
  api: {
    listUsers: (token: string) => Promise<KCUser[]>;
    deleteUser: (token: string, userId: string) => Promise<void>;
  };
};

export default function UsersList({ token, api, refreshKey = 0 }: Props) {
  const [users, setUsers] = useState<KCUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  async function load() {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const data = await api.listUsers(token);
      setUsers(data);
    } catch (e: any) {
      setError(e?.message ?? "Error listando usuarios");
    } finally {
      setLoading(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("¿Eliminar este usuario?")) return;
    try {
      await api.deleteUser(token, id);
      await load();
    } catch (e: any) {
      alert(e?.message ?? "Error eliminando usuario");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, refreshKey]);

  return (
    <section className="w-full">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {/* Header */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Users List (Remote)</h2>
            <p className="mt-1 text-sm text-slate-500">
              Lista usuarios desde Keycloak Admin API.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={[
                "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1",
                token
                  ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                  : "bg-amber-50 text-amber-700 ring-amber-200",
              ].join(" ")}
            >
              {token ? "Token listo" : "Esperando token"}
            </span>

            <button
              onClick={load}
              disabled={!token || loading}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Cargando..." : "Refrescar"}
            </button>
          </div>
        </div>

        {/* States */}
        {!token && (
          <div className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800 ring-1 ring-amber-200">
            Esperando token...
          </div>
        )}

        {error && (
          <div className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-800 ring-1 ring-rose-200">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Username
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Nombre
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white">
                {users.map((u) => {
                  const fullName = `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim();
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/60">
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">
                        {u.username ?? "—"}
                      </td>

                      <td className="px-4 py-3 text-sm text-slate-700">
                        {fullName || "—"}
                      </td>

                      <td className="px-4 py-3 text-sm text-slate-700">
                        {u.email ?? "—"}
                      </td>

                      <td className="px-4 py-3 text-sm">
                        <span
                          className={[
                            "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1",
                            u.enabled
                              ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                              : "bg-slate-100 text-slate-700 ring-slate-200",
                          ].join(" ")}
                        >
                          {u.enabled ? "Activo" : "Inactivo"}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => onDelete(u.id)}
                          disabled={!token || loading}
                          className="inline-flex items-center justify-center rounded-xl bg-rose-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-200 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {users.length === 0 && !loading && (
                  <tr>
                    <td
                      className="px-4 py-8 text-center text-sm text-slate-500"
                      colSpan={5}
                    >
                      No hay usuarios
                    </td>
                  </tr>
                )}

                {loading && (
                  <tr>
                    <td
                      className="px-4 py-8 text-center text-sm text-slate-500"
                      colSpan={5}
                    >
                      Cargando usuarios...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-3 text-xs text-slate-500">
          Total: <span className="font-semibold text-slate-700">{users.length}</span>
        </div>
      </div>
    </section>
  );
}