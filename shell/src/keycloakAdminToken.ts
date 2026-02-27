    
export async function getAdminToken() {
    const params = new URLSearchParams();
    params.append("client_id", "frontend-app");
    params.append("username", "admin");
    params.append("password", "admin");
    params.append("grant_type", "password");
  
    const res = await fetch("http://localhost:8080/realms/master/protocol/openid-connect/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
  
    if (!res.ok) throw new Error("No se pudo obtener token");
    const data = await res.json();
    return data.access_token as string;
  }