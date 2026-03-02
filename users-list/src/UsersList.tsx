import React, { useEffect, useMemo, useState } from "react";

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
    updateUser: (token: string, userId: string, payload: any) => Promise<void>;
  };
};

function shortId(id: string) {
  if (!id) return "—";
  return id.length <= 10 ? id : `${id.slice(0, 8)}…`;
}

export default function UsersList({ token, api, refreshKey = 0 }: Props) {
  const [users, setUsers] = useState<KCUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Search
  const [query, setQuery] = useState("");

  // --- Edit modal state ---
  const [editing, setEditing] = useState<KCUser | null>(null);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editEnabled, setEditEnabled] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMsg, setEditMsg] = useState<string>("");

  const canInteract = useMemo(() => !!token && !loading, [token, loading]);

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

  async function onDelete(id: string, username?: string) {
    const name = username ? ` (@${username})` : "";
    if (!confirm(`¿Eliminar este usuario${name}?`)) return;

    try {
      await api.deleteUser(token, id);
      await load();
    } catch (e: any) {
      alert(e?.message ?? "Error eliminando usuario");
    }
  }

  function openEdit(u: KCUser) {
    setEditing(u);
    setEditFirstName(u.firstName ?? "");
    setEditLastName(u.lastName ?? "");
    setEditEmail(u.email ?? "");
    setEditEnabled(u.enabled ?? true);
    setEditMsg("");
  }

  function closeEdit() {
    setEditing(null);
    setEditMsg("");
  }

  async function saveEdit() {
    if (!token || !editing) return;

    setSaving(true);
    setEditMsg("");

    try {
      const payload = {
        firstName: editFirstName,
        lastName: editLastName,
        email: editEmail,
        enabled: editEnabled,
      };

      await api.updateUser(token, editing.id, payload);

      setEditMsg("✅ Usuario actualizado");
      await load();

      setTimeout(() => closeEdit(), 350);
    } catch (e: any) {
      setEditMsg("❌ " + (e?.message ?? "Error editando usuario"));
    } finally {
      setSaving(false);
    }
  }

  // Load on token/refresh
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, refreshKey]);

  // ESC to close modal
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeEdit();
    }
    if (editing) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing]);

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;

    return users.filter((u) => {
      const fullName = `${u.firstName ?? ""} ${u.lastName ?? ""}`
        .trim()
        .toLowerCase();
      return (
        (u.username ?? "").toLowerCase().includes(q) ||
        (u.email ?? "").toLowerCase().includes(q) ||
        fullName.includes(q)
      );
    });
  }, [users, query]);

  return (
    <section className="w-full">
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {/* Header */}
        <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-slate-900">Users</h2>
            <p className="mt-1 text-sm text-slate-500">
              Administra usuarios desde Keycloak Admin API.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
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

            {/* (Si quieres quitar este botón, bórralo y listo) */}
            <button
              onClick={load}
              disabled={!token || loading}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Cargando..." : "Refrescar"}
            </button>
          </div>
        </div>

        {/* Search + counts */}
        <div className="mt-4 flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xl">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por username, nombre o email..."
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              disabled={!token}
            />
          </div>

          <div className="text-xs text-slate-500">
            Mostrando{" "}
            <span className="font-semibold text-slate-700">
              {filteredUsers.length}
            </span>{" "}
            de{" "}
            <span className="font-semibold text-slate-700">{users.length}</span>
          </div>
        </div>

        {/* States */}
        {!token && (
          <div className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800 ring-1 ring-amber-200">
            Inicia sesión para listar usuarios.
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-800 ring-1 ring-rose-200">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="mt-4 w-full overflow-hidden rounded-2xl border border-slate-200">
          <div className="w-full overflow-x-auto">
            <table className="w-full table-auto divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Usuario
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Nombre
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Email
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Estado
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredUsers.map((u) => {
                  const fullName = `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim();
                  const isAdmin = (u.username ?? "").toLowerCase() === "admin";
                  const disabledDelete = isAdmin;

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/60">
                      {/* Usuario */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-900">
                            {u.username ?? "—"}
                          </span>
                          <span className="text-xs text-slate-500">
                            ID: {shortId(u.id)}
                          </span>
                        </div>
                      </td>

                      {/* Nombre */}
                      <td className="px-4 py-3 text-sm text-slate-700">
                        {fullName ? (
                          <span className="font-medium text-slate-800">
                            {fullName}
                          </span>
                        ) : (
                          <span className="text-slate-400">Sin nombre</span>
                        )}
                      </td>

                      {/* Email */}
                      <td className="px-4 py-3 text-sm text-slate-700">
                        {u.email ? (
                          <span className="font-medium text-slate-800">{u.email}</span>
                        ) : (
                          <span className="text-slate-400">Sin email</span>
                        )}
                      </td>

                      {/* Estado */}
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

                      {/* Acciones */}
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex flex-wrap justify-end gap-4">
                          <button
                            onClick={() => openEdit(u)}
                            disabled={!canInteract}
                            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold  text-slate-800 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Editar
                          </button>

                          <button
                            onClick={() => onDelete(u.id, u.username)}
                            disabled={!canInteract || disabledDelete}
                            title={
                              disabledDelete
                                ? "No se recomienda borrar el usuario admin"
                                : "Eliminar"
                            }
                            className="inline-flex items-center justify-center rounded-xl bg-rose-600 px-3 py-2 text-sm font-semibold text-black shadow-sm transition hover:bg-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-200 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredUsers.length === 0 && !loading && (
                  <tr>
                    <td
                      className="px-4 py-10 text-center text-sm text-slate-500"
                      colSpan={5}
                    >
                      No hay usuarios que coincidan con la búsqueda.
                    </td>
                  </tr>
                )}

                {loading && (
                  <tr>
                    <td
                      className="px-4 py-10 text-center text-sm text-slate-500"
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
          Tip: usa el buscador para filtrar por username, nombre o email.
        </div>
      </div>

      {/* --- EDIT MODAL --- */}
      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeEdit();
          }}
        >
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Editar usuario
                </h3>
                <p className="text-sm text-slate-500">
                  {editing.username ?? "—"} • ID: {shortId(editing.id)}
                </p>
              </div>
              <button
                onClick={closeEdit}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Cerrar
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  First name
                </label>
                <input
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-slate-100"
                  value={editFirstName}
                  onChange={(e) => setEditFirstName(e.target.value)}
                  disabled={saving}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Last name
                </label>
                <input
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-slate-100"
                  value={editLastName}
                  onChange={(e) => setEditLastName(e.target.value)}
                  disabled={saving}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-slate-100"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  disabled={saving}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <input
                    type="checkbox"
                    checked={editEnabled}
                    onChange={(e) => setEditEnabled(e.target.checked)}
                    disabled={saving}
                  />
                  <span className="text-sm font-medium text-slate-800">
                    Usuario habilitado
                  </span>
                </label>
              </div>
            </div>

            {editMsg && (
              <div className="mt-3">
                <div
                  className={[
                    "rounded-xl px-3 py-2 text-sm ring-1",
                    editMsg.startsWith("✅") &&
                      "bg-emerald-50 text-emerald-800 ring-emerald-200",
                    editMsg.startsWith("❌") &&
                      "bg-rose-50 text-rose-800 ring-rose-200",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {editMsg}
                </div>
              </div>
            )}

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                onClick={closeEdit}
                disabled={saving}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                onClick={saveEdit}
                disabled={saving}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Tip: Presiona <span className="font-semibold">ESC</span> para cerrar.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}