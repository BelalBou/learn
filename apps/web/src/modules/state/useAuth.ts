import create from 'zustand';
import axios from 'axios';

interface AuthState {
  token: string | null;
  email: string | null;
  displayName: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, displayName: string) => Promise<boolean>;
  logout: () => void;
}

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const useAuth = create<AuthState>((set) => ({
  token: null,
  email: null,
  displayName: null,
  login: async (email, password) => {
    try {
      const res = await axios.post(`${API}/auth/login`, { email, password });
      set({ token: res.data.accessToken, email });
      return true;
    } catch {
      return false;
    }
  },
  register: async (email, password, displayName) => {
    try {
      const res = await axios.post(`${API}/auth/register`, { email, password, displayName });
      set({ token: res.data.accessToken, email, displayName });
      return true;
    } catch {
      return false;
    }
  },
  logout: () => set({ token: null, email: null, displayName: null }),
}));
