

const BASE = "http://localhost:8080/admin/realms/master";

export type KCUser = {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  enabled?: boolean;
};

export async function listUsers(token: string): Promise<KCUser[]> {
  const res = await fetch(`${BASE}/users?first=0&max=50`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error listando usuarios");
  return res.json();
}

export async function createUser(token: string, payload: any) {
  const res = await fetch(`${BASE}/users`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Error creando usuario");
}

export async function updateUser(token: string, userId: string, payload: any) {
  const res = await fetch(`${BASE}/users/${userId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Error editando usuario");
}

export async function resetPassword(token: string, userId: string, newPassword: string) {
  const res = await fetch(`${BASE}/users/${userId}/reset-password`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "password",
      value: newPassword,
      temporary: false, // true si quieres que lo obligue a cambiar al entrar
    }),
  });

  if (!res.ok) throw new Error("Error reseteando password");
}

export async function deleteUser(token: string, userId: string) {
  const res = await fetch(`${BASE}/users/${userId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error eliminando usuario");
}