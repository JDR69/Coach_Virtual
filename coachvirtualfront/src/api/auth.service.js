// Ajusta la ruta si tu api.js está en otra carpeta
import api from "../api/api";

// Servicio de auth compatible con SimpleJWT (access/refresh).
// Persiste tokens en localStorage.

const ME_URL = import.meta.env.VITE_ME_URL || ""; // opcional, relativo al baseURL del api

let accessToken = null;
let refreshToken = null;

export function setAccessToken(token) { accessToken = token || null; }
export function getAccessToken() { return accessToken; }

function saveTokens(access, refresh) {
  accessToken = access || null;
  refreshToken = refresh || null;
  if (access) localStorage.setItem("access_token", access);
  if (refresh) localStorage.setItem("refresh_token", refresh);
}

export function clearTokens() {
  accessToken = null; refreshToken = null;
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

export function restoreTokensFromStorage() {
  const a = localStorage.getItem("access_token");
  const r = localStorage.getItem("refresh_token");
  if (a) accessToken = a;
  if (r) refreshToken = r;
  return { accessToken: a, refreshToken: r };
}

function b64UrlDecode(str) {
  try {
    const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64).split("").map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join("")
    );
    return JSON.parse(json);
  } catch { return null; }
}
function userFromAccess(token, fallbackEmail) {
  if (!token) return null;
  const payload = b64UrlDecode((token || "").split(".")[1] || "");
  const id = payload?.user_id ?? payload?.sub ?? null;
  const email = payload?.email ?? fallbackEmail ?? null;
  return id ? { id, email } : (email ? { id: null, email } : null);
}

export const authService = {
  // SimpleJWT login (POST /api/token/)
  async login(email, password) {
    // Con tu api.js, baseURL ya es http://127.0.0.1:8000/api
    // Así que aquí usamos rutas relativas a /api
    const { data } = await api.post("/token/", { email, password });
    // data: { access, refresh }
    saveTokens(data?.access, data?.refresh);

    // Si tienes endpoint "me", úsalo; si no, crea user desde el token
    let user = null;
    if (ME_URL) {
      try {
        const me = await api.get(ME_URL);
        user = me?.data ?? null;
      } catch {
        user = null;
      }
    }
    if (!user) user = userFromAccess(data?.access, email);
    return { user, accessToken, refreshToken };
  },

  // Intento de "me" (si tienes endpoint) o desde el token restaurado
  async me() {
    if (ME_URL) {
      try {
        const { data } = await api.get(ME_URL);
        return data;
      } catch { /* fallback abajo */ }
    }
    return userFromAccess(accessToken, null);
  },

  async logout() {
    // SimpleJWT usualmente no hace logout server-side.
    clearTokens();
  },
};
