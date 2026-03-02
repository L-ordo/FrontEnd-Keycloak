import React, { Suspense, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

import keycloak from "./keycloak";
import * as api from "./keycloakUsersApi";
import "./index.css";

const UsersList = React.lazy(() => import("users_list/UsersList"));
const UsersForm = React.lazy(() => import("users_form/UserForm"));

function App() {
  const [token, setToken] = useState<string>("");
  const [isAuth, setIsAuth] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [authError, setAuthError] = useState<string>("");

  async function login() {
    setAuthError("");
    try {
      await keycloak.login();
    } catch (e: any) {
      setAuthError(e?.message ?? "No se pudo iniciar sesión");
    }
  }

  async function logout() {
    try {
      await keycloak.logout({ redirectUri: window.location.origin });
    } finally {
      setToken("");
      setIsAuth(false);
    }
  }

  async function initAuth() {
    setAuthError("");
    try {
      const authenticated = await keycloak.init({
        onLoad: "check-sso",
        pkceMethod: "S256",
        checkLoginIframe: false,
      });

      setIsAuth(authenticated);

      if (authenticated && keycloak.token) {
        setToken(keycloak.token);
      } else {
        setToken("");
      }

      if (authenticated) {
        setInterval(async () => {
          try {
            const refreshed = await keycloak.updateToken(30);
            if (refreshed && keycloak.token) setToken(keycloak.token);
          } catch {
            setToken("");
            setIsAuth(false);
          }
        }, 10000);
      }
    } catch (e: any) {
      setAuthError(e?.message ?? "Error inicializando autenticación");
      setToken("");
      setIsAuth(false);
    }
  }

  useEffect(() => {
    initAuth();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      
      {/* Card principal centrada */}
      <div className="w-full max-w-4xl px-6 py-10">

        {/* HEADER */}
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            Keycloak MFE Login
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Administra usuarios desde microfrontends.
          </p>
        </header>

        {/* LOGIN CARD */}
        {!isAuth ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg text-center">
            
            <span
              className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200"
            >
              Sesión no iniciada
            </span>

            <p className="mt-4 text-sm text-slate-600">
              Inicia sesión para administrar usuarios.
            </p>

            <button
              onClick={login}
              className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300"
            >
              Login
            </button>

            {authError && (
              <div className="mt-4 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-800 ring-1 ring-rose-200">
                {authError}
              </div>
            )}
          </div>
        ) : (
          <Suspense
            fallback={
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-center">
                <p className="text-sm text-slate-600">
                  Cargando microfrontends...
                </p>
              </div>
            }
          >
            <div className="space-y-6">

              <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <span className="text-sm font-semibold text-emerald-700">
                  Sesión activa
                </span>
                <button
                  onClick={logout}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
                >
                  Logout
                </button>
              </div>

              <UsersList token={token} api={api} refreshKey={refreshKey} />

              <UsersForm
                token={token}
                api={api}
                onChanged={() => setRefreshKey((k) => k + 1)}
              />

            </div>
          </Suspense>
        )}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById("app") as HTMLElement
);
root.render(<App />);

export default App;