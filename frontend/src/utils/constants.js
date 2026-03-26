// Use Vite environment variables (set in Vercel as VITE_BACKEND_URL / VITE_WS_URL)
// Falls back to local dev URLs when the env vars are not provided.
const envBase = import.meta.env.VITE_BACKEND_URL || "http://localhost:8081";
const envWs = import.meta.env.VITE_WS_URL || null;

export const BASE_URL = envBase;
export const WS_URL = envWs || `${envBase.replace(/^http/, 'ws')}/ws`;