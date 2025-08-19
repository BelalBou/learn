import create from 'zustand';

type ThemeMode = 'dark' | 'light';

interface ThemeState {
  mode: ThemeMode;
  toggle: () => void;
  set: (m: ThemeMode) => void;
  restore: () => void;
}

const apply = (mode: ThemeMode) => {
  const root = document.documentElement;
  if (mode === 'dark') {
    root.classList.add('theme-dark');
    root.classList.remove('theme-light');
  } else {
    root.classList.add('theme-light');
    root.classList.remove('theme-dark');
  }
};

export const useTheme = create<ThemeState>((set, get) => ({
  mode: 'dark',
  restore: () => {
    try { const saved = localStorage.getItem('theme-mode'); if (saved === 'light' || saved === 'dark') { set({ mode: saved }); apply(saved); } } catch {}
  },
  set: (m) => { set({ mode: m }); apply(m); try { localStorage.setItem('theme-mode', m); } catch {} },
  toggle: () => { const next = get().mode === 'dark' ? 'light' : 'dark'; get().set(next); }
}));
