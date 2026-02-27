import React, { Suspense, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

import { getAdminToken } from "./keycloakAdminToken";
import * as api from "./keycloakUsersApi";

const UsersList = React.lazy(() => import("users_list/UsersList"));
const UsersForm = React.lazy(() => import("users_form/UserForm"));

function App() {
  const [token, setToken] = useState<string>("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [loadingToken, setLoadingToken] = useState(false);
  const [tokenError, setTokenError] = useState<string>("");

  async function loadToken() {
    setLoadingToken(true);
    setTokenError("");
    try {
      const t = await getAdminToken();
      setToken(t);
    } catch (e: any) {
      console.error(e);
      setToken("");
      setTokenError(e?.message ?? "No se pudo obtener el token");
    } finally {
      setLoadingToken(false);
    }
  }

  useEffect(() => {
    loadToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Header */}
        <header className="mb-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Keycloak MFE (Shell)</h1>
              <p className="mt-1 text-sm text-slate-600">
                Administra usuarios desde microfrontends: lista y creación.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span
                className={[
                  "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                  token
                    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                    : "bg-amber-50 text-amber-700 ring-amber-200",
                ].join(" ")}
              >
                {token ? "Token listo" : loadingToken ? "Obteniendo token..." : "Sin token"}
              </span>

              <button
                onClick={loadToken}
                disabled={loadingToken}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingToken ? "Cargando..." : "Reintentar token"}
              </button>

              <button
                onClick={() => setRefreshKey((k) => k + 1)}
                disabled={!token}
                className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Refrescar lista
              </button>
            </div>
          </div>

          {tokenError && (
            <div className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-800 ring-1 ring-rose-200">
              {tokenError}
            </div>
          )}
        </header>

        {/* Content */}
        <Suspense
          fallback={
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-600">Cargando microfrontends...</p>
            </div>
          }
        >
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left: List */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <UsersList token={token} api={api} refreshKey={refreshKey} />
            </div>

            {/* Right: Form */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <UsersForm
                token={token}
                api={api}
                onChanged={() => setRefreshKey((k) => k + 1)}
              />
              <p className="mt-3 text-xs text-slate-500">
                Tip: al crear un usuario, se incrementa <span className="font-semibold">refreshKey</span>{" "}
                para refrescar la lista automáticamente.
              </p>
            </div>
          </div>
        </Suspense>

        <footer className="mt-8 text-center text-xs text-slate-500">
          Shell: <span className="font-semibold">localhost:3000</span> • Users List:{" "}
          <span className="font-semibold">3001</span> • Users Form:{" "}
          <span className="font-semibold">3002</span>
        </footer>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("app") as HTMLElement);
root.render(<App />);

export default App;