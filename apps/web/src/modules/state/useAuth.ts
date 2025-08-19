import create from 'zustand';
import axios from 'axios';

interface AuthState {
  token: string | null; // access token
  refreshToken: string | null;
  expiresAt: number | null; // epoch seconds
  email: string | null;
  displayName: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, displayName: string) => Promise<boolean>;
  logout: () => Promise<void>;
  ensureFreshToken: () => Promise<string | null>;
  restore: () => void;
}

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const persist = (data: Partial<AuthState>) => {
  try { localStorage.setItem('auth', JSON.stringify({
    token: data.token,
    refreshToken: data.refreshToken,
    expiresAt: data.expiresAt,
    email: data.email,
    displayName: data.displayName
  })); } catch {}
};

export const useAuth = create<AuthState>((set, get) => ({
  token: null,
  refreshToken: null,
  expiresAt: null,
  email: null,
  displayName: null,
  restore: () => {
    try {
      const raw = localStorage.getItem('auth');
      if (raw) {
        const parsed = JSON.parse(raw);
        set(parsed);
      }
    } catch {}
  },
  login: async (email, password) => {
    try {
      const res = await axios.post(`${API}/auth/login`, { email, password });
      set({ token: res.data.accessToken, refreshToken: res.data.refreshToken, expiresAt: res.data.expiresIn ? Math.floor(Date.now()/1000)+res.data.expiresIn : null, email });
      persist(get());
      return true;
    } catch {
      return false;
    }
  },
  register: async (email, password, displayName) => {
    try {
      const res = await axios.post(`${API}/auth/register`, { email, password, displayName });
      set({ token: res.data.accessToken, refreshToken: res.data.refreshToken, expiresAt: res.data.expiresIn ? Math.floor(Date.now()/1000)+res.data.expiresIn : null, email, displayName });
      persist(get());
      return true;
    } catch {
      return false;
    }
  },
  ensureFreshToken: async () => {
    const { token, refreshToken, expiresAt } = get();
    if (!token || !refreshToken || !expiresAt) return token;
    const now = Math.floor(Date.now()/1000);
    if (expiresAt - now > 30) return token; // still valid
    try {
      const res = await axios.post(`${API}/auth/refresh`, { refreshToken }, { headers: { Authorization: `Bearer ${token}` } });
      set({ token: res.data.accessToken, refreshToken: res.data.refreshToken, expiresAt: res.data.expiresIn ? Math.floor(Date.now()/1000)+res.data.expiresIn : null });
      persist(get());
      return res.data.accessToken;
    } catch {
      return token; // fallback
    }
  },
  logout: async () => {
    const { token, refreshToken } = get();
    if (token && refreshToken) {
      try { await axios.post(`${API}/auth/revoke`, { refreshToken }, { headers: { Authorization: `Bearer ${token}` } }); } catch {}
    }
    set({ token: null, refreshToken: null, expiresAt: null, email: null, displayName: null });
    persist({ token: null, refreshToken: null, expiresAt: null, email: null, displayName: null });
  },
}));
